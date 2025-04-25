import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
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

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  const handleTitleChange = (id: number, newTitle: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
    setEditingTaskId(null);
    setEditTitle('');
  };

  const addNewTask = () => {
    const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
    const newTask: Task = { id: newId, title: 'New Subgoal', status: 'todo' };
    setTasks(prev => [...prev, newTask]);
    setEditingTaskId(newId);  // Focus on new input
    setEditTitle('New Subgoal');
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const progressPercent = Math.round(
    (tasks.filter(task => task.status === 'done').length / tasks.length) * 100
  );

  return (
    <div className="App">
    <div className="task-header">
      <h2 className="header">Task: Deploy application in dev</h2>
      <button onClick={addNewTask} className="add-btn">+ Add Subgoal</button>
    </div>

      <div className="task-flow">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`task-box ${getColor(task.status)}`}
          >
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleTitleChange(task.id, editTitle)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTitleChange(task.id, editTitle);
                  }
                }}
                autoFocus
              />
            ) : (
              <div
                onClick={() => {
                  setEditingTaskId(task.id);
                  setEditTitle(task.title);
                }}
              >
                {task.title}
              </div>
            )}
            <select
              value={task.status}
              onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
            >
              <option value="todo">To-Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
            <>{FaTrash({})}</>
            </button>
          </div>
        ))}
      </div>

      <div className="side-panel">
      <div className="legend-box">
        <h4>Legend</h4>
        <p><span className="dot red"></span> To-Do</p>
        <p><span className="dot yellow"></span> Doing</p>
        <p><span className="dot green"></span> Done</p>
      </div>
    </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
          Progress: {progressPercent}%
        </div>
      </div>


    </div>
  );
}

export default App;
