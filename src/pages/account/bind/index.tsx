import { Alert, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, SelectLang, useModel, history, History } from 'umi';
import logo from '@/assets/logo.svg';
import Footer from '@/components/Footer';
import LoginFrom from './components/Bind';
import styles from './style.less';
import { link as linkAccount } from '@/services/account';

const { Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  setTimeout(() => {
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    if (!redirect) {
      history.replace('/');
      return;
    }
    (history as History).replace(redirect);
  }, 10);
};

const Bind: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<string>('mobile');

  useEffect(() => {
    //  存在手机号，不可进入此页面
    // console.log('调到这里')
    if (user?.phone) {
      replaceGoto();
    }
  }, [])
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      let msg: {
        status: string;
        type: string;
      } = { status: '', type: '' };

      // 这里获取社会化登录的token
      const secondaryUserToken = null;
      if (!secondaryUserToken) return;

      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      message.error('绑定失败，请重试！');
    }
    setSubmitting(false);
  };

  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="#">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>绑定手机号</span>
            </Link>
          </div>
          <div className={styles.desc}>
            {/* XAuth 快速实现任何 Web、App
            和企业软件的身份认证和用户管理，为您的顾客和员工提供最完善的登录解决方案。 */}
          </div>
        </div>

        <div className={styles.main}>
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <div>
              {status === 'error' && loginType === 'mobile' && !submitting && (
                <LoginMessage content="验证码错误" />
              )}
              <Mobile
                name="mobile"
                placeholder="手机号"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号！',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '手机号格式错误！',
                  },
                ]}
              />
              <Captcha
                name="captcha"
                placeholder="验证码" countDown={120}
                getCaptchaButtonText=""
                getCaptchaSecondText="秒"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ]}
              />
            </div>
            <Submit loading={submitting}>绑定</Submit>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Bind;
