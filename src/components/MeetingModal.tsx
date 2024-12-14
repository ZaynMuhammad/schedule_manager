'use client';
import { useState, useEffect } from 'react';
import { isWithinWorkingHours } from '@/utils/timeValidation';
import { convertTimeIfDifferentTimeZone } from '@/business-logic/timeZoneConversions';
import { useAppSelector } from '@/store/hooks';

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

export default function MeetingModal({ isOpen, onClose, onSubmit, startTime, endTime, userTimezone }: MeetingModalProps) {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [unavailableUsers, setUnavailableUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const otherUsers = allUsers.filter(user => user.id !== currentUser?.id);
        
        setUsers(otherUsers);
        
        const available = [];
        const unavailable = [];
        for (const user of otherUsers) {
          if (isWithinWorkingHours(startTime, user, user.timezone).isValid) {
            available.push(user);
          } else {
            unavailable.push(user);
          }
        }
        setAvailableUsers(available);
        setUnavailableUsers(unavailable);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen, startTime, currentUser?.id]);

  const handleSubmit = async () => {
    // Check if any selected users are in the unavailable list
    const selectedUnavailableUsers = unavailableUsers.filter(user => 
      selectedUsers.includes(user.id)
    );

    if (selectedUnavailableUsers.length > 0) {
      const userNames = selectedUnavailableUsers.map(user => user.username).join(', ');
      const confirmed = window.confirm(
        `This meeting is outside working hours for: ${userNames}.\nDo you want to schedule anyway?`
      );
      
      if (!confirmed) {
        return;
      }
    }

    onSubmit(title, selectedUsers);
  };

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-97">
        <h2 className="text-xl font-bold mb-4 text-center text-black">New Meeting</h2>
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
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {
                convertTimeIfDifferentTimeZone(user, userTimezone, startTime, endTime, userTimezone)
              }
            </option>
          ))}
        </select>
        {users.length - availableUsers.length > 0 && (
          <p className="text-red-500 mb-4">
            {users.length - availableUsers.length} users are unavailable during this time.
            Unavailable users: {unavailableUsers.map(user => user.username).join(', ')}
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
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
} 