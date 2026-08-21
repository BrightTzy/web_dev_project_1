import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';

const getToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const formatSchedule = (date, time, fallback) => {
  if (!date) return fallback;
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString();
  return time ? `${formattedDate} ${time}` : formattedDate;
};

export default function KanbanTask({ task, onEdit }) {
  const { categories, people, moveTask } = useKanban();
  
  const category = categories.find(categoryItem => categoryItem.id === task.category);
  const person = people.find(personItem => personItem.id === task.responsiblePerson);
  
  const isOverdue = task.dueDate && (
    task.dueDate < getToday() ||
    (task.dueDate === getToday() && task.dueTime && task.dueTime < getCurrentTime())
  ) && task.status !== 'DONE';

  return (
        <div className="task-card" onClick={() => onEdit(task)}>
          <div className="task-header">
            {category ? (
              <span className="task-chip" style={{ backgroundColor: category.color }}>
                {category.name}
              </span>
            ) : <span></span>}
            {isOverdue && task.status !== 'DONE' && (
              <span className="task-chip" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                Overdue
              </span>
            )}
            {task.status === 'DONE' && (
              <span className="task-chip completed-chip">
                Completed
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
                <span><strong>Start:</strong> {formatSchedule(task.startDate, task.startTime, 'No start')}</span>
              </div>
              <div className={`task-footer-row ${isOverdue ? 'text-danger' : ''}`} style={isOverdue ? { fontWeight: 'bold' } : {}}>
                <Clock size={14} />
                <span><strong>Due:</strong> {formatSchedule(task.dueDate, task.dueTime, 'No due')}</span>
              </div>
            </div>

            <label className="task-status-control" onClick={(event) => event.stopPropagation()}>
              <span>Status</span>
              <select
                value={task.status}
                onChange={(event) => moveTask(task.id, event.target.value)}
                aria-label={`Change status for ${task.title}`}
              >
                <option value="TO DO">TO DO</option>
                <option value="DOING">DOING</option>
                <option value="DONE">DONE</option>
              </select>
            </label>
            
            {task.completeDate && (
               <div className="task-footer-row text-success" style={{ marginTop: '0.5rem' }}>
                 <CheckCircle size={14} />
                 <span>Completed: {new Date(task.completeDate).toLocaleDateString()}</span>
               </div>
            )}
          </div>
        </div>
  );
}
