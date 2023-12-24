import React, { useMemo } from 'react';
import { ModalForm, ProFormText, ProFormDigit, ProFormTreeSelect } from '@ant-design/pro-form';
import { useResourcePagination } from '@/hooks/useResource';
import { GroupEntity } from '@/api/entities/group.entity';

interface CreateGroupModalProps {
  trigger: JSX.Element;
  onFinish: (group: Partial<API.Group>) => Promise<boolean>;
  value?: Partial<API.Group>;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ value, onFinish, trigger }) => {    
  return <ModalForm
    title={value?.parent_id ? '创建子分组': '创建分组'}
    size="large"
    onFinish={onFinish}
    modalProps={{
      destroyOnClose: true,
      centered: true,
    }}
    initialValues={{ order: 0, ...value}}
    trigger={trigger}
    submitter={{
      searchConfig: {
        submitText: '创建',
      },
    }}
  >
    <CreateGroupModalContent value={value} />
  </ModalForm>
};

export default CreateGroupModal;


const CreateGroupModalContent: React.FC<any> = ({ value }) => {
  const { data: groups, loading, refresh } = useResourcePagination(GroupEntity, {
    defaultParams: [
      {
        page_size: 2000
      }
    ],
    formatResult: (data: API.Page<API.Group>) => data.items,
  });

  const groupTreeData = useMemo(() => {
    if (!groups) return [];

    const nodes = groups.map(it => ({
      title: it.name,
      value: it.id,
      children: [],
      parent_id: it.parent_id,
    }), [groups]);

    const key2node = _.keyBy(nodes, 'value');

    nodes.forEach(node => {
      const parent = key2node[node.parent_id];
      if (parent) {
        parent.children.push(node);
      }
    });

    return nodes.filter(it => !it.parent_id);
  }, [groups]);

  return <>
    <ProFormText label="分组名称" name="name" rules={[
      {
        required: true, message: '名称不能为空',
      }
    ]}/>
    <ProFormTreeSelect 
      loading={loading}
      disabled={value?.parent_id}
      name="parent_id"
      allowClear
      label="上级分组"
      placeholder="请选择父分组"
      fieldProps={{
        options: groupTreeData,
      }}
    />
    <ProFormText label="分组编码" name="code" />
    <ProFormText label="分组描述" name="description" />
    <ProFormDigit label="顺序" name="order" extra="数字越大排序越靠前"/>
  </>;
};