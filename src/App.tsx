import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import App1 from './App1';

type Task = {
  storyPoints: number;
  title: string;
  status: string;
  category: string;
  assignee: string;
};

const tasksData: Task[] = [
  { storyPoints: 2, title: 'Final Evaluation Results', status: 'todo', category: 'Final Project', assignee: 'RM' },
  { storyPoints: 3, title: 'Final Exam', status: 'todo', category: 'Tests', assignee: 'RM' },
  { storyPoints: 1, title: 'Final Survey', status: 'todo', category: 'Final Project', assignee: 'RM' },
  { storyPoints: 5, title: 'Final Evaluation Planning', status: 'doing', category: 'Final Project', assignee: 'RM' },
  { storyPoints: 4, title: 'Create Video Prototype', status: 'doing', category: 'Final Project', assignee: 'TD' },
  { storyPoints: 3, title: 'Code Review', status: 'todo', category: 'Tests', assignee: 'Z' },
  { storyPoints: 2, title: 'Write Documentation', status: 'doing', category: 'Participation', assignee: 'Z' },
  { storyPoints: 4, title: 'Design Mockups', status: 'review', category: 'Final Project', assignee: 'JV' },
  { storyPoints: 5, title: 'Fix Bugs', status: 'done', category: 'Indiv Project', assignee: 'JV' },
];

const allAssignees = ['RM', 'TD', 'Z', 'JV']; // List of all possible assignees

const getColor = (category: string) => {
  switch (category) {
    case 'Final Project': return 'orange';
    case 'Tests': return 'red';
    case 'Participation': return 'green';
    case 'Indiv Project': return 'blue';
    default: return 'gray';
  }
};

const getAssigneeColor = (assignee: string) => {
  switch (assignee) {
    case 'RM': return '#FF9AA2'; // Pastel pink
    case 'TD': return '#A2CFFE'; // Pastel blue
    case 'Z': return '#B5EAD7'; // Pastel green
    case 'JV': return '#FFDAC1'; // Pastel yellow
    default: return '#D3D3D3'; // Default gray
  }
};

const getAssigneeName = (assignee: string) => {
  switch (assignee) {
    case 'RM': return 'Rithvik Madhdhipatla';
    case 'TD': return 'Tarun Devisetti';
    case 'Z': return 'Zak';
    case 'JV': return 'James Vo';
    default: return '';
  }
};

const ItemType = {
  TASK: 'task',
};

function TaskCard({
  task,
  moveTask,
  updateStoryPoints,
  onClick,
}: {
  task: Task;
  moveTask: (task: Task, newStatus: string, newAssignee?: string) => void;
  updateStoryPoints: (task: Task, newStoryPoints: number) => void;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { task },
  }));

  const [hovered, setHovered] = useState(false);

  drag(ref);

  const handleIncrease = () => {
    updateStoryPoints(task, task.storyPoints + 1);
  };

  const handleDecrease = () => {
    if (task.storyPoints > 0) {
      updateStoryPoints(task, task.storyPoints - 1);
    }
  };

  return (
    <div
      ref={ref}
      className="task-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="task-title">{task.title}</div>
      <div className="task-category" style={{ backgroundColor: getColor(task.category) }}>
        {task.category}
      </div>
      <div className="task-footer">
        <div
          className="story-points-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}
        >
          {hovered && (
            <button
              className="story-points-arrow"
              onClick={handleDecrease}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                fontSize: '10px',
                padding: '0',
              }}
            >
              ◀
            </button>
          )}
          <span className="task-story-points">{task.storyPoints}</span>
          {hovered && (
            <button
              className="story-points-arrow"
              onClick={handleIncrease}
              style={{
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                fontSize: '10px',
                padding: '0',
              }}
            >
              ▶
            </button>
          )}
        </div>
        <span
          className="task-assignee"
          style={{
            backgroundColor: getAssigneeColor(task.assignee),
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          {task.assignee}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  tasks,
  moveTask,
  groupValue,
  groupBy,
  updateStoryPoints,
  onTaskClick,
}: {
  status: string;
  tasks: Task[];
  moveTask: (task: Task, newStatus: string, newGroupValue?: string) => void;
  groupValue: string;
  groupBy: 'Assignee' | 'Category';
  updateStoryPoints: (task: Task, newStoryPoints: number) => void;
  onTaskClick?: (task: Task) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (item: { task: Task }) => {
      if (groupBy === 'Assignee') {
        moveTask(item.task, status, groupValue); // Allow moving to a different row only if grouped by Assignee
      } else {
        moveTask(item.task, status); // Default behavior for other groupings
      }
    },
  }));

  drop(ref);

  return (
    <div ref={ref} className="kanban-column">
      {tasks.map((task) => (
        <TaskCard
          key={task.title}
          task={task}
          moveTask={moveTask}
          updateStoryPoints={updateStoryPoints}
          onClick={onTaskClick ? () => onTaskClick(task) : undefined}
        />
      ))}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [statuses, setStatuses] = useState<string[]>(['todo', 'doing', 'review', 'done']);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'Assignee' | 'Category'>('Assignee');
  const [modalOpen, setModalOpen] = useState(false);
  const [assignees, setAssignees] = useState<string[]>(allAssignees); // Dynamic list of assignees
  const [collapsedRows, setCollapsedRows] = useState<Set<string>>(new Set()); // Tracks collapsed rows

  const moveTask = (task: Task, newStatus: string, newGroupValue?: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.title === task.title
          ? {
              ...t,
              status: newStatus,
              ...(groupBy === 'Assignee' ? { assignee: newGroupValue || t.assignee } : {}),
            }
          : t
      )
    );
  };

  const updateStoryPoints = (task: Task, newStoryPoints: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.title === task.title ? { ...t, storyPoints: newStoryPoints } : t
      )
    );
  };

  const addNewColumn = () => {
    const newColumnName = prompt('Enter the name of the new column:');
    if (newColumnName && !statuses.includes(newColumnName.toLowerCase())) {
      setStatuses((prevStatuses) => [...prevStatuses, newColumnName.toLowerCase()]);
    }
  };

  const addNewAssignee = () => {
    const newAssignee = prompt('Enter the initials of the new assignee (e.g., AB):');
    if (newAssignee && !assignees.includes(newAssignee)) {
      setAssignees((prevAssignees) => [...prevAssignees, newAssignee]);
    }
  };

  const toggleRowCollapse = (groupValue: string) => {
    setCollapsedRows((prevCollapsedRows) => {
      const newCollapsedRows = new Set(prevCollapsedRows);
      if (newCollapsedRows.has(groupValue)) {
        newCollapsedRows.delete(groupValue);
      } else {
        newCollapsedRows.add(groupValue);
      }
      return newCollapsedRows;
    });
  };

  const handleTaskClick = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const filteredTasks = filterCategory
    ? tasks.filter((task) => task.category === filterCategory)
    : tasks;

  const renderTasks = (status: string, groupKey: string, groupValue: string) => {
    return filteredTasks
      .map((task) => (
        <TaskCard
          key={task.title}
          task={task}
          moveTask={moveTask}
          updateStoryPoints={updateStoryPoints}
          onClick={handleTaskClick}
        />
      ));
  };

  const renderColumns = (groupKey: string, groupValue: string) => {
    const statuses = ['todo', 'doing', 'review', 'done'];
  const renderColumns = (groupValue: string) => {
    return (
      <div className="kanban-row">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter(
              (task) =>
                task.status === status &&
                (groupBy === 'Assignee' ? task.assignee === groupValue : task.category === groupValue)
            )}
            moveTask={moveTask}
            groupValue={groupValue}
            groupBy={groupBy}
            updateStoryPoints={updateStoryPoints}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>
    );
  };

  const renderRows = () => {
    const groupValues =
      groupBy === 'Assignee'
        ? assignees // Use the dynamic list of assignees
        : [...new Set(tasks.map((task) => task.category))].sort();

    return groupValues.map((groupValue) => {
      const isCollapsed = collapsedRows.has(groupValue);

      return (
        <div key={groupValue}>
          <h3
            className="group-header"
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggleRowCollapse(groupValue)}
          >
            <span style={{ marginRight: '10px' }}>
              {isCollapsed ? '▶' : '▼'}
            </span>
            {groupBy === 'Assignee' ? getAssigneeName(groupValue) || groupValue : groupValue}
          </h3>
          {!isCollapsed && renderColumns(groupValue)}
        </div>
      );
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <div className="header-container">
          <h1 className="kanban-title">BOARD</h1>
          <div className="filter-group-container">
            <div className="filter-container">
              <label htmlFor="category-filter">Filter:</label>
              <select
                id="category-filter"
                onChange={(e) => setFilterCategory(e.target.value === 'All' ? null : e.target.value)}
                value={filterCategory || 'All'}
              >
                <option value="All">All</option>
                <option value="Final Project">Final Project</option>
                <option value="Tests">Tests</option>
                <option value="Participation">Participation</option>
                <option value="Indiv Project">Indiv Project</option>
              </select>
            </div>
            <div className="group-by-container">
              <label htmlFor="group-by">Group By:</label>
              <select
                id="group-by"
                onChange={(e) => setGroupBy(e.target.value as 'Assignee' | 'Category')}
                value={groupBy}
              >
                <option value="Assignee">Assignee</option>
                <option value="Category">Category</option>
              </select>
            </div>
          </div>
        </div>
        <div className="kanban-labels" style={{ display: 'flex', alignItems: 'center' }}>
          {statuses.map((status) => (
            <div key={status} className="kanban-label">
              {status.toUpperCase()}
            </div>
          ))}
          <div
            className="add-column-icon"
            onClick={addNewColumn}
            style={{
              cursor: 'pointer',
              fontSize: '20px',
              marginLeft: '10px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            +
          </div>
        </div>
        {renderRows()}
        {modalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal} style={{ float: 'right' }}>
                &times;
              </button>
              <App1 />
            </div>
          </div>
        )}
        <div
          className="add-assignee-icon"
          onClick={addNewAssignee}
          style={{
            marginTop: '20px',
            cursor: 'pointer',
            fontSize: '20px',
            marginLeft: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          +
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
