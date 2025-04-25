import React, { useState, useRef, useEffect } from 'react';
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
  activeCard,
  setActiveCard,
}: {
  task: Task;
  moveTask: (task: Task, newStatus: string, newAssignee?: string) => void;
  updateStoryPoints: (task: Task, newStoryPoints: number) => void;
  activeCard: string | null;
  setActiveCard: (cardId: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag(() => ({
    type: ItemType.TASK,
    item: { task },
  }));

  drag(ref); // Attach the drag functionality to the ref

  const handleStoryPointsClick = () => {
    setActiveCard(task.title === activeCard ? null : task.title);
  };

  const handleIncrease = () => {
    updateStoryPoints(task, task.storyPoints + 1);
  };

  const handleDecrease = () => {
    if (task.storyPoints > 0) {
      updateStoryPoints(task, task.storyPoints - 1);
    }
  };

  return (
    <div ref={ref} className="task-card">
      <div className="task-title">{task.title}</div>
      <div className="task-category" style={{ backgroundColor: getColor(task.category) }}>
        {task.category}
      </div>
      <div className="task-footer">
        <span
          className="task-story-points"
          onClick={handleStoryPointsClick}
          style={{ cursor: 'pointer' }}
        >
          {task.storyPoints}
        </span>
        {activeCard === task.title && (
          <div className="story-points-toggle" style={{ display: 'inline-block', marginLeft: '10px' }}>
            <button onClick={handleIncrease}>+</button>
            <button onClick={handleDecrease}>-</button>
          </div>
        )}
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
  activeCard,
  setActiveCard,
}: {
  status: string;
  tasks: Task[];
  moveTask: (task: Task, newStatus: string, newGroupValue?: string) => void;
  groupValue: string;
  groupBy: 'Assignee' | 'Category';
  activeCard: string | null;
  setActiveCard: (cardId: string | null) => void;
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
          updateStoryPoints={() => {}}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
        />
      ))}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'Assignee' | 'Category'>('Assignee');
  const [activeCard, setActiveCard] = useState<string | null>(null);

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
          activeCard={activeCard}
          setActiveCard={setActiveCard}
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
            activeCard={activeCard}
            setActiveCard={setActiveCard}
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

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveCard(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App" onClick={(e) => e.stopPropagation()}>
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