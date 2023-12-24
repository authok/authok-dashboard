import React from 'react';
import ExternalAppEditForm from '@/pages/externalapps/components/ExternalAppEditForm';
import { Button, Space, Typography } from 'antd';
import KeywordConfirmModal from '@/components/KeywordConfirmModal';
import DangerItem from '@/components/DangerItem';
const { Paragraph } = Typography;

interface ExternalAppSettingsProps {
  application: API.Application;
  onUpdate: (application: API.Application) => Promise<boolean>;
  onDelete: (client_id: string) => void;
  loadingDelete?: boolean;
}

const ExternalAppSettings: React.FC<ExternalAppSettingsProps> = ({ application, onUpdate, onDelete, loadingDelete }) => {
  return <Space direction="vertical" style={{ width: '100%' }} size="large">
    <ExternalAppEditForm application={application} schemaNamespace="sso-integrations" schemaKey={application.app_type} onFinish={onUpdate}/>
    <DangerItem 
      title="删除应用" 
      description="操作无法撤销" 
      actions={[
        <KeywordConfirmModal 
          title="您确定要删除当前应用吗?"
          description={<>
            <Paragraph>
              此操作不可恢复. 将会永久删除 <b>{application.name}</b>
            </Paragraph>
            <Paragraph>请输入应用的名字进行确认.</Paragraph>          
          </>}
          onOk={() => onDelete(application.client_id)}
          onCancel={() => console.log('onCancel')}
          keyword={application.name}
          trigger={<Button loading={loadingDelete} type="primary" danger size="large">删除</Button>}
        />
      ]}
    />
  </Space>;
}

export default ExternalAppSettings;