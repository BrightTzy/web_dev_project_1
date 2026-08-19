import { Droppable } from '@hello-pangea/dnd';
import KanbanTask from './KanbanTask';

export default function KanbanColumn({ id, title, tasks, onEditTask }) {
  return (
    <div className="kanban-column">
      <div className="column-header">
        <h3 className="column-title">{title}</h3>
        <span className="column-badge">{tasks.length}</span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {tasks.map((task, index) => (
              <KanbanTask key={task.id} task={task} index={index} onEdit={onEditTask} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
