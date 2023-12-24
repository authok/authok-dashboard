import React from 'react';
import GGEditor, { Flow } from 'gg-editor';
import { Row, Col } from 'antd';
import styles from './index.less';
import FlowItemPanel from './components/EditorItemPanel/FlowItemPanel';
// import { FlowToolbar } from './components/EditorToolbar';

interface FlowEditorProps {

}

GGEditor.setTrackable(false);

const FlowEditor: React.FC<FlowEditorProps> = ({}) => {
  return  <GGEditor className={styles.editor}>
    <Row className={styles.editorHd}>
      <Col span={24}>
        {/*<FlowToolbar />*/}
      </Col>
    </Row>
    <Row className={styles.editorBd}>
      <Col span={4} className={styles.editorSidebar}>
        <FlowItemPanel />
      </Col>
      <Col span={16} className={styles.editorContent}>
        <Flow className={styles.flow} data={{
          nodes: [
            {
              id: '0',
              label: 'Node',
              x: 50,
              y: 50,
            },
            {
              id: '1',
              label: 'Node',
              x: 50,
              y: 200,
            },
          ],
          edges: [
            {
              label: 'Label',
              source: '0',
              sourceAnchor: 1,
              target: '1',
              targetAnchor: 0,
            },
          ],
        }}/>
      </Col>
      <Col span={4} className={styles.editorSidebar}>
        {/*<FlowDetailPanel />*/}
        {/*<EditorMinimap />*/}
      </Col>
    </Row>
    {/*<FlowContextMenu />*/}
  </GGEditor>;
}

export default FlowEditor;