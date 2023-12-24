import React, { ReactNode } from 'react';
import { ElementData, Item } from '../types';
import Element from '../Element';
import { Tabs, Space, Row, Col } from 'antd';
import ActionWidget from '../../ActionWidget';

interface EditorToolBarProps {
  elements?: ElementData[]; 
  onDragBegin?: (item: Item, monitor: any) => void;
  onDragEnd?: (item: Item, monitor: any) => void;
  renderElement?: (element: ElementData, index: number) => ReactNode;
  toolbarRender?: () => ReactNode;
}

const EditorToolBar: React.FC<EditorToolBarProps> = ({ elements, renderElement, toolbarRender, onDragBegin, onDragEnd }) => {  
  return <div>
    <Row align="middle" style={{ padding: '16px', height: 64 }}>
      <Col span={16}>
        <b style={{ fontSize: 18 }}>添加动作</b>
      </Col>
      <Col span={8}>
        <Row justify="end">
          {toolbarRender && toolbarRender()}
        </Row>
      </Col>
    </Row>
    <Tabs tabBarStyle={{ marginLeft: 16, marginRight: 16 }}>
      <Tabs.TabPane key="installed" tab="已安装">
        <Space direction="vertical" size="middle" style={{ padding: '16px', height: '800px', overflowY: 'scroll' }}>
          {elements?.map((element, index) => (
            <Element 
              key={element.id} 
              data={element}
              onDragBegin={(item, monitor) => onDragBegin?.(item, monitor)} 
              onDragEnd={(item, monitor) => onDragEnd?.(item, monitor)}>
              {!!renderElement ? renderElement(element, index) : <ActionWidget title={element.title} />}
            </Element>
          ))}
        </Space>
      </Tabs.TabPane>
      <Tabs.TabPane key="custom" tab="自定义">

      </Tabs.TabPane>
    </Tabs>
  </div>;
};

export default EditorToolBar;