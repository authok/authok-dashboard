import React from 'react';
import { AuthokProvider, useAuthok } from '@authok/authok-react';
import { history } from 'umi';
import { Card, Button, Space } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const TesterCallbackPage: React.FC<any> = () => {
  const _testerParams = sessionStorage.getItem('tester_params');
  const testerParams = JSON.parse(_testerParams);

  return (
    <AuthokProvider
      domain={testerParams.domain}
      clientId={testerParams.client_id}
      scope="openid email profile"
      redirectUri={window.location.href}
      onRedirectCallback={(appState) => {
        console.log('onRedirectCallback: ', appState);
        history.replace(window.location.pathname);
      }}
      cacheLocation="localstorage"
    >
      <Container />
    </AuthokProvider>
  );
};

const Container: React.FC = () => {
  const { error, user, logout } = useAuthok();
  const result = error || user;

  console.log('error11: ', error, user, result);

  const handleLogout = () => {
    logout({
      return_to: window.location.origin,
    });
  };

  return <Card>
    <h2>返回信息: </h2>
    <div style={{ maxWidth: '1024px' }}>
      {result && <SyntaxHighlighter
        language='javascript' 
        style={darcula}
        wrapLongLines={false}
        wrapLines={true}>
        {JSON.stringify(result, '\n', 4)}
      </SyntaxHighlighter>
      }
    </div>

    <Space>
      <Button size="large" onClick={() => window.close() }>关闭测试</Button>
      <Button size="large" onClick={handleLogout}>退出登录</Button>
    </Space>
  </Card>
};

export default TesterCallbackPage;