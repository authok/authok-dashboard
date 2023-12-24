import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { RequestConfig, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import HeaderContent from './components/HeaderContent';
import { errorHandler } from '@/utils/request';
import defaultSettings from '../config/defaultSettings';
import Root from './pages/Root';

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
}> {
  return {
    settings: defaultSettings,
  };
}

/*
export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
    },
    menuItemRender: (menuItemProps, defaultDom) => {
      if (menuItemProps.isUrl) {
        return defaultDom;
      }

      if (menuItemProps.path && location.pathname !== menuItemProps.path) {
        return (
          <Link to={menuItemProps.path} target={menuItemProps.target}>
            {defaultDom}
          </Link>
        );
      }
      return defaultDom;
    },
    headerContentRender: () => <HeaderContent />,
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};
*/

export function rootContainer(container) {  
  return React.createElement(Root, {}, container);
};

/**
 * 扩展内置的request配置
 */
export const request: RequestConfig = {
  errorHandler,
  requestType: 'json',
  requestInterceptors: [],
};