import React from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates, // This is the line that was likely causing the error
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from './Column';
import { Task, TaskStatus } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onUpdateTask: (task: Task) => void; 
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ 
  tasks, 
  onDeleteTask, 
  onUpdateStatus, 
  onUpdateTask 
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'To-Do' },
    { id: 'in-progress', title: 'In-Progress' },
    { id: 'completed', title: 'Completed' },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const isColumn = columns.some(col => col.id === overId);
    
    if (isColumn) {
      if (taskId !== overId) {
        onUpdateStatus(taskId, overId as TaskStatus);
      }
    } else {
      const overTask = tasks.find(t => t.id === overId);
      const activeTask = tasks.find(t => t.id === taskId);
      
      if (overTask && activeTask && overTask.status !== activeTask.status) {
        onUpdateStatus(taskId, overTask.status);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        {columns.map((col) => (
          <Column 
            key={col.id} 
            id={col.id} 
            title={col.title} 
            tasks={tasks.filter(t => t.status === col.id)}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask} 
          />
        ))}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;