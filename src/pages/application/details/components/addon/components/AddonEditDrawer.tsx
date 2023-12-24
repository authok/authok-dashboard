import React from 'react';
import { Tabs, Drawer } from 'antd';
import SchemaField from '@/components/SchemaField';
import { createForm } from '@formily/core';
import { Form, FormButtonGroup, Submit } from '@formily/antd'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AddonEditDrawerProps {
  application: API.Application;
  addon: API.Addon;
  visible: boolean;
  onFinish: (application: Partial<API.Application>) => void;
  onClose: () => void;
}

const AddonEditDrawer: React.FC<AddonEditDrawerProps> = ({ application, visible, addon, onFinish, onClose }) => {
  const form = createForm({
    validateFirst: true,
    values: {
      ...(application && !!application.redirect_uris && application.redirect_uris.length > 0 && { callback: application.redirect_uris[0] }),
      ...(addon && application && { settings: JSON.stringify(application.addons[addon.key], null, 2) }),
    },
  });

  const handleFinish = (value: Record<string, any>) => {
    const { callback, ...rest } = value;
    let redirect_uris = !!application.redirect_uris ? [...application.redirect_uris] : [];
    if (!redirect_uris) {
      redirect_uris = [callback];
    } else {
      const index = redirect_uris.indexOf(callback);
      if (index > 0) {
        const temp = redirect_uris[index];
        redirect_uris[index] = redirect_uris[0];
        redirect_uris[0] = temp;
      } else if (index === 0) {
      } else {
        redirect_uris = [callback, ...redirect_uris];
      }
    }

    const addons = {...application.addons};
    addons[addon.key] = JSON.parse(rest.settings);

    onFinish({ redirect_uris, addons });
  };

  const usage = addon?.usage;

  return <Drawer
    visible={visible}
    onClose={onClose}
    destroyOnClose={true}
    size="large"
  >
    {addon && (
    <Tabs defaultActiveKey="settings">
      <Tabs.TabPane tab="设置" key="settings">
        <Form form={form} size="large">
          <SchemaField schema={addon.schema}/>
          <FormButtonGroup>
            <Submit onSubmit={handleFinish}>保存</Submit>
          </FormButtonGroup>
       </Form>
      </Tabs.TabPane>
      <Tabs.TabPane tab="使用说明" key="usage">
        <ReactMarkdown className="markdown" children={usage} remarkPlugins={[remarkGfm]} />
      </Tabs.TabPane>
    </Tabs>
    )} 
  </Drawer>;
};

export default AddonEditDrawer;