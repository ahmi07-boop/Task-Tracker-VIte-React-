import TaskItem from './TaskItem'

export default function TaskList({ tasks, onToggleTask, onDeleteTask, onEditTask }) {
  if (!tasks.length) {
    return <div className="empty-state">No tasks found.</div>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </ul>
  )
}
