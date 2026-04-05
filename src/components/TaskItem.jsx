import { useMemo, useState } from 'react'

function getDueDateTime(task) {
  if (!task?.dueDate) return null
  const dateTimeValue = task.dueTime
    ? `${task.dueDate}T${task.dueTime}`
    : `${task.dueDate}T23:59`
  const dueDate = new Date(dateTimeValue)
  return Number.isNaN(dueDate.getTime()) ? null : dueDate
}

function formatDueLabel(task) {
  if (!task.dueDate) return 'No due date'
  return task.dueTime ? `Due: ${task.dueDate} ${task.dueTime}` : `Due: ${task.dueDate}`
}

function getDueState(task) {
  if (!task.dueDate || task.completed) return ''

  const now = new Date()
  const dueDateTime = getDueDateTime(task)
  if (!dueDateTime) return ''

  const today = now.toISOString().split('T')[0]
  if (dueDateTime < now) return 'overdue'
  if (task.dueDate === today) return 'due-today'
  return ''
}

export default function TaskItem({ task, onToggleTask, onDeleteTask, onEditTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftText, setDraftText] = useState(task.text)

  const dueState = useMemo(() => getDueState(task), [task])

  const submitEdit = () => {
    const trimmed = draftText.trim()
    if (!trimmed) {
      setDraftText(task.text)
      setIsEditing(false)
      return
    }

    onEditTask(task.id, trimmed)
    setIsEditing(false)
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-info">
        {isEditing ? (
          <input
            className="edit-input"
            autoFocus
            value={draftText}
            onChange={(event) => setDraftText(event.target.value)}
            onBlur={submitEdit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitEdit()
              if (event.key === 'Escape') {
                setDraftText(task.text)
                setIsEditing(false)
              }
            }}
          />
        ) : (
          <span
            className="task-title"
            onClick={() => onToggleTask(task.id)}
            onDoubleClick={() => setIsEditing(true)}
            title="Click to toggle. Double-click to edit."
          >
            {task.text}
          </span>
        )}

        <div className="task-meta">
          <span className={dueState}>{formatDueLabel(task)}</span>
          <span className={`priority-${task.priority}`}> | Priority: {task.priority}</span>
        </div>
      </div>

      <button
        type="button"
        className="delete-btn"
        onClick={() => onDeleteTask(task.id)}
        aria-label={`Delete ${task.text}`}
      >
        ✕
      </button>
    </li>
  )
}
