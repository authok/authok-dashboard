import React, { useRef } from 'react';
import { Space, Row, Button } from 'antd';
import useClipboard from '@/hooks/useClipboard';
import CodeEditor from '@/components/CodeEditor';

interface UserRawJsonProps {
  user?: API.User;
}

const UserRawJson: React.FC<UserRawJsonProps> = ({ user }) => {
  const { copy } = useClipboard();

  const editorRef = useRef();

  return (
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <Row justify="end">
        <Button type="primary" onClick={() => {
          copy(editorRef.current?.getValue());
        }}>
          复制JSON
        </Button>
      </Row>
      <CodeEditor
        ref={editorRef}
        width="100%"
        height="60vh"            
        language="json"
        theme="vs-dark"
        value={JSON.stringify(user, null, 4)}
      />
    </Space>
  );
};

export default UserRawJson;