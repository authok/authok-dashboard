import React from 'react';
import { Collapse, Alert } from 'antd';

const { Panel } = Collapse;

// 小程序扫码登录
export const MiniProgramQrEditForm = (props: AppEditFormDataProps) => {
  const { app, form } = props;
  return (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>小程序扫码登录 配置说明</h4>
            <p>
              Authing 小程序扫码登录分为两种模式：
              <b>公有云模式</b> 和
              <b>
                <a href="http://www.baidu.com" target="_blank" rel="noopener noreferrer">
                  私有化部署模式
                </a>
              </b>
              。公有云模式不需要配置小程序的 ID 和 secret，只需上传一个自定义 logo 和跳转链接即可。
            </p>
            <br />
            <p>如何确定你需要哪种模式：</p>
            <ol>
              <li>1. 如果你刚开始使用 Authing 小程序扫码登录，选择公有云模式。</li>
              <li>2. 如果你对小程序有品牌自定义需求，请联系我们使用私有化部署模式。</li>
              <li>
                3.
                如果你有关联微信开发者主体的需求（pc、小程序、公众号、移动应用），请联系我们使用私有化部署模式。
              </li>
            </ol>
            <p>
              详细接入方式请见：
              <a
                href="https://docs.authing.cn/scan-qrcode/wxapp-qrcode/"
                target="_blank"
                rel="noopener noreferrer"
              >
                小程序扫码登录文档。
              </a>
            </p>
          </>
        }
      />
      <div style={{ padding: '8px 0px', textAlign: 'right' }}>
        {' '}
        <a
          href="https://docs.authing.cn/scan-qrcode/wxapp-qrcode/"
          target="_blank"
          rel="noopener noreferrer"
        >
          不知道怎么填？查看帮助文档
        </a>
      </div>
      <Row>
        <Form form={form} layout="vertical" initialValues={{ remember: true }}>
          <Form.Item name="id" initialValue={app.provider} hidden />
          <Form.Item
            label="自定义 Logo"
            name="logo"
            extra="上传后的 Logo，将作为小程序二维码中央的 Logo"
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            label="登录后回调链接"
            name="callback"
            extra="如果配置了这个链接，用户在完成登录之后，浏览器将会携带用户信息跳转到该页面。"
          >
            <Input />
          </Form.Item>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="你是否正在使用私有化部署的小程序 ？" key="1">
              <div style={{ marginBottom: '11px' }}>
                如果你使用了 Authing 私有化部署的小程序，需要在此填入你的小程序的配置。
                <a href="https://authing.cn/verify" target="_blank" rel="noopener noreferrer">
                  点此了解更多。
                </a>
              </div>
              <Form.Item name="AppID" label="AppID" rules={[{ required: true }]}>
                <Input placeholder="请输入小程序的AppID" />
              </Form.Item>
              <Form.Item name="AppSecret" label="AppSecret" rules={[{ required: true }]}>
                <Input placeholder="请输入小程序的AppSecret" />
              </Form.Item>
            </Panel>
          </Collapse>
          ,
        </Form>
      </Row>
    </>
  );
};
