import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { useKanban } from "../context/KanbanContext";

const getToday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const isBeforeSchedule = (startDate, dueDate) => {
  if (!startDate || !dueDate) return false;
  return dueDate < startDate;
};

export default function TaskModal({ task, onClose }) {
  const { addTask, updateTask, deleteTask, categories, people, addCategory } =
    useKanban();
  const isEditing = !!task;
  const today = getToday();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    responsiblePerson: "",
    status: "TO DO",
    category: "",
  });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        startDate: task.startDate || "",
        dueDate: task.dueDate || "",
        responsiblePerson: task.responsiblePerson || "",
        status: task.status || "TO DO",
        category: task.category || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = { ...formData, [name]: value };

    if (name === "startDate" && value < today) return;
    if (name === "dueDate" && value < (formData.startDate || today)) return;
    if (
      name === "dueDate" &&
      isBeforeSchedule(nextFormData.startDate, nextFormData.dueDate)
    )
      return;
    if (
      name === "startDate" &&
      nextFormData.dueDate &&
      isBeforeSchedule(nextFormData.startDate, nextFormData.dueDate)
    ) {
      nextFormData.dueDate = "";
    }

    setFormData(nextFormData);
  };

  const handleCreateCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const category = addCategory(name);
    setFormData((current) => ({ ...current, category: category.id }));
    setNewCategoryName("");
    setIsCreatingCategory(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      formData.dueDate &&
      formData.startDate &&
      isBeforeSchedule(formData.startDate, formData.dueDate)
    )
      return;
    if (isEditing) updateTask(task.id, formData);
    else addTask(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? "Edit Task" : "Create New Task"}</h2>
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

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="responsiblePerson">Responsible Person</label>
                <select
                  id="responsiblePerson"
                  name="responsiblePerson"
                  value={formData.responsiblePerson}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">Unassigned</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="TO DO">TO DO</option>
                  <option value="DOING">DOING</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              {!isCreatingCategory ? (
                <div className="flex gap-2">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsCreatingCategory(true)}
                  >
                    New
                  </button>
                </div>
              ) : (
                <div className="category-creator">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Category name"
                    className="form-control"
                    autoFocus
                  />
                  <div
                    className="footer-actions"
                    style={{ marginTop: "0.75rem" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setIsCreatingCategory(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleCreateCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
            >
              <Trash2 size={16} /> Delete
            </button>
          ) : (
            <div></div>
          )}

          <div className="footer-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" form="task-form" className="btn btn-primary">
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
