import React, { useCallback } from 'react';
import { Space, Modal, Button } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import DangerItem from '@/components/DangerItem';
import { history } from 'umi';
import { useResourceDelete } from '@/hooks/useResource';
import { RoleEntity } from '@/api';
import { formatPath } from '@/utils/link.utils';

interface RoleSettingsProps {
  role: API.Role;
  loading: boolean;
  onUpdate: (data: Partial<API.Role>) => void;
  refresh: () => void;
}

const RoleSettings: React.FC<RoleSettingsProps> = ({ role, loading, onUpdate }) => {
  const { loading: loadingDelete, run: deleteRole } = useResourceDelete(RoleEntity);

  const handleDeleteRole = useCallback(async () => {
    Modal.confirm({
      title: '删除角色',
      content: `确定要删除角色: ${role.name}`,
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deleteRole(role.id);
        history.push(formatPath(`/user_mgmt/roles`));    
      },
    });
  }, []);

  return (
    <Space size="large" style={{ width: '100%' }} direction="vertical">
      <ProForm 
        loading={loading || undefined}
        size="large"
        onFinish={onUpdate}
        initialValues={role}
        submitter={{
          searchConfig: {
            submitText: '保存',
          },
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <ProFormText width="xl" name="name" label="角色名称" placeholder="角色名称" rules={[{ required: true, message: '角色名称不允许为空' }]}/>
        <ProFormText width="xl" name="description" label="角色描述" placeholder="角色描述" rules={[{ required: true, message: '角色描述不允许为空' }]}/>
      </ProForm>
      <Space style={{ width: '100%' }} direction="vertical">
        <h2>危险操作</h2>
        <DangerItem title="删除角色" description="操作不可逆" actions={[
          <Button type="primary" danger size="large" onClick={handleDeleteRole}>删除当前角色</Button>
        ]} />
      </Space>
    </Space>
  );
}

export default RoleSettings;