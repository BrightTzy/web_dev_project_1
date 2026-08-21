import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';

const getToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
};

export default function TaskModal({ task, onClose }) {
  const { addTask, updateTask, deleteTask } = useKanban();
  const isEditing = !!task;
  const today = getToday();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        startDate: task.startDate || '',
        dueDate: task.dueDate || '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate' && value < today) return;
    if (name === 'dueDate' && value < (formData.startDate || today)) return;

    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'startDate' && prev.dueDate < value ? { dueDate: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.dueDate && formData.startDate && formData.dueDate < formData.startDate) return;
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
