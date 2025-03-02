import { useState, useEffect } from "react";
import { Dashboard } from "@uppy/react";
import Uppy from "@uppy/core";
import FileInput from '@uppy/file-input';
import DragDrop from '@uppy/drag-drop';
import { validateEventForm } from "./InputValidation";
import { addCsrfToken, fetchCsrfToken } from "../../../utils/csrf";

// Import Uppy CSS
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";

const defaultFormFields = [
  { id: "name", label: "Name", required: true },
  { id: "branch", label: "Branch", required: false },
  { id: "year", label: "Year", required: false },
  { id: "regNumber", label: "Registration Number", required: false },
];

export default function EventForm({
  initialData = null,
  onSubmit,
  submitButtonText = "Publish Event",
  mode = "create"
}) 
  {
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    };
    const defaultFormState = {
      title: "",
      description: "",
      coverPhoto: "", // Add this field
      mediaLinks: [],
      resources: [],
      category: "",
      tags: [],
      organizer: {
        name: "",
        email: "",
        contact: "",
        managedBy: [],
      },
      venue: {
        type: "offline",
        details: "",
      },
      dateTime: {
        start: "",
        end: "",
        durationInHours: 0,
      },
      registration: {
        isRequired: false,
        formFields: [],
        additionalInfo: {
          required: false,
          question: "",
        },
        fee: 0,
        deadline: "",
      },
      capacity: {
        required: false,
        maxParticipants: 0,
        isTeamFormationRequired: false,
        minTeamSize: 1,
        maxTeamSize: 1,
      },
      attendance: {
        qrCheckin: false,
        manualCheckin: false,
      },
      promotionLinks: {
        instagram: "",
        twitter: "",
        website: "",
      },
      certificates: {
        willItBeProvided: false,
      },
      visibility: "public",
    };

    const [formData, setFormData] = useState(() => {
      if (!initialData) return defaultFormState;

      return {
        ...initialData,
        dateTime: {
          ...initialData.dateTime,
          start: formatDateForInput(initialData.dateTime.start),
          end: formatDateForInput(initialData.dateTime.end),
        },
        registration: {
          ...initialData.registration,
          deadline: initialData.registration.deadline
            ? formatDateForInput(initialData.registration.deadline)
            : "",
        },
        // Transform managedBy array to only contain emails
        organizer: {
          ...initialData.organizer,
          managedBy: initialData.organizer.managedBy.map(manager => 
            typeof manager === 'object' ? manager.email : manager
          ),
        }
      };
    });
  
  const [tagInput, setTagInput] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [savedDrafts, setSavedDrafts] = useState([]);
  const [showDraftLimitOverlay, setShowDraftLimitOverlay] = useState(false);

  useEffect(() => {
    if(mode === "create"){
        try {
        const drafts = JSON.parse(localStorage.getItem("eventDrafts") || "[]");
        setSavedDrafts(Array.isArray(drafts) ? drafts : []);
        } catch (error) {
        console.error("Error loading drafts:", error);
        setSavedDrafts([]);
        }
    }
  }, [mode]);

  // Add function to load a specific draft
  const loadDraft = (draftId) => {
    try {
      const draft = savedDrafts.find((d) => d.id === draftId);
      if (draft?.data) { // Add null check for data
        setFormData(draft.data);
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  };

  // Add function to delete a draft
  const deleteDraft = (draftId) => {
    try {
      const updatedDrafts = savedDrafts.filter((d) => d.id !== draftId);
      localStorage.setItem("eventDrafts", JSON.stringify(updatedDrafts));
      setSavedDrafts(updatedDrafts);

      // Close overlay if drafts are now under limit
      if (updatedDrafts.length < 3) {
        setShowDraftLimitOverlay(false);
      }
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  };

  const handleAddManager = (e) => {
    e.preventDefault();
    if (managerEmail && !formData.organizer.managedBy.includes(managerEmail)) {
      setFormData({
        ...formData,
        organizer: {
          ...formData.organizer,
          managedBy: [...formData.organizer.managedBy, managerEmail],
        },
      });
      setManagerEmail("");
    }
  };

  const handleSubmit = async (isDraft = false) => {
    if (isDraft) {
      try {
        // Check draft limit before saving
        const existingDrafts = JSON.parse(
          localStorage.getItem("eventDrafts") || "[]"
        );
        if (existingDrafts.length >= 3) {
          // Show the overlay instead of throwing error
          setShowDraftLimitOverlay(true);
          return;
        }

        // Handle draft saving if under limit
        await onSubmit(true, formData);
      } catch (error) {
        setError(error.message);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    // Validate form
    const validationErrors = validateEventForm(formData, mode === "edit");
    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      setIsLoading(false);
      return;
    }

    const transformedData = {
      ...formData,
      registration: {
        ...formData.registration,
        formFields: formData.registration.formFields.map((fieldId) => {
          // Add null check and default value
          const fieldConfig = defaultFormFields.find(
            (f) => f.id === fieldId
          ) || {
            id: fieldId,
            label: fieldId,
            required: false,
          };
          return {
            id: fieldConfig.id,
            label: fieldConfig.label,
            required: fieldConfig.required,
          };
        }),
      },
    };


    // Submit form
    try {
      await onSubmit(isDraft, transformedData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const uploadToGCS = async (file) => {
    try {
      // Get signed URL for upload
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/uploads/generate-upload-url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...addCsrfToken(),
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, fileName } = await response.json();

      // Upload to GCS
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file.data,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Return the public URL in the correct format
      return `https://storage.googleapis.com/${import.meta.env.VITE_GCS_BUCKET_NAME}/${encodeURIComponent(fileName)}`;
    } catch (error) {
      console.error("Upload failed:", error); 
      throw new Error('File upload failed. Please try again.');
    }
  };

  const configureUppy = (fileType) => {
    const uppy = new Uppy({
      restrictions: {
        maxFileSize: fileType === 'media' ? 20 * 1024 * 1024 : 5 * 1024 * 1024,
        allowedFileTypes: fileType === 'resource' ? ['.pdf'] : ['image/*', 'video/*'],
        // Add maxNumberOfFiles restriction for cover photo
        maxNumberOfFiles: fileType === 'cover' ? 1 : null
      },
      autoProceed: false
    });

    uppy.on("file-added", async (file) => {
      try {
        // For cover photo, remove any existing files first
        if (fileType === "cover") {
          const existingFiles = uppy.getFiles();
          existingFiles.forEach(existingFile => {
            if (existingFile.id !== file.id) {
              uppy.removeFile(existingFile.id);
            }
          });
        }

        const uploadedUrl = await uploadToGCS(file);
        
        if (fileType === "cover") {
          setFormData((prev) => ({ ...prev, coverPhoto: uploadedUrl }));
        } else if (fileType === "media") {
          setFormData((prev) => ({
            ...prev,
            mediaLinks: [
              ...prev.mediaLinks,
              { url: uploadedUrl, type: file.type },
            ],
          }));
        } else if (fileType === "resource") {
          setFormData((prev) => ({
            ...prev,
            resources: [
              ...prev.resources,
              {
                name: file.name,
                url: uploadedUrl,
                type: file.type,
              },
            ],
          }));
        }
      } catch (error) {
        uppy.removeFile(file.id);
        setError(error.message);
      }
    });

    return uppy;
  };

  const [coverPhotoUppy] = useState(() => configureUppy("cover"));
  const [mediaUppy] = useState(() => configureUppy("media")); 
  const [resourcesUppy] = useState(() => configureUppy("resource"));

  // Clean up Uppy instances on unmount
  // useEffect(() => {
  //   return () => {
  //     coverPhotoUppy.close();
  //     mediaUppy.close();
  //     resourcesUppy.close();
  //   };
  // }, [coverPhotoUppy, mediaUppy, resourcesUppy]);

  const categories = [
    "Hackathon",
    "Workshop",
    "Seminar",
    "Conference",
    "Cultural",
    "Technical",
    "Sports",
    "Other",
  ];

  return (
    <div className="space-y-8">
      {mode === "create" && savedDrafts?.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Saved Drafts
          </h2>
          <div className="space-y-2">
            {savedDrafts.map((draft) => (
              <div
                key={draft?.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">
                    {draft?.data?.title || "Untitled Event"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last modified:{" "}
                    {draft?.lastModified
                      ? new Date(draft.lastModified).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => loadDraft(draft?.id)}
                    className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDraft(draft?.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Draft Limit Overlay */}
      {showDraftLimitOverlay && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Draft Limit Reached
            </h3>
            <p className="text-gray-600 mb-6">
              You have reached the maximum limit of 3 drafts. Please delete at
              least one draft to save a new one.
            </p>
            <div className="space-y-4">
              {savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">
                      {draft.data.title || "Untitled Event"}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Last modified:{" "}
                      {new Date(draft.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteDraft(draft.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDraftLimitOverlay(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-8">
        {/* Basic Event Information */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Basic Event Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Title*
              </label>
              <input
                type="text"
                required
                className="mt-1 h-8 px-4 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category*
              </label>
              <select
                required
                className="mt-1 h-8 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Description*
              </label>
              <textarea
                required
                rows={4}
                className="mt-1 px-4 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  placeholder="Add tags separated by commas"
                  className="flex-1 h-8 px-4 border rounded-md border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    // Update tags array when comma or Enter is pressed
                    if (e.target.value.endsWith(",")) {
                      const newTags = e.target.value
                        .slice(0, -1) // Remove the trailing comma
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean);
                      setFormData({
                        ...formData,
                        tags: [...new Set([...formData.tags, ...newTags])], // Remove duplicates
                      });
                      setTagInput(""); // Clear input after adding tags
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (tagInput) {
                        const newTags = tagInput
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean);
                        setFormData({
                          ...formData,
                          tags: [...new Set([...formData.tags, ...newTags])],
                        });
                        setTagInput("");
                      }
                    }
                  }}
                />
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-indigo-200"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tags: formData.tags.filter((_, i) => i !== index),
                          });
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Cover Photo */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Cover Photo
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Upload a cover photo for your event. Maximum size: 5MB
            </p>

            <Dashboard
              uppy={coverPhotoUppy}
              plugins={["FileInput", "DragDrop"]}
              height={300}
              width="100%"
              showProgressDetails={true}
              proudlyDisplayPoweredByUppy={false}
              className="z-50!"
            />

            {formData.coverPhoto && (
              <div className="mt-4 relative group w-full max-w-md">
                <div className="h-[170px] overflow-hidden rounded-lg">
                  <img
                    src={formData.coverPhoto}
                    alt="Cover"
                    className="w-full h-[170px] object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, coverPhoto: "" })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </section>

        {/* media uploads */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Event Media
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Upload up to 10 photos/videos. Maximum size: 5MB for images, 20MB
              for videos.
            </p>
            <Dashboard
              uppy={mediaUppy}
              plugins={["FileInput", "DragDrop"]}
              height={300}
              width="100%"
              showProgressDetails={true}
              proudlyDisplayPoweredByUppy={false}
            />
            {formData.mediaLinks.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.mediaLinks.map((media, index) => (
                  <div key={index} className="relative group">
                    {/* Check if media is an object with type property or just a URL string */}
                    {media.type ? (
                      // For newly uploaded media with type property
                      media.type.startsWith("image/") ? (
                        <img
                          src={media.url}
                          alt={media.name}
                          className="h-24 w-full object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="h-24 w-full object-cover rounded-lg"
                        />
                      )
                    ) : (
                      // For existing media URLs from backend
                      <img
                        src={media}
                        alt={`Media ${index + 1}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          mediaLinks: formData.mediaLinks.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* resource uploads */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Resources
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Upload PDF resources for your event.
            </p>
            <Dashboard
              uppy={resourcesUppy}
              plugins={["FileInput", "DragDrop"]}
              height={300}
              width="100%"
              showProgressDetails={true}
              proudlyDisplayPoweredByUppy={false}
            />
            {formData.resources.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">
                        {resource.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({resource.url ? "Uploaded" : "Pending"})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          resources: formData.resources.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Organizer Details */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Organizer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organizer Name*
              </label>
              <input
                type="text"
                required
                className="mt-1 px-4 h-8 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.organizer.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizer: {
                      ...formData.organizer,
                      name: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contact Number*
              </label>
              <input
                type="tel"
                required
                className="mt-1 px-4 h-8 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.organizer.contact}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizer: {
                      ...formData.organizer,
                      contact: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Email*
              </label>
              <input
                type="email"
                required
                className="mt-1 px-4 h-8 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.organizer.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizer: {
                      ...formData.organizer,
                      email: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Event Managers */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Event Managers
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Add email addresses of other admins who can manage this event.
              Only existing admin accounts will be added as managers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                placeholder="Enter admin email"
                className="flex-1 h-11 px-4 border rounded-md border-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddManager}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>

            {formData.organizer.managedBy.length > 0 && (
              <div className="space-y-2">
                {formData.organizer.managedBy.map((managerEmail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">
                      {typeof managerEmail === 'object' ? managerEmail.email : managerEmail}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          organizer: {
                            ...formData.organizer,
                            managedBy: formData.organizer.managedBy.filter(
                              (_, i) => i !== index
                            ),
                          },
                        })
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Event Schedule & Venue */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Event Schedule & Venue
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date & Time*
              </label>
              <input
                type="datetime-local"
                required
                className="mt-1 h-8 px-4 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.dateTime.start}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateTime: {
                      ...formData.dateTime,
                      start: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date & Time*
              </label>
              <input
                type="datetime-local"
                required
                className="mt-1 h-8 px-4 border block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.dateTime.end}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateTime: {
                      ...formData.dateTime,
                      end: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Venue Type*
              </label>
              <select
                required
                className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.venue.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, type: e.target.value },
                  })
                }
              >
                <option value="offline">Offline</option>
                <option value="online">Online</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {formData.venue.type === "online"
                  ? "Meeting Link*" // make it not compuslory as venue and meeting link can be decided later
                  : "Venue Details*"}
              </label>
              <input
                type="text"
                required
                className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formData.venue.details}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, details: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Registration Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Registration Settings
          </h2>
          <div className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireRegistration"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.registration.isRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registration: {
                      ...formData.registration,
                      isRequired: e.target.checked,
                    },
                  })
                }
              />
              <label
                htmlFor="requireRegistration"
                className="ml-2 block text-sm text-gray-700"
              >
                Require Registration
              </label>
            </div>

            {formData.registration.isRequired && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.registration.deadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registration: {
                          ...formData.registration,
                          deadline: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Form Fields
                  </label>
                  <div className="space-y-2">
                    {defaultFormFields.map((field) => (
                      <div key={field.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={field.id}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          checked={formData.registration.formFields.includes(
                            field.id
                          )}
                          onChange={(e) => {
                            const updatedFields = e.target.checked
                              ? [...formData.registration.formFields, field.id]
                              : formData.registration.formFields.filter(
                                  (f) => f !== field.id
                                );
                            setFormData({
                              ...formData,
                              registration: {
                                ...formData.registration,
                                formFields: updatedFields,
                              },
                            });
                          }}
                        />
                        <label
                          htmlFor={field.id}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {field.label}
                          {field.required && "*"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="additionalInfo"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={formData.registration.additionalInfo.required}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          registration: {
                            ...formData.registration,
                            additionalInfo: {
                              ...formData.registration.additionalInfo,
                              required: e.target.checked,
                            },
                          },
                        })
                      }
                    />
                    <label
                      htmlFor="additionalInfo"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Request Additional Information
                    </label>
                  </div>

                  {formData.registration.additionalInfo.required && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Additional Information Question*
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Please describe your previous experience..."
                        className="mt-1 px-4 border h-11 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        value={formData.registration.additionalInfo.question}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registration: {
                              ...formData.registration,
                              additionalInfo: {
                                ...formData.registration.additionalInfo,
                                question: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Capacity & Team Formation */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Capacity & Team Formation
          </h2>
          <div className="space-y-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="limitCapacity"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.capacity.required}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: {
                      ...formData.capacity,
                      required: e.target.checked,
                    },
                  })
                }
              />
              <label
                htmlFor="limitCapacity"
                className="ml-2 block text-sm text-gray-700"
              >
                Limit Participant Capacity
              </label>
            </div>

            {formData.capacity.required && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Maximum Participants
                </label>
                <input
                  type="number"
                  min="1"
                  className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.capacity.maxParticipants}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capacity: {
                        ...formData.capacity,
                        maxParticipants: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="teamFormation"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.capacity.isTeamFormationRequired}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: {
                      ...formData.capacity,
                      isTeamFormationRequired: e.target.checked,
                    },
                  })
                }
              />
              <label
                htmlFor="teamFormation"
                className="ml-2 block text-sm text-gray-700"
              >
                Enable Team Formation
              </label>
            </div>

            {formData.capacity.isTeamFormationRequired && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.capacity.minTeamSize}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: {
                          ...formData.capacity,
                          minTeamSize: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maximum Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={formData.capacity.maxTeamSize}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: {
                          ...formData.capacity,
                          maxTeamSize: parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Attendance Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Attendance Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="qrCheckin"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.attendance.qrCheckin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attendance: {
                      ...formData.attendance,
                      qrCheckin: e.target.checked,
                    },
                  })
                }
              />
              <label
                htmlFor="qrCheckin"
                className="ml-2 block text-sm text-gray-700"
              >
                Enable QR Check-in
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="manualCheckin"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.attendance.manualCheckin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    attendance: {
                      ...formData.attendance,
                      manualCheckin: e.target.checked,
                    },
                  })
                }
              />
              <label
                htmlFor="manualCheckin"
                className="ml-2 block text-sm text-gray-700"
              >
                Enable Manual Check-in
              </label>
            </div>
          </div>
        </section>

        {/* Certificate Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Certificate Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="provideCertificates"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={formData.certificates.willItBeProvided}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    certificates: {
                      ...formData.certificates,
                      willItBeProvided: e.target.checked,
                      isAutoGenerated: false,
                      customizable: false,
                    },
                  })
                }
              />
              <label
                htmlFor="provideCertificates"
                className="ml-2 block text-sm text-gray-700"
              >
                Provide Certificates
              </label>
            </div>
          </div>
        </section>

        {/* Promotion Links */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Promotion Links
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="url"
                className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://instagram.com/..."
                value={formData.promotionLinks.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promotionLinks: {
                      ...formData.promotionLinks,
                      instagram: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Twitter
              </label>
              <input
                type="url"
                className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://twitter.com/..."
                value={formData.promotionLinks.twitter}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promotionLinks: {
                      ...formData.promotionLinks,
                      twitter: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://..."
                value={formData.promotionLinks.website}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    promotionLinks: {
                      ...formData.promotionLinks,
                      website: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </section>

        {/* Visibility Settings */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Visibility Settings
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Event Visibility
            </label>
            <select
              className="mt-1 px-4 border h-8 block w-full rounded-md border-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
            >
              <option value="public">Public</option>
              <option value="private" disabled>
                Private (Invite Only coming soon...!)
              </option>
            </select>
          </div>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {/* Show draft button only in create mode */}
          {mode === "create" && (
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Save as Draft
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? <div className="dots-loader" /> : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}