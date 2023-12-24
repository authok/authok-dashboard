import React, { useState, useCallback, ReactNode, useMemo } from 'react';
import Board from './Board';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import EditorToolBar from './EditorToolBar';
import { Row, Col } from 'antd';
import { Node, ElementData, Item, NodeData } from './types';
import { nanoid } from 'nanoid';

export interface FlowEditorProps {
  value: NodeData[];
  elements?: ElementData[];
  onChange?: (val?: any[]) => void;
  onDelete?: (data: NodeData, index: number) => void;
  renderItem?: (data: NodeData, index: number, isOver: boolean) => ReactNode;
  renderElement?: (element: ElementData, index: number) => ReactNode;
  toolbarRender?: () => ReactNode;
}

const FlowEditor: React.FC<FlowEditorProps> = ({ value, elements, onChange, onDelete, renderItem, renderElement, toolbarRender }) => {
  const [dragging, setDragging] = useState<boolean>(false);

  const nodes = useMemo<Node[]>(() => {
    const nodes = value?.map(nodeData => ({ type: 'item', data: nodeData, id: nodeData.id, droppable: nodeData.droppable, draggable: nodeData.draggable }));
  
    if (dragging && nodes) {
      // 添加虚拟节点
      const newNodes = new Array<Node>();
      console.log('ddnodes: ', nodes);
      nodes.forEach((node, index) => {
        if (index > 0) {
          const id = nanoid();
          newNodes.push({ type: 'slot', id, draggable: true, droppable: true });
        }
        newNodes.push(node);
      });
      return newNodes;
    } else {
      return nodes || [];
    }
  }, [value, dragging]);
  
  const handleDragBegin = (item: Item, monitor: any) => {
    setDragging(true);    
  };

  const handleDragEnd = (item: Item, monitor: any) => {
    // 添加虚拟节点
    setDragging(false);   
  };

  const handleDropItem = useCallback(({ sourceIndex, destinationIndex, source, destination, data }: Item) => {
    const newNodes = [...nodes];
    
    if (sourceIndex === destinationIndex && source === 'square') return;

    if (sourceIndex != undefined) {
      const sourceNode = newNodes[sourceIndex];
      newNodes[sourceIndex] = {...newNodes[destinationIndex]};
      newNodes[destinationIndex] = {...sourceNode};
    } else {
      if (data) {
        const node = newNodes[destinationIndex];
        data.id = node.id;
        newNodes[destinationIndex] = {...node, type: 'item', data };
      }
    }
  
    const newValue = newNodes?.filter(node => node.type === 'item')?.map(it => it.data);

    onChange?.(newValue);
  }, [nodes, onChange]);

  const handleDelete = useCallback((data: NodeData, index: number) => {
    onDelete?.(data, index);
  }, [value]);

  return <DndProvider backend={HTML5Backend}>
    <Row style={{ minHeight: 800 }}>
      <Col flex="auto">
        <div style={{ height: '100%', padding: '16px', backgroundColor: 'rgba(246, 247, 249, 0.5)', justifyContent: 'center' }}>
          <Board nodes={nodes} onDropItem={handleDropItem} renderItem={renderItem} onDelete={handleDelete}/>
        </div>
      </Col>
      <Col flex="310px">
        <EditorToolBar 
          toolbarRender={toolbarRender}
          elements={elements}
          renderElement={renderElement}
          onDragBegin={handleDragBegin}
          onDragEnd={handleDragEnd}
        />
      </Col>
    </Row>
  </DndProvider>;
};

export default FlowEditor;