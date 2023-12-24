import React from 'react';
import { Space, Card, Row, Col, Modal } from 'antd';

interface EmailTemplatePreviewModalProps {
  emailTemplate?: API.EmailTemplate;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const EmailTemplatePreviewModal: React.FC<EmailTemplatePreviewModalProps> = ({ visible, emailTemplate, onCancel, onOk }) => {
  return <Modal
    title="邮件预览"
    width={720}
    visible={visible}
    onCancel={onCancel}
    onOk={onOk}
    destroyOnClose={true}
    style={{ minHeight: 480 }}
  >
    <Space direction="vertical" style={{ width: '100%' }}>
      <Row gutter={[8, 8]}>
        <Col span={6}>发件人: </Col>
        <Col span={18}>{emailTemplate?.from}</Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={6}>主题: </Col>
        <Col span={18}>{emailTemplate?.subject}</Col>
      </Row>
      <Card>
        <div style={{ width: '100%', height: '400' }} dangerouslySetInnerHTML={{__html: emailTemplate?.body || '' }}></div>
      </Card>
    </Space>
  </Modal>;
};

export default EmailTemplatePreviewModal;