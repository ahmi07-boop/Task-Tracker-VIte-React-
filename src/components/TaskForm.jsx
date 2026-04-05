import { useState } from 'react'

export default function TaskForm({ onAddTask }) {
  const [text, setText] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')
  const [priority, setPriority] = useState('low')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!text.trim()) return

    onAddTask({ text, dueDate, dueTime, priority })
    setText('')
    setDueDate('')
    setDueTime('')
    setPriority('low')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a new task..."
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <input
        type="time"
        value={dueTime}
        onChange={(event) => setDueTime(event.target.value)}
        disabled={!dueDate}
      />

      <select value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  )
}
