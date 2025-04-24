import React, { useState } from 'react';
import './App.css';

type Task = {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Deploy', status: 'todo' },
    { id: 2, title: 'Test it', status: 'todo' },
    { id: 3, title: 'Subgoal Label', status: 'done' },
    { id: 4, title: 'Subgoal Label', status: 'done' },
  ]);

  const getColor = (status: string) => {
    switch (status) {
      case 'todo': return 'red';
      case 'doing': return 'yellow';
      case 'done': return 'green';
      default: return 'gray';
    }
  };

  const updateTaskStatus = (id: number, newStatus: Task['status']) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const progressPercent = Math.round(
    (tasks.filter(task => task.status === 'done').length / tasks.length) * 100
  );

  return (
    <div className="App">
      <h2 className="header">Task: Deploy application in dev</h2>

      <div className="task-flow">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`task-box ${getColor(task.status)}`}
          >
            <div>{task.title}</div>
            <select
              value={task.status}
              onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
            >
              <option value="todo">To-Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
        ))}
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
          Progress: {progressPercent}%
        </div>
      </div>

      <div className="legend">
        <p><span className="dot red"></span> To-Do</p>
        <p><span className="dot yellow"></span> Doing</p>
        <p><span className="dot green"></span> Done</p>
      </div>
    </div>
  );
}

export default App;
