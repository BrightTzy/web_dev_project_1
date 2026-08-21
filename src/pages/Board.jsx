import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';

export default function Board() {
  const { tasks } = useKanban();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const columns = [
    { id: 'TO DO', title: 'TO DO' },
    { id: 'DOING', title: 'DOING' },
    { id: 'DONE', title: 'DONE' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header className="board-header">
        <div>
          <h2>Kanban Board</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your tasks by updating their status.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
          <Plus size={18} /> New Task
        </button>
      </header>
      
      <div className="board-columns-container">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            tasks={tasks.filter(task => task.status === column.id)}
            onEditTask={(taskToEdit) => {
              setEditingTask(taskToEdit);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      {isModalOpen && (
        <TaskModal 
          task={editingTask} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
