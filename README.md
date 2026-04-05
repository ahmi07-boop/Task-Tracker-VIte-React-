# Task Tracker - Vite React App

This project converts the original single-file HTML/CSS/JavaScript task tracker into a proper Vite + React app structure.

## Features

- Add tasks with due date and priority
- Toggle task completion
- Delete tasks
- Inline edit on double-click
- Filter by all, pending, completed
- Sort by due date or priority
- Search tasks
- Local storage persistence
- Browser reminders for due and overdue tasks

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/
    TaskControls.jsx
    TaskForm.jsx
    TaskItem.jsx
    TaskList.jsx
  App.jsx
  main.jsx
  index.css
```

## Notes

- The app uses `localStorage` to persist tasks.
- Notification reminders are de-duplicated per task per day to avoid repeated browser spam.
