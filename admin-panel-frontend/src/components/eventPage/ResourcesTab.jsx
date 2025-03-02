import { Download } from "lucide-react";

export default function ResourcesTab({ eventData }) {
  if (!eventData.resources || eventData.resources.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No resources available for this event.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Resources</h3>
      <div className="space-y-4">
        {eventData.resources.map((resource, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <svg 
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-800">{resource.name}</span>
            </div>
            
            <a
              href={resource.url}
              target="_blank"
              download
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
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