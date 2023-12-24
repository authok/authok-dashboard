import React, { useRef, useEffect } from 'react';
import { Drawer, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { DrawerProps } from 'antd/lib/drawer';
import { DynamicForm, DynamicFormProps } from './DynamicForm';

interface DynamicDrawerFormProps<T = Record<string, any>> extends Omit<DynamicFormProps<T>, 'ref'> {
  title: string;
  trigger?: JSX.Element;
  visible?: boolean;
  loading?: boolean;
  width?: number | string;
  /** @name 打开关闭的事件 */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * 不支持 'visible'，请使用全局的 visible
   *
   * @name 抽屉的属性
   */
  drawerProps?: Omit<DrawerProps, 'visible'>;
}

export function DynamicDrawerForm<T = Record<string, any>>({
  trigger,
  title,
  loading,
  width,
  onVisibleChange,
  drawerProps,
  visible: _visible,
  onFinish,
  ...rest
}: DynamicDrawerFormProps<T>) {
  const formRef = useRef<Pick<FormInstance<T>, 'submit' | 'resetFields'>>(null);
  const [visible, setVisible] = useMergedState<boolean>(!!_visible, {
    value: _visible,
    onChange: onVisibleChange,
  });

  useEffect(() => {
    if (visible && _visible) {
      onVisibleChange?.(true);
    }
  }, [visible]);

  /** 如果 destroyOnClose ，重置一下表单 */
  useEffect(() => {
    // 再打开的时候重新刷新，会让 initialValues 生效
    if (visible && drawerProps?.destroyOnClose) {
      formRef.current?.resetFields();
    }
  }, [drawerProps?.destroyOnClose, visible]);

  return (
    <>
      {trigger &&
        React.cloneElement(trigger, {
          ...trigger.props,
          onClick: (e: any) => {
            setVisible(!visible);
            trigger.props?.onClick?.(e);
          },
        })}
      <Drawer
        footer={
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              style={{ marginRight: '8px' }}
              onClick={(e) => {
                setVisible(false);
                drawerProps?.onClose?.(e);
              }}
            >
              取消
            </Button>
            <Button type="primary" onClick={() => formRef.current?.submit()} loading={loading}>
              保存
            </Button>
          </div>
        }
        visible={visible}
        width={width || 720}
        {...drawerProps}
        title={title}
        placement="right"
        onClose={(e) => {
          setVisible(false);
          drawerProps?.onClose?.(e);
        }}
      >
        <DynamicForm
          {...rest}
          formRef={formRef}
          onFinish={async (values) => {
            if (!onFinish) return;
            const success = await onFinish(values);
            if (success) {
              formRef.current?.resetFields();
              setVisible(false);
            }
          }}
        />
      </Drawer>
    </>
  );
}
