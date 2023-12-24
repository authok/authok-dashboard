import { createFromIconfontCN } from '@ant-design/icons';
import { List, message } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import * as _ from 'lodash';
import { unlink, link } from '@/services/account';
import { useAuthok } from '@authok/authok-react';

// icon 图标
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_638857_83pnxx0zhdr.js',
});

// 登录渠道
type OpenPlatform = {
  provider: string;
  title: string;
  description: string;
  actions: JSX.Element[];
  avatar: JSX.Element;
};

// 可用的渠道
const platforms: OpenPlatform[] = [
  {
    provider: 'wechatwork-service-provider-qrconnect',
    title: '企业微信',
    description: '尚未绑定企业微信',
    actions: [],
    avatar: <IconFont className="taobao" type="icon-icon-test" />,
  },
  {
    provider: 'wechat-pc',
    title: '微信',
    description: '尚未绑定微信',
    actions: [],
    avatar: <IconFont className="taobao" type="icon-we-chat" />,
  },
  {
    provider: 'tiktok-pc',
    title: '抖音',
    description: '尚未绑定抖音',
    actions: [],
    avatar: <IconFont className="taobao" type="icon-douyin2" />,
  },
];

type BindProps = {};

const BindingView: React.FC<BindProps> = (props: BindProps) => {
  // const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const { user } = useAuthok();

  // 重新加载用户信息
  const reloadAccount = async () => {
    
  };

  // 解绑用户
  const unlinkUser = async (provider: string, openid: string, token: string) => {
    const res = await unlink(token, openid, provider);
    if (res.code === 200) {
      message.success('解绑成功');
      await reloadAccount();
    } else {
      message.error('解绑失败');
    }
  };

  // 社会化登录回调
  const onAuthorizeResult = {
    onSuccess: async (user: User) => {
      // 此社会化登录账号已绑定手机号
      if (user.phone) {
        message.error('已绑定手机号，不可以重复绑定');
        return;
      }

      // 当前登录用户的token
      const primaryUserToken = null ; // getToken();
      if (!primaryUserToken) return;

      // 社会化登录的token
      const secondaryUserToken = user.token!;
      if (!secondaryUserToken) return;

      const res = await link(primaryUserToken, secondaryUserToken);
      if (res.code === 200) {
        message.success('绑定成功');
        await reloadAccount();
      } else {
        message.error('绑定失败');
      }
    },

    onError: (code: number, msg: string) => {
      console.error(`绑定失败：${code}, ${message}`);
      message.error('绑定失败');
    },
  };

  // 绑定用户
  const linkUser = async (provider: string) => {
    // await client.social.authorize(provider, onAuthorizeResult);
  };

  // 解绑操作
  const unlinkAction = (provider: string, openid: string, token: string) => (
    <a
      key="unBind"
      onClick={async () => {
        unlinkUser(provider, openid, token);
      }}
    >
      解绑
    </a>
  );

  // 绑定操作
  const linkAction = (provider: string) => (
    <a
      key="Bind"
      onClick={async () => {
        linkUser(provider);
      }}
    >
      绑定
    </a>
  );

  // 登录渠道信息
  const [data, setdata] = useState<OpenPlatform[]>();

  // 初始计算可用的登录渠道
  useEffect(() => {

    const token = getToken();
    if (!token) return;

    const identityMap = _.keyBy(identities, (it) => it.provider);

    const availablePlatforms = platforms.map((it) => {
      const platform = _.cloneDeep(it);
      const identity = identityMap[it.provider];
      if (identity) {
        // 存在，已经绑定过
        platform.actions = [unlinkAction(it.provider, identity.openId, token)];
        platform.description = '（已绑定）';
      } else {
        // 不存在，需要绑定
        platform.actions = [linkAction(it.provider)];
        platform.description = '（未绑定）';
      }
      return platform;
    });

    setdata(availablePlatforms);
  }, []);

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default BindingView;
