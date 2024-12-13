'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { timezones } from '../../utils/timezones';

console.log('Timezones:', timezones);

export default function SignUpPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    timezone: "America/New_York"
  })
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
          timezone: user.timezone
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