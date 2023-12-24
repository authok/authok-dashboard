import React, { useRef, ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd'
import styles from './index.less';
import { Item, Node, NodeData } from '../types';
import ActionWidget from '../../ActionWidget';
import { CloseOutlined } from '@ant-design/icons';

interface BlockSquareProps {
  index: number;
  node: Node;
  onDropItem?: (item: Item) => void;
  renderItem?: (data: NodeData, index: number, isOver: boolean) => ReactNode;
  onDelete?: (data: NodeData, index: number) => void;
}

// 可被落子的格子
const BlockSquare: React.FC<BlockSquareProps> = ({ index, node, renderItem, onDropItem, onDelete }) => {
  const boxRef = useRef();
  
  const [{ isDragging }, dragRef, dragPreview] = useDrag({
    type: 'square',
    item: (monitor) => {
      const item = { data: node.data, sourceIndex: index, source: 'block' };

      return item;
    },
    canDrag: () => node.draggable,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  }, [index, node]);
  
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'square',
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;
    
      onDropItem?.({ ...item, destinationIndex: index, destination: 'square' } );
    },
    canDrop: () => node.droppable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }, [index, node, renderItem, onDropItem]);

  const renderNode = (node: any, index: number, isOver: boolean) => {
    const style = isOver ? {
      backgroundColor: 'rgb(188, 216, 255)',
    } : {};

    if (node.type === 'slot') {
      return <BlockPlaceholder style={style}/>;
    } else {
      return !!renderItem ? renderItem(node.data, index, isOver) : <ActionWidget title={node.data.title} />;
    }
  };

  dragPreview(dropRef(boxRef));

  return (
    <div ref={boxRef} className={styles.block}>
      <div ref={dragRef} style={{ position: 'relative'}}>
        {renderNode(node, index, isOver)}
        { !isDragging && node?.data?.data && <div style={{ position: 'absolute', right: 12, top: 12 }}><CloseOutlined onClick={() => onDelete?.(node.data, index)} /></div>}
      </div>
    </div>
  );
};

export default BlockSquare;

const BlockPlaceholder = ({ style }) => {
  return <div 
    className={styles.blockPlaceholder} style={style} 
  >
    <div className={styles.content}>拖拽到这里</div>
  </div>;
};