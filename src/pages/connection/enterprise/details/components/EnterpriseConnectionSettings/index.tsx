import React from 'react';
import { Button, Typography } from 'antd';
import DangerItem from '@/components/DangerItem';
import { useIntl } from 'umi';
import KeywordConfirmModal from '@/components/KeywordConfirmModal';
import ConnectionEditForm from '@/pages/connection/components/ConnectionEditForm';
const { Paragraph } = Typography;

interface EnterpriseConnectionSettingsProps {
  connection: API.Connection;
  onUpdate: (connection: API.Connection) => Promise<boolean>;
  onDelete: (id: string) => void;
}

const EnterpriseConnectionSettings: React.FC<EnterpriseConnectionSettingsProps> = ({ connection, onUpdate, onDelete }) => {
  const { formatMessage } = useIntl();

  return (<>
    <ConnectionEditForm strategy={connection.strategy} onFinish={onUpdate} connection={connection}/>
    <h2 style={{ marginTop: '24px' }}>危险操作</h2>
    <DangerItem
      title="确定要删除此连接"
      description="操作不可撤销"
      actions={[
        <KeywordConfirmModal
          title="确定要删除此连接"
          keyword={connection.name}
          description={<>
            <Paragraph>操作不可撤销</Paragraph>
            <ul>
              <li>将会永久删除 <b>{connection.name}</b> 身份源 和所有其用户</li>
              <li>同名连接在一小段时间内不可用</li>
            </ul>
          </>}
          trigger={<Button danger type="primary" size="large">删除</Button>}
          onOk={() => onDelete(connection.id)}
        />
      ]}
    />
  </>);
}

export default EnterpriseConnectionSettings;