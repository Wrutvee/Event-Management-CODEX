export default function EventTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", name: "Overview" },
    { id: "timeline", name: "Timeline" },
    { id: "resources", name: "Resources" },
    { id: "feedback", name: "Feedback" },
    { id: "attendance", name: "Attendance" },
    { id: "certificates", name: "Certificates" },
    { id: "analytics", name: "Analytics" },
    { id: "settings", name: "Settings" },
  ];

  return (
    <div className="bg-gray-300 p-2 rounded-t-lg">
      <nav className="flex overflow-x-auto justify-around pb-2 tab-scroll">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}