export default function TaskControls({
  filter,
  onFilterChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}) {
  return (
    <div className="controls">
      <select value={filter} onChange={(event) => onFilterChange(event.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>

      <select value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
        <option value="default">Sort By</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
  )
}
