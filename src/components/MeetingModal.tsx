'use client';
import { useState, useEffect } from 'react';
import { validateMeetingTime } from '@/utils/timezone';
import { formatInTimeZone } from 'date-fns-tz';

interface User {
  id: string;
  username: string;
  email: string;
  timezone: string;
  workingHours?: { startTime: string; endTime: string };
}

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, participants: string[]) => void;
  startTime: Date;
  endTime: Date;
}

export default function MeetingModal({ isOpen, onClose, onSubmit, startTime, endTime }: MeetingModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        setUsers(users);
        
        // Filter users based on their working hours
        const available = users.filter(user => 
          validateMeetingTime(startTime, user.workingHours, user.timezone)
        );
        setAvailableUsers(available);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, startTime]);

  const formatTimeForUser = (date: Date, timezone: string) => {
    return formatInTimeZone(date, timezone, 'h:mm a');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">New Meeting</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Meeting Title"
          className="w-full p-2 border rounded mb-4 text-black"
        />
        <select
          multiple
          value={selectedUsers}
          onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, option => option.value))}
          className="w-full p-2 border rounded mb-4 h-40 text-black"
        >
          {availableUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.timezone}) - Local time: {formatTimeForUser(startTime, user.timezone)}
            </option>
          ))}
        </select>
        {users.length - availableUsers.length > 0 && (
          <p className="text-red-500 mb-4">
            {users.length - availableUsers.length} users are unavailable during this time.
          </p>
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(title, selectedUsers)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
} 