import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';

const getToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

const isBeforeSchedule = (startDate, startTime, dueDate, dueTime) => {
  if (!startDate || !dueDate) return false;
  if (dueDate < startDate) return true;
  return dueDate === startDate && startTime && dueTime && dueTime < startTime;
};

export default function TaskModal({ task, onClose }) {
  const { addTask, updateTask, deleteTask } = useKanban();
  const isEditing = !!task;
  const today = getToday();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    dueDate: '',
    dueTime: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        startDate: task.startDate || '',
        startTime: task.startTime || '',
        dueDate: task.dueDate || '',
        dueTime: task.dueTime || '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };

    if (name === 'startDate' && value < today) return;
    if (name === 'dueDate' && value < (formData.startDate || today)) return;
    if (
      (name === 'dueTime' || name === 'dueDate') &&
      isBeforeSchedule(nextFormData.startDate, nextFormData.startTime, nextFormData.dueDate, nextFormData.dueTime)
    ) return;

    if (
      (name === 'startDate' || name === 'startTime') &&
      nextFormData.dueDate &&
      isBeforeSchedule(nextFormData.startDate, nextFormData.startTime, nextFormData.dueDate, nextFormData.dueTime)
    ) {
      nextFormData.dueDate = '';
      nextFormData.dueTime = '';
    }

    setFormData(nextFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.dueDate &&
      formData.startDate &&
      isBeforeSchedule(formData.startDate, formData.startTime, formData.dueDate, formData.dueTime)
    ) return;
    if (isEditing) updateTask(task.id, formData);
    else addTask(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <form id="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3} 
                className="form-control"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange} 
                  min={today}
                  className="form-control"
                />
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Due Date</label>
                <input 
                  type="date" 
                  name="dueDate" 
                  value={formData.dueDate} 
                  onChange={handleChange} 
                  min={formData.startDate || today}
                  className="form-control"
                />
                <label>Due Time</label>
                <input
                  type="time"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  min={formData.startDate === formData.dueDate ? formData.startTime : undefined}
                  className="form-control"
                />
              </div>
            </div>
          </form>
        </div>
        
        <div className="modal-footer">
          {isEditing ? (
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={() => { deleteTask(task.id); onClose(); }}
            >
              <Trash2 size={16} /> Delete
            </button>
          ) : <div></div>}
          
          <div className="footer-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" form="task-form" className="btn btn-primary">
              {isEditing ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
