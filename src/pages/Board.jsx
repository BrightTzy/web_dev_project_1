import { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';

export default function Board() {
  const { tasks, setTasks, moveTask } = useKanban();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const columns = [
    { id: 'TO DO', title: 'TO DO' },
    { id: 'DOING', title: 'DOING' },
    { id: 'DONE', title: 'DONE' }
  ];

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (destination.droppableId !== source.droppableId) {
      moveTask(draggableId, destination.droppableId);
    } else {
      const columnTasks = tasks.filter(t => t.status === source.droppableId);
      const reorderedTask = columnTasks[source.index];
      const newTasks = Array.from(tasks);
      const originalIndex = tasks.findIndex(t => t.id === draggableId);
      newTasks.splice(originalIndex, 1);
      newTasks.push(reorderedTask);
      setTasks(newTasks);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <header className="board-header">
        <div>
          <h2>Kanban Board</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your tasks by dragging them across columns.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
          <Plus size={18} /> New Task
        </button>
      </header>
      
      <div className="board-columns-container">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter(t => t.status === column.id)}
              onEditTask={(t) => {
                setEditingTask(t);
                setIsModalOpen(true);
              }}
            />
          ))}
        </DragDropContext>
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
