import React, { useMemo, useState, useCallback, useEffect } from 'react';
import ProForm, {
  ModalForm,
  ProFormDependency,
} from '@ant-design/pro-form';
import { Select, Row, List, Card, Checkbox, Button, Tooltip, Space, Col, Input } from 'antd';
import * as _ from 'lodash';
import { PermissionSelectList } from '../PermissionSelectList';
import { useResourcePagination } from '@/hooks/useResource';
import { ResourceServerEntity } from '@/api/entities/resource-server.entity';

interface AssignPermissionsModalProps {
  trigger: JSX.Element;
  onFinish: (values: any) => Promise<boolean>;
  exclude: () => Promise<API.Permission[]>;
}



const AssignPermissionsModal: React.FC<AssignPermissionsModalProps> = ({ trigger, onFinish, exclude }) => {
  return (
    <ModalForm
      title="分配权限"
      size="large"
      onFinish={onFinish}
      trigger={trigger}
      destroyOnClose={true}
      submitter={{
        render: (props, doms) => {
          return <Row justify="end">
            <ProFormDependency name={['permissions']}>
            {({ permissions }) => <Button disabled={!permissions || permissions.length === 0} type="primary" key="submit" onClick={() => props.form?.submit?.()}>
              分配权限
            </Button>
            }
            </ProFormDependency>
          </Row>;
        },
      }}
    >
      <ProForm.Item name="permissions">
        <PermissionFormContent exclude={exclude} />
      </ProForm.Item>
    </ModalForm>
  );
};

const PermissionFormContent: React.FC<any> = ({ exclude, onChange }) => {
  const [excludePermissions, setExcludePermissions] = useState<API.Permission[]>();

  useEffect(() => {
    const fn = async() => {
      const perms = await exclude();
      setExcludePermissions(perms);
    }
    fn();
  }, []);

  const { data: dataResourceServers, loading: loadingResourceServers } = useResourcePagination(ResourceServerEntity, {
    defaultParams: [{
      page_size: 100,
      is_system: false,
    }]
  } as any);
  
  const [resourceServer, setResourceServer] = useState<API.ResourceServer | undefined>();
  const resourceServerOptions = useMemo(() => dataResourceServers?.items?.map((it) => ({ label: it.name, value: it.id, target: it })), [dataResourceServers]);
  const permissions = useMemo(() => {
    if (!resourceServer) return [];
    const excludePermissionMap = {};
    const _excludePermissionMap = _.groupBy(excludePermissions || [], 'resource_server_identifier');
    for (const k in _excludePermissionMap) {
      excludePermissionMap[k] = _.keyBy(_excludePermissionMap[k], 'permission_name');
    }

    const permissions = resourceServer.scopes?.filter((it) => !(excludePermissionMap[resourceServer.identifier] && excludePermissionMap[resourceServer.identifier][it.value]));
    return permissions?.map(it => ({ permission_name: it.value, resource_server_identifier: resourceServer.identifier, descirption: it.description }));
  }, [resourceServer, excludePermissions]);

  return <Space direction="vertical" style={{ width: '100%' }}>
    <Select
      placeholder="请选择"
      loading={loadingResourceServers}
      label={<b>从现有的API中选择权限</b>}
      options={resourceServerOptions}
      showSearch
      filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      onChange={(e, o) => setResourceServer(o.target)}
    />
    {resourceServer && (
      <PermissionSelectList rowKey="permission_name" permissions={permissions} rowSelection={{
        onChange: (keys: string[]) => {
          const id2p = _.keyBy(permissions, 'permission_name');
          const perms = keys.map(it => {
            const perm = id2p[it];
            return {
              permission_name: perm.permission_name,
              resource_server_identifier: perm.resource_server_identifier,
            }
          });

          onChange?.(perms);
        }
      }}/>
    )}
  </Space>;
};

export default AssignPermissionsModal;