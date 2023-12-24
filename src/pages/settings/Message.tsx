import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import SMSVerificationService from './components/SmsForm';

import './Message.less';

const { TabPane } = Tabs;

interface MessageProps {

}

const Message: React.FC<MessageProps> = (props: MessageProps) => {
  const renders = {
    // emailTemplate: () => <EmailTemplate />,
    // emailService3rd: () => <EmailService3rd />,
    SMSVerificationService: () => <SMSVerificationService />
  }
  const tabPaneContext = [
    // {
    //   id: 'emailTemplate',
    //   title: '邮件模板',
    //   render: renders.emailTemplate
    // },
    // {
    //   id: 'emailService3rd',
    //   title: '第三方邮件服务',
    //   render: renders.emailService3rd
    // },
    {
      id: 'SMSVerificationService',
      title: '短信验证服务',
      render: renders.SMSVerificationService
    },
  ]
  const callback = () => {
    console.log('切换服务');
  }
  return (
    <PageContainer style={{ backgroundColor: '#fff' }}>
      <div className='content'>
        <Tabs defaultActiveKey='SMSVerificationService' onChange={callback}>
          {tabPaneContext.map(ctx =>
            <TabPane tab={ctx.title} key={ctx.id}>
              {ctx.render()}
            </TabPane>
          )}
        </Tabs>
      </div>
    </PageContainer>
  )
}

export default Message;
