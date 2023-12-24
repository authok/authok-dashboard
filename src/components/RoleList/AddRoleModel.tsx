import React, { useMemo } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-form';
import { Row, Button } from 'antd';
import * as _ from 'lodash';

interface AddRolesModalProps {
  roles: API.Role[];
  trigger: JSX.Element;
  onFinish: (values: any) => Promise<boolean>;
  loading?: boolean;
}

const AddRolesModal: React.FC<AddRolesModalProps> = ({ roles, trigger, onFinish, loading }) => {
  return (
    <ModalForm 
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
      <AddRolesFormContent loading={loading} roles={roles}/>
    </ModalForm>
  );
};

const AddRolesFormContent: React.FC<{ loading: boolean, roles: API.Role[] }> = ({ loading, roles }) => {
  const roleOptions = useMemo(() => roles.map(it => ({ label: it.description, value: it.id })) || [], [roles]);
  
  return <>
    <ProFormSelect
      mode="multiple"
      name="roles"
      loading={loading}
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