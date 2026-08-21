import KanbanTask from './KanbanTask';

export default function KanbanColumn({ title, tasks, onEditTask }) {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="column-badge">{tasks.length}</span>
      </div>
      
      <div className="column-content">
        {tasks.map(task => (
          <KanbanTask key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
}
