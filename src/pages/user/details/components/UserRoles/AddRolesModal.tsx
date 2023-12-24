import React, { useMemo } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-form';
import { Row, Button } from 'antd';
import { useUserRolePagination } from '@/hooks/user';
import * as _ from 'lodash';
import { useResourcePagination } from '@/hooks/useResource';
import { RoleEntity } from '@/api';

interface AddRolesModalProps {
  user: API.User;
  loading: boolean;
  trigger: JSX.Element;
  onFinish: (values: any) => Promise<boolean>;
}

const AddRolesModal: React.FC<AddRolesModalProps> = ({ user, loading, trigger, onFinish }) => {
  return (
    <ModalForm 
      loading={loading}
      title="分配角色"
      size="large"
      onFinish={onFinish}
      trigger={trigger}
      modalProps={{
        destroyOnClose: true,
      }}
      submitter={{
        render: (props, doms) => {
          return <Row justify="end">
            <ProFormDependency name={['roles']}>
              {({ roles }) => {
                return <Button disabled={!roles || roles.length === 0} type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                  分配角色
                </Button>;
              }}
            </ProFormDependency>
          </Row>;
        },
      }}
    >
      <AddRolesFormContent user={user}/>
    </ModalForm>
  );
};

const AddRolesFormContent: React.FC<{ user: API.User }> = ({ user }) => {
  const { data: userRoles } = useUserRolePagination(user.user_id, { 
    defaultParams: [{
      page_size: 1000,
    }],
    formatResult: (page: API.Page<API.User>) => page.items,
  } as any);

  const { data: roles, loading: loadingRoles } = useResourcePagination(RoleEntity, {
    defaultParams: [{
      page_size: 100,
    }],
    formatResult: (page: API.Page<API.Role>) => page.items,
  } as any);

  const roleOptions = useMemo(() => {
    if (!roles) return [];

    const dataRoleOptions = roles?.map(it => ({ label: it.description, value: it.id })) || [];

    console.log('dataRoles: ', roles);
    if (!userRoles || userRoles.length === 0) return dataRoleOptions;

    const id2UserRole = _.keyBy(userRoles, 'role.id');
    console.log('id2UserRole: ', roles);

    // 过滤权限
    return dataRoleOptions.filter((it) => !id2UserRole[it.value]);
  }, [userRoles, roles]);

  return <>   
    <ProFormSelect
      mode="multiple"
      name="roles"
      loading={loadingRoles}
      label={<b>选择角色</b>}
      options={roleOptions}
      showSearch
      filterOption={(input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    />    
  </>;
};

export default AddRolesModal;