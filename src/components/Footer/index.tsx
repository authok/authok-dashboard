import React from 'react';
// import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    style={{ backgroundColor: 'transparent' }}
    copyright="2022 深圳市增长魔方科技有限公司"
    links={
      [
        // {
        //   key: 'Ant Design Pro',
        //   title: 'Ant Design Pro',
        //   href: 'https://pro.ant.design',
        //   blankTarget: true,
        // },
        // {
        //   key: 'github',
        //   title: <GithubOutlined />,
        //   href: 'https://github.com/ant-design/ant-design-pro',
        //   blankTarget: true,
        // },
        // {
        //   key: 'Ant Design',
        //   title: 'Ant Design',
        //   href: 'https://ant.design',
        //   blankTarget: true,
        // },
      ]
    }
  />
);
