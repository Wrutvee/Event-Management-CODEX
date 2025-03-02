import { useState } from "react";
import { addCsrfToken, fetchCsrfToken } from "../../utils/csrf";
import { Download, FileText, AlertCircle } from "lucide-react";
import { useAdminProfile } from "../../context/AdminProfileContext";

export default function FeedbackTab({ eventData, onUpdate }) {
  const { adminProfile } = useAdminProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({
    isEnabled: eventData.feedback?.isEnabled || false,
    questions: eventData.feedback?.questions || [],
  });

  const questionTypes = [
    { value: "star", label: "Star Rating" },
    { value: "text", label: "Text Answer" },
    { value: "slider", label: "Slider (1-10)" },
    { value: "choice", label: "Multiple Choice" },
  ];

  const canManageFeedback = () => {
    if (!adminProfile) return false;
    
    // Superadmins can always manage feedback
    if (adminProfile.role === "superadmin") return true;
    
    // Check if current admin is the creator
    if (eventData.organizer.createdBy._id === adminProfile.id) return true;
    
    // Check if current admin is in managedBy array
    if (eventData.organizer.managedBy.some(admin => admin._id === adminProfile.id)) return true;
    
    return false;
  };

  const handleAddQuestion = () => {
    setFeedback((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          text: "",
          type: "text",
          options: [],
          required: true,
          order: prev.questions.length,
        },
      ],
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    setFeedback((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value,
      };
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleRemoveQuestion = (index) => {
    setFeedback((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleAddOption = (questionIndex) => {
    setFeedback((prev) => {
      const updatedQuestions = [...prev.questions];
      if (!updatedQuestions[questionIndex].options) {
        updatedQuestions[questionIndex].options = [];
      }
      updatedQuestions[questionIndex].options.push("");
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFeedback((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].options[optionIndex] = value;
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    setFeedback((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleSubmit = async () => {
    // Add validation
    if (feedback.isEnabled && feedback.questions.length === 0) {
      setError("Please add at least one question");
      return;
    }
    
    // Rest of submit logic...
    setIsLoading(true);
    setError(null);

    try {
      await fetchCsrfToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/events/${eventData._id}/feedback`,
        {
          method: "PUT",
          headers: addCsrfToken({
            "Content-Type": "application/json",
          }),
          credentials: "include",
          body: JSON.stringify({ feedback }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update feedback settings");
      }

      if (onUpdate) {
        onUpdate({ ...eventData, feedback });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl shadow-sm p-6 bg-gray-50 max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Feedback Collection
        </h2>
        <p className="text-gray-500 text-sm">
          Configure how you'll collect feedback from event attendees
        </p>
      </div>

      {canManageFeedback() ? (
        <>
          <div className="flex items-center bg-indigo-50 p-4 rounded-lg mb-6">
            <input
              type="checkbox"
              id="enableFeedback"
              className="h-5 w-5 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
              checked={feedback.isEnabled}
              onChange={(e) =>
                setFeedback((prev) => ({ ...prev, isEnabled: e.target.checked }))
              }
            />
            <label
              htmlFor="enableFeedback"
              className="ml-3 font-medium text-indigo-700"
            >
              Enable Feedback Collection
            </label>
          </div>

          {feedback.isEnabled && (
            <div className="space-y-6">
              <div className="rounded-lg shadow-inner">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Questions ({feedback.questions.length})
                </h3>

                {feedback.questions.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    No questions added yet. Add your first question below.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedback.questions.map((question, questionIndex) => (
                      <div
                        key={questionIndex}
                        className="bg-white p-3 sm:p-6 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md"
                      >
                        <div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <div className="flex justify-between items-start">
                                <div className="block text-sm font-medium text-gray-700 mb-1">
                                  Question {questionIndex + 1}
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveQuestion(questionIndex)
                                    }
                                    className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                placeholder="Enter your question"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={question.text}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    questionIndex,
                                    "text",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Answer Type
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={question.type}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    questionIndex,
                                    "type",
                                    e.target.value
                                  )
                                }
                              >
                                {questionTypes.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`required-${questionIndex}`}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={question.required}
                                onChange={(e) =>
                                  handleQuestionChange(
                                    questionIndex,
                                    "required",
                                    e.target.checked
                                  )
                                }
                              />
                              <label
                                htmlFor={`required-${questionIndex}`}
                                className="text-sm text-gray-500"
                              >
                                Required question
                              </label>
                            </div>

                            {question.type === "choice" && (
                              <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Answer Options
                                  </label>
                                </div>

                                <div className="space-y-2">
                                  {question.options?.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">
                                      No options added yet
                                    </p>
                                  )}

                                  {question.options?.map((option, optionIndex) => (
                                    <div
                                      key={optionIndex}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="text-gray-400 text-sm">
                                        {optionIndex + 1}.
                                      </span>
                                      <input
                                        type="text"
                                        placeholder={`Option ${optionIndex + 1}`}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={option}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            questionIndex,
                                            optionIndex,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveOption(
                                            questionIndex,
                                            optionIndex
                                          )
                                        }
                                        className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => handleAddOption(questionIndex)}
                                    className="mt-2 inline-flex items-center px-3 py-1.5 border border-indigo-300 text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 mr-1"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Add Option
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-3 border-2 border-dashed border-indigo-200 rounded-lg text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Question
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center shadow-sm transition-colors"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Read-only view for non-managers
        <div className="space-y-6">
          {feedback.isEnabled ? (
            <div className="rounded-lg shadow-inner">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-700">
                  Feedback collection is enabled for this event
                </p>
              </div>
              
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Feedback Questions
              </h3>
              
              <div className="space-y-4">
                {feedback.questions.map((question, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <p className="font-medium text-gray-900 mb-2">
                      {index + 1}. {question.text}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                      {question.required && (
                        <span className="ml-2 text-red-600">*Required</span>
                      )}
                    </div>
                    
                    {question.type === 'choice' && question.options?.length > 0 && (
                      <div className="mt-3 pl-4">
                        <p className="text-sm text-gray-500 mb-2">Options:</p>
                        <ul className="list-disc pl-4 text-sm text-gray-600">
                          {question.options.map((option, optionIndex) => (
                            <li key={optionIndex}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              Feedback collection is not enabled for this event.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ResourcesTab({ eventData }) {
  if (!eventData.resources || eventData.resources.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
          <AlertCircle className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm sm:text-base">
          No resources available for this event.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
          Event Resources
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Download materials related to this event
        </p>
      </div>

      <div className="grid gap-4">
        {eventData.resources.map((resource, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center min-w-0">
              <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0">
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {resource.name}
                </p>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
                  PDF Document
                </p>
              </div>
            </div>
            
            <a
              href={resource.url}
              download
              className="ml-4 sm:ml-6 inline-flex items-center px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors gap-1.5 sm:gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
