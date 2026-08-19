import { Draggable } from '@hello-pangea/dnd';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';

export default function KanbanTask({ task, index, onEdit }) {
  const { categories, people } = useKanban();
  
  const category = categories.find(c => c.id === task.category);
  const person = people.find(p => p.id === task.responsiblePerson);
  
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
          onClick={() => onEdit(task)}
        >
          <div className="task-header">
            {category ? (
              <span className="task-chip" style={{ backgroundColor: category.color }}>
                {category.name}
              </span>
            ) : <span></span>}
            {isOverdue && (
              <span className="task-chip" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                Overdue
              </span>
            )}
          </div>
          
          <h4 className="task-title">{task.title}</h4>
          <p className="task-desc">{task.description}</p>
          
          <div className="task-footer">
            {person && (
              <div className="task-footer-row" style={{ marginBottom: '0.5rem' }}>
                <User size={14} />
                <span>{person.name}</span>
              </div>
            )}
            
            <div className="task-footer-between">
              <div className="task-footer-row">
                <Calendar size={14} />
                <span>{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'No start'}</span>
              </div>
              <div className={`task-footer-row ${isOverdue ? 'text-danger' : ''}`} style={isOverdue ? { fontWeight: 'bold' } : {}}>
                <Clock size={14} />
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due'}</span>
              </div>
            </div>
            
            {task.completeDate && (
               <div className="task-footer-row text-success" style={{ marginTop: '0.5rem' }}>
                 <CheckCircle size={14} />
                 <span>Completed: {new Date(task.completeDate).toLocaleDateString()}</span>
               </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
