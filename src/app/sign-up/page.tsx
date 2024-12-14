'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { timezones } from '@/utils/timezone-values';

console.log('Timezones:', timezones);

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    timezone: "America/New_York",
    startTime: "",
    endTime: ""
  })
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const getEndTimeOptions = () => {
    if (!user.startTime) return [];
    const times = [];
    const [startHour] = user.startTime.split(':').map(Number);
    
    for (let i = startHour + 1; i <= 23; i++) {
      const time = `${i.toString().padStart(2, '0')}:00`;
      times.push(time);
    }
    if (startHour !== 23) {
      times.push('00:00');
    }
    return times;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          password: user.password,
          timezone: user.timezone,
          startTime: user.startTime,
          endTime: user.endTime
        }),
      });

      if (response.ok) {
        router.push('/sign-in');
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
      console.error('Error signing up:', error);
    }
  };

  // TODO: Turn this into a map
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={user.email}
            name="email"
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded text-black"
            required
          />
          <input
            type="text"
            value={user.username}
            name="username"
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-2 border rounded text-black"
            required
          />
          <input
            type="password"
            value={user.password}
            name="password"
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-2 border rounded text-black"
            required
          />
          <select
            name="timezone"
            value={user.timezone}
            onChange={handleChange}
            className="w-full p-2 border rounded text-black"
            required
          >
            {timezones.map(tz => (
              <option key={tz} value={tz}>
                {tz.replace('_', ' ')}
              </option>
            ))}
          </select>
          <div className="flex gap-4">
            <select
              name="startTime"
              value={user.startTime}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded text-black"
              required
            >
              <option value="">Start Time</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                  {`${i.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>
            <select
              name="endTime"
              value={user.endTime}
              onChange={handleChange}
              className="w-1/2 p-2 border rounded text-black"
              disabled={!user.startTime}
              required
            >
              <option value="">End Time</option>
              {getEndTimeOptions().map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <button 
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}