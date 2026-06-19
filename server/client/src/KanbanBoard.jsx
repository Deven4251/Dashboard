import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import api from "./api/axios.js";
import StatusBadge from "./StatusBadge.jsx";

const columns = ["Todo", "In Progress", "Review", "Completed"];

export default function KanbanBoard({ tasks, setTasks }) {
  const grouped = columns.reduce((acc, column) => {
    acc[column] = tasks.filter((task) => task.status === column).sort((a, b) => a.order - b.order);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const sourceItems = Array.from(grouped[result.source.droppableId]);
    const destinationItems =
      result.source.droppableId === result.destination.droppableId
        ? sourceItems
        : Array.from(grouped[result.destination.droppableId]);
    const [moved] = sourceItems.splice(result.source.index, 1);
    const updatedMoved = { ...moved, status: result.destination.droppableId };
    destinationItems.splice(result.destination.index, 0, updatedMoved);

    const ordered = columns.flatMap((column) => {
      const list =
        column === result.source.droppableId
          ? sourceItems
          : column === result.destination.droppableId
            ? destinationItems
            : grouped[column];
      return list.map((task, index) => ({ ...task, status: column, order: index }));
    });

    setTasks(tasks.map((task) => ordered.find((item) => item._id === task._id) || task));
    try {
      await api.patch("/tasks/reorder", { tasks: ordered.map(({ _id, status, order }) => ({ _id, status, order })) });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update tasks");
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban">
        {columns.map((column) => (
          <Droppable droppableId={column} key={column}>
            {(provided, snapshot) => (
              <section className={`kanban-column ${snapshot.isDraggingOver ? "is-over" : ""}`} ref={provided.innerRef} {...provided.droppableProps}>
                <div className="kanban-title">
                  <StatusBadge value={column} />
                  <span>{grouped[column].length}</span>
                </div>
                {grouped[column].map((task, index) => (
                  <Draggable draggableId={task._id} index={index} key={task._id}>
                    {(dragProvided) => (
                      <article className="task-card" ref={dragProvided.innerRef} {...dragProvided.draggableProps} {...dragProvided.dragHandleProps}>
                        <strong>{task.title}</strong>
                        <p>{task.description}</p>
                        <span>{task.priority}</span>
                      </article>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
