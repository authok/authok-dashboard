import React, { useEffect } from 'react';
import { Link, SelectLang, history } from 'umi';
import Footer from '@/components/Footer';
import styles from './style.less';
import {
  encode,
  createRandomString,
  sha256,
  bufferToBase64UrlEncoded,
} from '@authok/authok-spa-js/src/utils';
import TransactionManager from '@authok/authok-spa-js/src/transaction-manager';
import { SessionStorage } from '@authok/authok-spa-js/src/storage';
import useTenantContext from '@/providers/tenant/useTenantContext';
import { useAuthok } from '@authok/authok-react';
import { PageLoading } from '@ant-design/pro-layout';

const Login: React.FC<{}> = () => {
  const { tenant } = useTenantContext();
  const { user, isLoading, error } = useAuthok();

  if (isLoading) {
    return <PageLoading tip="检查用户是否已登录..."/>
  }

  useEffect(() => {
    if (user) {
      window.location.pathname = '/';
    }
  }, [user]);

  const url = window.location.href;
  let invitation: string | undefined = undefined;
  let organization = tenant;
  const inviteMatches = url.match(/invitation=([^&]+)/);
  const orgMatches = url.match(/organization=([^&]+)/);
  if (inviteMatches && orgMatches) {
    invitation = inviteMatches[1];
    organization = orgMatches[1];
  }

  useEffect(() => {
    const fn = async () => {
      const stateIn = encode(createRandomString());
      const nonceIn = encode(createRandomString());
      const code_verifier = createRandomString();
      const code_challengeBuffer = await sha256(code_verifier);
      const code_challenge = bufferToBase64UrlEncoded(code_challengeBuffer);
      const redirect_uri = window.location.origin + '/login';
      console.log('lockxxx_redirect_uri: ', redirect_uri, invitation);

      // 用于 authok-react
      const transactionStorage = SessionStorage;
      const transactionManager = new TransactionManager(
        transactionStorage,
        AUTHOK_CLIENT_ID,
      );

      const appState = history.location.pathname === '/login' ? '/' : history.location.pathname;

      console.log('hook: 准备登录', AUTHOK_CLIENT_ID);
      console.warn('准备登录时的 state: ', stateIn);

      transactionManager.create({
        nonce: nonceIn,
        code_verifier,
        appState,
        scope: AUTHOK_SCOPE,
        audience: AUTHOK_MGMT_AUDIENCE || 'default',
        redirect_uri,
        state: stateIn,
        // ...(organizationId && { organizationId })
      });
      // end

      const domain = AUTHOK_DOMAIN;
      const defaultOptions = {
        language: 'zh',
        languageBaseUrl: 'https://cdn.authok.cn',
        container: 'login_container',
        mustAcceptTerms: false,
        initialScreen: 'loginWithSms',
        allowShowPassword: true,
        usernameStyle: 'username',
        signUpFieldsStrictValidation: true,
        defaultDatabaseConnection: 'database',
        prefill: {
        },
        passwordlessMethod: 'code',
        auth: {
          params: {
            organization,
            invitation,
            response_type: 'code',
            response_mode: 'query',
            nonce: nonceIn,
            state: stateIn,
            code_verifier,
            code_challenge,
            code_challenge_method: 'S256',
            redirect_uri,
            scope: AUTHOK_SCOPE,
          }
        },
        additionalSignUpFields: [
          {
            name: 'name',
            placeholder: 'name',
            validator: function () {
              return true;
            }
          },
          {
            name: 'other_name',
            placeholder: 'other name',
            validator: function () {
              return true;
            }
          }
        ],
        hooks: {
          loggingIn: async function (context, done) {
            // Currently, context is always null but might be used in the future.

            done();
          },
          signingUp: function (context, done) {
            // Currently, context is always null but might be used in the future.
            console.log('hook: 注册成功');
            done();
          }
        }
      };
  
      const lock = new window.AuthokLock(AUTHOK_CLIENT_ID, domain, defaultOptions);  
      lock.on('unrecoverable_error', (err) => {
        
      });

      lock.on('authorization_error', (err) => {
        
      });
      
      lock.show({
        languageDictionary: {
          title: '登录'
        }
      });
    };
    fn();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.videoBox}>
        <video width="100%" height="100%" autoPlay={true} loop={true} muted={true}><source src="https://cdn.authok.cn/assets/video/CUBEING_ALL.mp4" type="video/mp4" /></video>
      </div>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to={'/'}>
              <img alt="logo" className={styles.logo} src={'https://cdn.authok.cn/assets/authok-badge.png'} />
              <span className={styles.title}>Authok 身份云</span>
            </Link>
          </div>
          <div className={styles.desc}>
            Authok 快速实现任何 Web、App
            和企业软件的身份认证和用户管理，为您的顾客和员工提供最完善的登录解决方案。
          </div>
        </div>

        <div id="login_container">
          占位符
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
