import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';

export default function TaskModal({ task, onClose }) {
  const { categories, people, addTask, updateTask, deleteTask, addCategory } = useKanban();
  const isEditing = !!task;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    responsiblePerson: '',
    startDate: '',
    dueDate: '',
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#2563eb');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || '',
        responsiblePerson: task.responsiblePerson || '',
        startDate: task.startDate || '',
        dueDate: task.dueDate || '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) updateTask(task.id, formData);
    else addTask(formData);
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const added = addCategory(newCategoryName, newCategoryColor);
      setFormData(prev => ({ ...prev, category: added.id }));
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  };

  const colorOptions = ['#2563eb', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

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
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Assign To</label>
                <select 
                  name="responsiblePerson" 
                  value={formData.responsiblePerson} 
                  onChange={handleChange} 
                  className="form-control"
                >
                  <option value="">Unassigned</option>
                  {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Category</label>
                {!isAddingCategory ? (
                  <div className="flex gap-2">
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      className="form-control"
                    >
                      <option value="">Select category...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button type="button" className="btn btn-secondary btn-icon" onClick={() => setIsAddingCategory(true)}>
                      <Plus size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="category-creator">
                    <input 
                      type="text" 
                      value={newCategoryName} 
                      onChange={(e) => setNewCategoryName(e.target.value)} 
                      placeholder="New category name"
                      className="form-control"
                      style={{ marginBottom: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      autoFocus
                    />
                    <div className="color-options">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`color-dot ${newCategoryColor === color ? 'selected' : ''}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategoryColor(color)}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={handleAddCategory}>Add</button>
                      <button type="button" className="btn btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setIsAddingCategory(false)}>Cancel</button>
                    </div>
                  </div>
                )}
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
