export default function EventsHeader({ activeView, setActiveView }) {
  return (
    <div className="mb-8">
      
      <div className="flex justify-center space-x-4">
        {['My Events', 'Upcoming', 'Past'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-md ${
              activeView === view
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}