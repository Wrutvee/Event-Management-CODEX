import React from 'react';
import { Users } from 'lucide-react';

function MyTeamTab({ event, isRegistered }) {
  if (!isRegistered) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Register to View Team Information</h3>
        <p className="text-gray-500">
          You need to register for this event to view team information.
        </p>
      </div>
    );
  }

  if (!event.team || event.team.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Team Information Available</h3>
        <p className="text-gray-500">
          Team information for this event hasn't been added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Team</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {event.team.map((member, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} 
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{member.name}</h4>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTeamTab;