import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  // primaryColor: 'rgb(82, 196, 26)',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'Authok',
  pwa: false,
  iconfontUrl: '',
} as LayoutSettings & {
  pwa: boolean;
};
