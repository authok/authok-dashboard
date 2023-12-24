import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Card, Button, Tooltip } from 'antd';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormDependency, ProFormDigit, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import Avatar from 'antd/lib/avatar/avatar';
import { useIntl } from 'umi';
import { useForm } from 'antd/lib/form/Form';
import styles from './index.less';
import default_templates from './email-templates';
import CodeEditor from '@/components/CodeEditor';
import { EyeOutlined } from '@ant-design/icons';
import EmailTemplatePreviewModal from './components/EmailTemplatePreviewModal';
import { useBoolean } from '@umijs/hooks';
import * as _ from 'lodash';
import { useResourcePagination, useResourceUpdate } from '@/hooks/useResource';
import { EmailTemplateEntity } from '@/api/entities/email-template.entity';

const EmailTemplatePage: React.FC = () => {
  const { formatMessage } = useIntl();

  const { data: emailTemplates, refresh } = useResourcePagination(EmailTemplateEntity, {
    manual: false,
    formatResult: (page: API.Page<API.EmailTemplate>) => page.items,
  });

  const { run: updateEmailTemplate } = useResourceUpdate(EmailTemplateEntity);

  const [form] = useForm();

  const [currentTemplate, setCurrentTemplate] = useState<string>();

  const emailTemplatesMap = useMemo(() => _.keyBy(emailTemplates, 'template'), [emailTemplates]);

  useEffect(() => {
    if (currentTemplate) {
      const emailTemplate = emailTemplatesMap[currentTemplate];
      const body = default_templates[currentTemplate] || emailTemplate.body || '';
      const values = {...emailTemplate, body };
      console.log('body: ', currentTemplate, values.body);

      form.setFieldsValue(values);
    }
  }, [currentTemplate]);

  useEffect(() => {
    if (emailTemplates && emailTemplates.length > 0 && !currentTemplate) {
      setCurrentTemplate(emailTemplates[0].template);
    }
  }, [emailTemplates]);

  const handleUpdateEmailTemplate = useCallback(async (values: API.EmailTemplate) => {
    if (currentTemplate) {
      await updateEmailTemplate(currentTemplate, values);
      message.success('更新成功');
      refresh();
    }
  }, [emailTemplates, currentTemplate]);

  const metas: ProListMetas<API.EmailTemplate> = {
    avatar: {
      render: (_, record) => <Avatar src={record.name} />
    },
    title: {
      dataIndex: 'template',
      render: (_, record) => <>{formatMessage({ id: `app.settings.email-templates.${record.template}` })}</>,
    },
    description: {
      render: (_, record) => <span>{ formatMessage({ id: `app.settings.email-templates.${record.template}.description`}) }</span>,
    },
    actions: {
      render: (_, record) => <Tooltip title="预览"><EyeOutlined onClick={() => {
        setPreviewItem(record);
        showPreview();
      }} /></Tooltip>
    }
  };

  const {  state: previewVisible, setTrue: showPreview, setFalse: hidePreview } = useBoolean(false);

  const [previewItem, setPreviewItem] = useState<API.EmailTemplate>();

  return <PageContainer>
    <EmailTemplatePreviewModal emailTemplate={previewItem} visible={previewVisible} onCancel={() => hidePreview()} onOk={() => hidePreview()}/>
    <Card bordered={false}>
      <ProCard split="vertical">
        <ProCard colSpan="384px" ghost title="邮件模版">
          <ProList<API.EmailTemplate>
            className={styles['email-templates-list']}
            rowKey="template"
            dataSource={emailTemplates}
            metas={metas}
            rowClassName={(record) => {
              return currentTemplate && record.template === currentTemplate ? styles['split-row-select-active'] : '';
            }}
            onRow={(record) => {
              return {
                onClick: () => {
                  setCurrentTemplate(record.template)
                },
              };
            }}
          />
        </ProCard>
        <ProCard title={ currentTemplate && formatMessage({ id: `app.settings.email-templates.${currentTemplate}` }) }>
          <ProForm 
            size="large"
            form={form}
            onFinish={handleUpdateEmailTemplate}
            initialValues={{
              body: ' ',
            }}
            submitter={{
              render: (props, doms) => {
                return [
                  <Button disabled={!currentTemplate} type="primary" key="submit" onClick={() => props.form?.submit?.()}>保存</Button>,
                  <Button icon={<EyeOutlined/>} onClick={() => {
                    setPreviewItem(form.getFieldsValue());
                    showPreview();
                  }}>预览</Button>
                ];
              }
            }}
          >
            <ProFormSwitch label="开启自定义" name="enabled" />
            <ProFormDependency name={['enabled']}>
              {({ enabled }) => <>
                <ProFormText 
                  disabled={!enabled} 
                  label="发件人" 
                  name="from" 
                  extra="你可以插入变量 {{ application.name }}. 例如: {{ application.name }} <support@yourcompany.com>"
                />
                <ProFormText 
                  disabled={!enabled} 
                  label="主题" 
                  name="subject" 
                  extra="你可以插入变量 {{ application.name }}, {{ user.email }}. 例如: {{ application.name }}"
                />
                <ProFormText 
                  disabled={!enabled} 
                  label="重定向URL" 
                  name="result_url" 
                  placeholder="在验证成功后会被重定向的地址"
                  extra="用户会被重定向的URL. URL可携带参数: {{ application.name }}, {{ application.callback_domain }}"
                />
                <ProFormDigit 
                  disabled={!enabled}
                  default={604800}
                  label="URL生命周期(秒)" 
                  name="url_lifetime_in_seconds" 
                  extra="URL 在给定时间后过期. 默认: 604800 秒 (7天)"
                />
                <ProForm.Item name="body">
                  <CodeEditor 
                    disabled={!enabled}
                    options={{
                      minimap: {
                        enabled: false,
                      }
                    }}
                    width="100%"
                    height="60vh"
                    language="html"
                    theme="vs-dark"
                  />
                </ProForm.Item>
              </>}
            </ProFormDependency>
          </ProForm>
        </ProCard>
      </ProCard>
    </Card>
  </PageContainer>;
};

export default EmailTemplatePage;