import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const KanbanContext = createContext();

export const useKanban = () => useContext(KanbanContext);

const initialPeople = [
  { id: 'p1', name: 'Alice Smith' },
  { id: 'p2', name: 'Bob Johnson' },
  { id: 'p3', name: 'Charlie Brown' },
  { id: 'p4', name: 'Diana Prince' }
];

const initialCategories = [
  { id: 'c1', name: 'Frontend', color: '#2196f3' }, // blue
  { id: 'c2', name: 'Backend', color: '#4caf50' }, // green
  { id: 'c3', name: 'Design', color: '#9c27b0' }, // purple
  { id: 'c4', name: 'Bug', color: '#f44336' } // red
];

const getLocalDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

const getLocalTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const KanbanProvider = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage('kanban_tasks', []);
  const [categories, setCategories] = useLocalStorage('kanban_categories', initialCategories);
  
  // People are hardcoded per requirements, but we provide them via context
  const people = initialPeople;

  const addTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: uuidv4(),
      status: 'TO DO'
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updatedData) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updatedData } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === 'DONE') {
          updatedTask.completeDate = getLocalDate();
          updatedTask.completeTime = getLocalTime();
        } else {
          updatedTask.completeDate = null;
          updatedTask.completeTime = null;
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const addCategory = (name, color = '#9e9e9e') => {
    const newCategory = { id: uuidv4(), name, color };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  return (
    <KanbanContext.Provider value={{
      tasks,
      categories,
      people,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      addCategory,
      setTasks // exposed for drag and drop reordering if needed
    }}>
      {children}
    </KanbanContext.Provider>
  );
};
