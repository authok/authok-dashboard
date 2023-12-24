// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
import { routes } from './routes';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';



const monacoEditorSupportedLanguages = [
  'abap',
  'apex',
  'azcli',
  'bat',
  'cameligo',
  'clojure',
  'coffee',
  'cpp',
  'csharp',
  'csp',
  'css',
  'dart',
  'dockerfile',
  'fsharp',
  'go',
  'graphql',
  'handlebars',
  'hcl',
  'html',
  'ini',
  'java',
  'javascript',
  'json',
  'julia',
  'kotlin',
  'less',
  'lexon',
  'lua',
  'markdown',
  'mips',
  'msdax',
  'mysql',
  'objective-c',
  'pascal',
  'pascaligo',
  'perl',
  'pgsql',
  'php',
  'postiats',
  'powerquery',
  'powershell',
  'pug',
  'python',
  'r',
  'razor',
  'redis',
  'redshift',
  'restructuredtext',
  'ruby',
  'rust',
  'sb',
  'scala',
  'scheme',
  'scss',
  'shell',
  'solidity',
  'sophia',
  'sql',
  'st',
  'swift',
  'systemverilog',
  'tcl',
  'twig',
  'typescript',
  'vb',
  'xml',
  'yaml',
];




export default defineConfig({
  define: {
    AUTHOK_CLIENT_ID: process.env.AUTHOK_CLIENT_ID,
    AUTHOK_DOMAIN: process.env.AUTHOK_DOMAIN,
    AUTHOK_SCOPE: process.env.AUTHOK_SCOPE || 'openid profile email offline_access',
    MGMT_API_HOST: process.env.MGMT_API_HOST,
    AUTHOK_MGMT_AUDIENCE: process.env.AUTHOK_MGMT_AUDIENCE,
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  /*
  layout: {
    logo: '/logo.png',
    name: 'authok',
    locale: true,
  },*/
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  mock: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  chainWebpack: (config, { webpack }) => {
    console.log('chainWebpackxxx');

    //更多配置 https://github.com/Microsoft/monaco-editor-webpack-plugin#options
    config.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
        // 按需配置
        {
            languages: monacoEditorSupportedLanguages,
            publicPath: '/',
        },
    ]);
    return config;
  },
});
