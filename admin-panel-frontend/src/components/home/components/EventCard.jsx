export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {event.status}
          </span>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{event.date}</p>
          <p className="text-sm text-gray-600">{event.registrations} Registrations</p>
        </div>
        <div className="mt-4 flex space-x-3">
          <button className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit
          </button>
          <button className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
}