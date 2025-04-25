import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import './Subgoal_Planner.css';

type Subgoal = {
  id: number;
  title: string;
  status: 'todo' | 'doing' | 'done';
};

interface SubgoalPlannerProps {
  subgoals: Subgoal[];
  setSubgoals: (newSubgoals: Subgoal[]) => void;
  taskTitle: string;
}

function Subgoal_Planner({ subgoals, setSubgoals, taskTitle }: SubgoalPlannerProps) {
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

  const updateTaskStatus = (id: number, newStatus: Subgoal['status']) => {
    setSubgoals(
      subgoals.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleTitleChange = (id: number, newTitle: string) => {
    setSubgoals(
      subgoals.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
    setEditingTaskId(null);
    setEditTitle('');
  };

  const addNewTask = () => {
    const newId = Math.max(0, ...subgoals.map(t => t.id)) + 1;
    const newTask: Subgoal = { id: newId, title: 'New Subgoal', status: 'todo' };
    setSubgoals([...subgoals, newTask]);
    setEditingTaskId(newId);  // Focus on new input
    setEditTitle('New Subgoal');
  };

  const deleteTask = (id: number) => {
    setSubgoals(subgoals.filter(task => task.id !== id));
  };

  const progressPercent = subgoals.length === 0
    ? 0
    : Math.round(
        (subgoals.filter(task => task.status === 'done').length / subgoals.length) * 100
      );

  return (
    <div className="App1">
      <div className="app1-task-header">
        Task: {taskTitle}
        <button onClick={addNewTask} className="app1-add-btn">+ Add Subgoal</button>
      </div>

      <div className="app1-task-flow">
        {subgoals.map(task => (
          <div
            key={task.id}
            className={`app1-task-box ${getColor(task.status)}`}
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
              onChange={(e) => updateTaskStatus(task.id, e.target.value as Subgoal['status'])}
            >
              <option value="todo">To-Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
            <button className="app1-delete-btn" onClick={() => deleteTask(task.id)}>
              <>{FaTrash({})}</>
            </button>
          </div>
        ))}
      </div>

      <div className="app1-legend-box">
        <h4>Legend</h4>
        <p><span className="app1-dot red"></span> To-Do</p>
        <p><span className="app1-dot yellow"></span> Doing</p>
        <p><span className="app1-dot green"></span> Done</p>
      </div>

      <div className="app1-progress-bar-container">
        <span className="app1-progress-bar-label">Progress:</span>
        <div className="app1-progress-bar">
          <div
            className="app1-progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="app1-progress-bar-percent">{progressPercent}%</div>
      </div>
    </div>
  );
}

export default Subgoal_Planner;
