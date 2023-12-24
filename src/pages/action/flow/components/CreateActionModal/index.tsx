import React, { useMemo } from 'react';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { useResourcePagination } from '@/hooks/useResource';
import { TriggerEntity } from '@/api/entities/trigger.entity';

interface CreateActionModalProps {
  initialValues?: Partial<API.Action>;
  trigger: JSX.Element;
  onFinish: (action: API.Action) => Promise<boolean>;
}

const CreateActionModal: React.FC<CreateActionModalProps> = ({ trigger, onFinish, initialValues }) => {
  const { run: fetchTriggers } = useResourcePagination(TriggerEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Trigger>) => page.items,
  });

  return (
    <ModalForm
      title="创建Action"
      size="large"
      trigger={trigger}
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        runtime: "node16",
      }}
      modalProps={{
        centered: true,
        destroyOnClose: true,
      }}
    >
      <ProFormText 
        label="名称"
        name="name"
        rules={[{ required: true, message: '这是必填项' }]}
      />
      <ProFormSelect
        label="触发器"
        name="supported_triggers"
        rules={[{ required: true, message: '这是必填项' }]}
        mode="multiple"
        request={async () => {
          const triggers = await fetchTriggers({ page_size: 100 });
          return triggers?.map(it => ({ 
            label: it.display_name,
            value: it.id,
          }));
        }}
      />
      <ProFormSelect
        label="运行时"
        name="runtime"
        rules={[{ required: true, message: '这是必填项' }]}
        request={() => {
          // TODO 从网络获取 trigger列表
          return [
            {
              label: 'Node 16(推荐)',
              value: 'node16',
            },
            {
              label: 'Node 14(不推荐)',
              value: 'node14',
            }
          ];
        }}
      />
    </ModalForm>
  );
};

export default CreateActionModal;