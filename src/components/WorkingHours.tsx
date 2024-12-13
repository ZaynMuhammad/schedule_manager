'use client'
import { useState } from 'react'

export default function WorkingHoursForm() {
  const [workingHours, setWorkingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
    workDays: [1, 2, 3, 4, 5]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Dispatch action to save working hours
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="time"
        value={workingHours.startTime}
        onChange={(e) => setWorkingHours({...workingHours, startTime: e.target.value})}
      />
      <input
        type="time"
        value={workingHours.endTime}
        onChange={(e) => setWorkingHours({...workingHours, endTime: e.target.value})}
      />
      {/* Add work days selection */}
    </form>
  )
}