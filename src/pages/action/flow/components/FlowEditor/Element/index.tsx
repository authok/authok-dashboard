import React, { ReactNode } from 'react';
import { useDrag } from 'react-dnd';
import { Item, ElementData, NodeData } from '../types';

interface ElementProps {
  data: ElementData;
  children?: ReactNode;
  onDragBegin?: (item: Item, monitor: any) => void;
  onDragEnd?: (item: Item, monitor: any) => void;
}

const Element: React.FC<ElementProps> = ({ data, children, onDragBegin, onDragEnd }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'square',
    item: (monitor: any) => {
      const _data = { data: data.data, title: data.title, draggable: true, droppable: true } as NodeData // copy node

      const item = { data: _data, source: 'toolbar' };
      onDragBegin?.(item, monitor);

      return item;
    },
    end: onDragEnd,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return <div ref={dragRef}>
    {children}
  </div>
};

export default Element;