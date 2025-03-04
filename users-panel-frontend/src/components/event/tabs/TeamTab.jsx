import React from 'react';
import { Users } from 'lucide-react';

function TeamTab({ event, isRegistered }) {
  if (!isRegistered) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Required</h3>
        <p className="text-gray-500">
          Please register for the event to view team information.
        </p>
      </div>
    );
  }

  if (!event.team || event.team.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members</h3>
        <p className="text-gray-500">
          No team members have been assigned to this event yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Team</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.team.map((member, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200"
          >
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
              <p className="text-xs text-gray-500">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamTab;