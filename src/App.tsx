import React, { useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

type Task = {
  storyPoints: number;
  title: string;
  status: 'todo' | 'doing' | 'review' | 'done';
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
    case 'RM': return '#FF9AA2'; // Darker pastel pink
    case 'TD': return '#A2CFFE'; // Darker pastel blue
    case 'Z': return '#B5EAD7'; // Darker pastel green
    case 'JV': return '#FFDAC1'; // Darker pastel yellow
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
}: {
  task: Task;
  moveTask: (task: Task, newStatus: string, newAssignee?: string) => void;
  updateStoryPoints: (task: Task, newStoryPoints: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { task },
  }));

  const [hovered, setHovered] = useState(false);

  drag(ref); // Attach the drag functionality to the ref

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
            gap: '2px', // Reduce the gap between arrows and story points
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
                fontSize: '10px', // Smaller font size for arrows
                padding: '0', // Remove padding to shrink hover area
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
                fontSize: '10px', // Smaller font size for arrows
                padding: '0', // Remove padding to shrink hover area
              }}
            >
              ▶
            </button>
          )}
        </div>
        <span
          className="task-assignee"
          style={{ backgroundColor: getAssigneeColor(task.assignee) }}
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
}: {
  status: string;
  tasks: Task[];
  moveTask: (task: Task, newStatus: string, newGroupValue?: string) => void;
  groupValue: string;
  groupBy: 'Assignee' | 'Category';
  updateStoryPoints: (task: Task, newStoryPoints: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop(() => ({
    accept: ItemType.TASK,
    drop: (item: { task: Task }) => {
      if (groupBy === 'Assignee') {
        moveTask(item.task, status, groupValue); // Allow moving to a different row only if grouped by Assignee
      }
    },
  }));

  drop(ref); // Attach the drop functionality to the ref

  return (
    <div ref={ref} className="kanban-column">
      {tasks.map((task) => (
        <TaskCard
          key={task.title}
          task={task}
          moveTask={moveTask}
          updateStoryPoints={updateStoryPoints}
        />
      ))}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'Assignee' | 'Category'>('Assignee');

  const moveTask = (task: Task, newStatus: string, newGroupValue?: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.title === task.title
          ? {
              ...t,
              status: newStatus as Task['status'],
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilterCategory(value === 'All' ? null : value);
  };

  const handleGroupByChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGroupBy(event.target.value as 'Assignee' | 'Category');
  };

  const filteredTasks = filterCategory
    ? tasks.filter((task) => task.category === filterCategory)
    : tasks;

  const renderTasks = (status: string, groupKey: string, groupValue: string) => {
    return filteredTasks
      .filter((task) => task.status === status && task[groupKey as keyof Task] === groupValue)
      .map((task) => (
        <TaskCard
          key={task.title}
          task={task}
          moveTask={moveTask}
          updateStoryPoints={updateStoryPoints}
        />
      ));
  };

  const renderColumns = (groupKey: string, groupValue: string) => {
    const statuses = ['todo', 'doing', 'review', 'done'];
    return (
      <div className="kanban-row">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter(
              (task) =>
                task.status === status && task[groupKey as keyof Task] === groupValue
            )}
            moveTask={moveTask}
            groupValue={groupValue}
            groupBy={groupBy}
            updateStoryPoints={updateStoryPoints}
          />
        ))}
      </div>
    );
  };

  const renderRows = () => {
    const groupValues =
      groupBy === 'Assignee'
        ? [...new Set(tasks.map((task) => task.assignee))].sort((a, b) =>
            getAssigneeName(a).localeCompare(getAssigneeName(b))
          )
        : [...new Set(tasks.map((task) => task.category))].sort();

    return groupValues.map((groupValue) => (
      <div key={groupValue}>
        <h2 className="assignee-header">
          {groupBy === 'Assignee' ? getAssigneeName(groupValue) : groupValue}
        </h2>
        {renderColumns(groupBy.toLowerCase(), groupValue)}
      </div>
    ));
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
                onChange={handleFilterChange}
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
                onChange={handleGroupByChange}
                value={groupBy}
              >
                <option value="Assignee">Assignee</option>
                <option value="Category">Category</option>
              </select>
            </div>
          </div>
        </div>
        <div className="kanban-labels">
          <div className="kanban-label">TO DO</div>
          <div className="kanban-label">IN PROGRESS</div>
          <div className="kanban-label">IN REVIEW</div>
          <div className="kanban-label">DONE</div>
        </div>
        {renderRows()}
      </div>
    </DndProvider>
  );
}

export default App;