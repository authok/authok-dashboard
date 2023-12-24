import { FormattedMessage, formatMessage } from 'umi';
import React, { Component } from 'react';

import { Form, List, message } from 'antd';
import { useRequest } from '@umijs/hooks';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const passwordStrength = {
  strong: (
    <span className="strong">
      <FormattedMessage id="settingsandaccountsettings.security.strong" defaultMessage="Strong" />
    </span>
  ),
  medium: (
    <span className="medium">
      <FormattedMessage id="settingsandaccountsettings.security.medium" defaultMessage="Medium" />
    </span>
  ),
  weak: (
    <span className="weak">
      <FormattedMessage id="settingsandaccountsettings.security.weak" defaultMessage="Weak" />
      Weak
    </span>
  ),
};

const ModifyPsswordModal = (props) => {
  // const [visable, setVisable] = useState('');

  // useEffect(() => {
  //  setVisable(props.visable)
  // })
  const [passwordForm] = Form.useForm();
  const { run: modifyPasswordRun } = useRequest(() => {}, {
    manual: true, onSuccess: () => {
      message.success({ content: '修改成功', key: 'password', duration: 1 });
    },
    onError: () => {
      message.error({ content: '修改密码失败', key: 'password' });

    }
  })
  // 新密码
  const handleCheckPwd = async (_: any, value: string) => {
    const cfmPwd = passwordForm.getFieldValue('newPassword');
    let errMsg = ''
    if (cfmPwd && cfmPwd !== value) {
      errMsg = '两次密码输入不一致'
      // throw new Error('两次密码输入不一致')
    } else if (!value) {
      errMsg = '密码不能为空'
      // throw new Error('密码不能为空')
    }
    if (errMsg) {
      throw new Error(errMsg);
    }
  }
  // 确认密码
  const handleCfmPwd = async (_: any, value: string) => {
    const loginpass = passwordForm.getFieldValue('password');
    let errMsg = ''
    if (loginpass && loginpass !== value) {
      errMsg = '两次密码输入不一致'
      // throw new Error('两次密码输入不一致')
    } else if (!value) {
      errMsg = '密码不能为空'
      // throw new Error('密码不能为空')
    }
    if (errMsg) {
      throw new Error(errMsg);
    }
  }
  // 修改密码
  const modifyPasswordHandler = async () => {

    await passwordForm.validateFields()
    passwordForm.submit()
    // message.loading({ content: '加载中...', key: 'password' });
    console.log('password', passwordForm.getFieldsValue());

    const { oldPassword, password } = passwordForm.getFieldsValue()
    await modifyPasswordRun(password, oldPassword);
    props.onCannel();
    passwordForm.resetFields();
  }
  return (<Modal
    title="修改密码"
    visible={props.visible}
    onOk={() => { modifyPasswordHandler() }}
    onCancel={() => { props.onCannel(); }}
    okText="确认"
    destroyOnClose
    cancelText="取消"
  >
    <Form form={passwordForm}>
      <Form.Item labelCol={{ span: 6 }} label="旧密码" name="oldPassword" >
        <Input.Password />
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} required rules={[{ validator: (rules, value) => handleCheckPwd(rules, value) }]} label="新密码" name="password" >
        <Input.Password />
      </Form.Item>
      <Form.Item labelCol={{ span: 6 }} required rules={[{ validator: (rules, value) => handleCfmPwd(rules, value) }]} label="确认新密码" name="newPassword" >
        <Input.Password />
      </Form.Item>
    </Form>
  </Modal>)
}



class SecurityView extends Component<any, { visible: boolean }> {

  constructor(props: any) {
    super(props);
    this.state = {
      visible: false
    }
  }

  getData = () => [
    {
      title: '账户密码',
      description: (
        <>
          {formatMessage({ id: 'settingsandaccountsettings.security.password-description' })}：
          {passwordStrength.strong}
        </>
      ),
      actions: [
        <a key="Modify" onClick={() => {
          this.setState({ visible: true })
        }}>
          修改
        </a>,
      ],
    },
    // {
    //   title: formatMessage({ id: 'settingsandaccountsettings.security.phone' }, {}),
    //   description: `${formatMessage(
    //     { id: 'settingsandaccountsettings.security.phone-description' },
    //     {},
    //   )}：138****8293`,
    //   actions: [
    //     <a key="Modify">
    //       <FormattedMessage id="settingsandaccountsettings.security.modify" defaultMessage="Modify" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'settingsandaccountsettings.security.question' }, {}),
    //   description: formatMessage({ id: 'settingsandaccountsettings.security.question-description' }, {}),
    //   actions: [
    //     <a key="Set">
    //       <FormattedMessage id="settingsandaccountsettings.security.set" defaultMessage="Set" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'settingsandaccountsettings.security.email' }, {}),
    //   description: `${formatMessage(
    //     { id: 'settingsandaccountsettings.security.email-description' },
    //     {},
    //   )}：ant***sign.com`,
    //   actions: [
    //     <a key="Modify">
    //       <FormattedMessage id="settingsandaccountsettings.security.modify" defaultMessage="Modify" />
    //     </a>,
    //   ],
    // },
    // {
    //   title: formatMessage({ id: 'settingsandaccountsettings.security.mfa' }, {}),
    //   description: formatMessage({ id: 'settingsandaccountsettings.security.mfa-description' }, {}),
    //   actions: [
    //     <a key="bind">
    //       <FormattedMessage id="settingsandaccountsettings.security.bind" defaultMessage="Bind" />
    //     </a>,
    //   ],
    // },
  ];

  render() {
    const data = this.getData();
    return (
      <>
        <ModifyPsswordModal visible={this.state.visible} onCannel={() => {
          this.setState({ visible: false })
        }} />
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default SecurityView;
