import React, { ReactNode } from 'react';
import BlockSquare from '../Square';
import styles from './index.less';
import { Node, Item, NodeData } from '../types';

interface BoardProps {
  nodes: Node[];
  onDropItem?: (item: Item) => void;
  renderItem?: (data: NodeData, index: number, isOver: boolean) => ReactNode;
  onDelete?: (data: NodeData, index: number) => void;
}

const Board: React.FC<BoardProps> = ({ nodes, onDelete, renderItem, onDropItem }) => {
  console.log('Board.nodes: ', nodes);

  return <div style={{ display: 'grid', justifyItems: 'center' }}>
    {nodes?.map((node, index) => (
      <React.Fragment key={node.id}>
        <BlockSquare 
          index={index}
          node={node}
          renderItem={renderItem}
          onDropItem={onDropItem}
          onDelete={onDelete}
        />
        {index < (nodes.length-1) && <Arrow />}
      </React.Fragment>
    ))}
  </div>;
};

const Arrow = () => {
  return <div className={styles.arrow}>
    <div className={styles['arrow-inner']}></div>
  </div>;
}

export default Board;