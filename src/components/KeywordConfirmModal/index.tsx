import React, { useCallback } from 'react';
import{ ModalForm, ProFormText, ProFormDependency } from '@ant-design/pro-form';
import { Button, Space } from 'antd';

interface KeywordConfirmModalProps {
  title: string | JSX.Element;
  description: string | JSX.Element;
  keyword: string;
  trigger: JSX.Element;
  onOk?: () => void;
  onCancel?: () => void;
}

const KeywordConfirmModal: React.FC<KeywordConfirmModalProps> = ({ title, description, keyword, trigger, onOk, onCancel }) => {  
  const handleFinish = useCallback((_) => {
    return onOk?.();
  }, [keyword]);
  
  return <ModalForm
    title={title}
    trigger={trigger}
    width={400}
    modalProps={{
      centered: true,
      onCancel,
    }}
    size="large"
    submitter={{
      render: (props, doms) => {
        // doms[0] 也是取消按钮
        return [
          <Button {...props.resetButtonProps}>取消</Button>,
          <ProFormDependency name={['keyword']}>
            {({ keyword: _keyword }) => <Button disabled={_keyword !== keyword} type="primary" key="submit" onClick={() => props.form?.submit?.()}>
              删除
            </Button>
            }
          </ProFormDependency>
        ];
      }
    }}
    onFinish={handleFinish}
  >
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>{description}</div>
      <ProFormText
        name="keyword" 
        width="100%" 
        placeholder=""
        rules={[{
          required: true,
          message: '不能为空',
        }]}
      />
    </Space>
  </ModalForm>
};

export default KeywordConfirmModal;