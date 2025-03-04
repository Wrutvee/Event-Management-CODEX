import React from 'react';
import { Download, FileText } from 'lucide-react';

function ResourcesTab({ event }) {
  if (!event.resources || event.resources.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Resources Available</h3>
        <p className="text-gray-500">
          The organizer hasn't uploaded any resources for this event yet.
        </p>
      </div>
    );
  }

  // Function to get icon based on file type
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return (
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 384 512">
            <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z" />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 384 512">
            <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H208c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h73.1c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zm-56 48h-8c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8zm0 96h-8c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8zm0 96h-8c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8zm64-96h-8c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8zm0 96h-8c-4.4 0-8-3.6-8-8v-16c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
          </svg>
        );
      case 'xls':
      case 'xlsx':
        return (
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 384 512">
            <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5L160 336l-60.1-93.5c-5.1-8 .6-18.5 10.1-18.5h34.9c4.4 0 8.5 2.4 10.6 6.3 21.3 38.8 35.7 59.9 38.5 65 12.2-29.5 28.1-52.3 38.6-65 2.1-3.9 6.2-6.3 10.6-6.3H278c9.5-.1 15.2 10.4 10.1 18.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
          </svg>
        );
      case 'ppt':
      case 'pptx':
        return (
          <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 384 512">
            <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm96 144c0 4.4-3.6 8-8 8h-80v112c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V288h-80c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8h224c4.4 0 8 3.6 8 8v48zm-8-144v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
          </svg>
        );
      case 'zip':
      case 'rar':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 384 512">
            <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm-96 208c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm0-64c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm0-64c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm96 192c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm0-64c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm0-64c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm96 128c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm0-64c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm0-64c0 4.4-3.6 8-8 8h-8c-4.4 0-8-3.6-8-8v-32c0-4.4 3.6-8 8-8h8c4.4 0 8 3.6 8 8v32zm0-64c0-35.3-28.7-64-64-64h-8v128h8c35.3 0 64-28.7 64-64z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 384 512">
            <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Resources</h3>
      <div className="grid gap-4">
        {event.resources.map((resource, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                {getFileIcon(resource.type)}
              </div>
              <span className="font-medium text-gray-800">{resource.name}</span>
            </div>
            
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
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

export default ResourcesTab;