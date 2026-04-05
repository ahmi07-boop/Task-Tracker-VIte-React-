import { useEffect, useMemo, useState } from 'react'
import TaskControls from './components/TaskControls'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

const TASKS_STORAGE_KEY = 'tasks'
const REMINDER_LOG_KEY = 'taskReminderLog'

function readTasks() {
  try {
    const saved = localStorage.getItem(TASKS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function readReminderLog() {
  try {
    const saved = localStorage.getItem(REMINDER_LOG_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function getTaskDueDateTime(task) {
  if (!task?.dueDate) return null

  const dateTimeValue = task.dueTime
    ? `${task.dueDate}T${task.dueTime}`
    : `${task.dueDate}T23:59`

  const dueDate = new Date(dateTimeValue)
  return Number.isNaN(dueDate.getTime()) ? null : dueDate
}

export default function App() {
  const [tasks, setTasks] = useState(() => readTasks())
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const notifyUser = (message) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Task Reminder', { body: message })
      } else {
        console.log('Reminder:', message)
      }
    }

    const checkReminders = () => {
      const now = new Date()
      const reminderLog = readReminderLog()
      let changed = false

      tasks.forEach((task) => {
        if (task.completed || !task.dueDate) return

        const dueDateTime = getTaskDueDateTime(task)
        if (!dueDateTime || now < dueDateTime) return

        const reminderType = now.toDateString() === dueDateTime.toDateString() ? 'due' : 'overdue'
        const key = `${task.id}:${task.dueDate}:${task.dueTime || '23:59'}:${reminderType}`

        if (reminderLog[key]) return

        const reminderTime = task.dueTime ? ` at ${task.dueTime}` : ''

        if (reminderType === 'due') {
          notifyUser(`Task "${task.text}" is due now${reminderTime}!`)
        } else {
          notifyUser(`Task "${task.text}" is overdue${reminderTime ? ` since ${task.dueDate} ${task.dueTime}` : ''}!`)
        }

        reminderLog[key] = true
        changed = true
      })

      if (changed) {
        localStorage.setItem(REMINDER_LOG_KEY, JSON.stringify(reminderLog))
      }
    }

    checkReminders()
    const intervalId = window.setInterval(checkReminders, 30000)
    return () => window.clearInterval(intervalId)
  }, [tasks])

  const counts = useMemo(() => {
    const pending = tasks.filter((task) => !task.completed).length
    const completed = tasks.filter((task) => task.completed).length
    return { pending, completed }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    let filtered = [...tasks]

    if (filter === 'pending') {
      filtered = filtered.filter((task) => !task.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((task) => task.text.toLowerCase().includes(query))
    }

    if (sortBy === 'dueDate') {
      filtered.sort((a, b) => {
        const aDue = getTaskDueDateTime(a)
        const bDue = getTaskDueDateTime(b)
        if (!aDue) return 1
        if (!bDue) return -1
        return aDue - bDue
      })
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 }
      filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    }

    return [
      ...filtered.filter((task) => !task.completed),
      ...filtered.filter((task) => task.completed),
    ]
  }, [tasks, filter, searchQuery, sortBy])

  const addTask = ({ text, dueDate, dueTime, priority }) => {
    const normalizedText = text.trim()
    if (!normalizedText) return

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        text: normalizedText,
        completed: false,
        dueDate,
        dueTime,
        priority,
      },
    ])
  }

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (id) => {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  const editTask = (id, newText) => {
    const normalizedText = newText.trim()
    if (!normalizedText) return

    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, text: normalizedText } : task,
      ),
    )
  }

  const clearAllTasks = () => {
    if (window.confirm('Are you sure you want to clear all tasks?')) {
      setTasks([])
      localStorage.removeItem(REMINDER_LOG_KEY)
    }
  }

  return (
    <main className="app-shell">
      <section className="card">
        <header className="header">
          <h1>Task Tracker</h1>
          <p className="counter">
            {counts.pending} Pending | {counts.completed} Completed
          </p>
        </header>

        <TaskControls
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <TaskForm onAddTask={addTask} />

        <TaskList
          tasks={visibleTasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />

        <button type="button" className="clear-btn" onClick={clearAllTasks}>
          Clear All Tasks
        </button>
      </section>
    </main>
  )
}
