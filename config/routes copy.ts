import { IRoute } from 'umi';

export const routes: IRoute[] = [
  {
    path: '/',
    redirect: '/app/applications',
  },
  {
    hideInMenu: true,
    path: '/account/settings',
    name: 'settings',
    component: './account/settings',
  },
  {
    path: '/account',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/account/login',
        component: './account/login',
      },
    ],
  },
  {
    path: '/app',
    redirect: '/app/applications',
  },
  {
    name: 'app',
    locale: 'menu.app',
    icon: 'AppstoreOutlined',
    path: '/app',
    routes: [
      {
        access: 'read:clients',
        icon: 'setting',
        path: 'applications',
        name: 'application.list',
        locale: 'menu.application.list',
        component: './application/list',
        menu: {
          flatMenu: true,
        },
      },
      {
        icon: 'setting',
        hideInMenu: true,
        path: 'applications/:id/:tab?',
        component: './application/details',
      },
      {
        path: 'apis',
        name: 'api.list',
        locale: 'menu.api.list',
        icon: 'ApiOutlined',
        component: './api/list',
      },
      {
        icon: 'setting',
        hideInMenu: true,
        path: 'apis/:id/:tab?',
        component: './api/details',
      },
    ],
  },
  {
    path: '/connections',
    redirect: '/connections/database',
  },
  {
    hideInMenu: true,
    name: 'connection.database.create',
    path: '/connections/database/create',
    component: './connection/database/create',
    wrappers: [
      '@/wrappers/auth',
    ],
  },
  {
    hideInMenu: true,
    name: 'connection.social.create',
    locale: 'menu.connection.social.create',
    path: '/connections/social/create',
    component: './connection/social/create/index',
    wrappers: [
      '@/wrappers/auth',
    ],
  },
  {
    hideInMenu: true,
    name: 'connection.social.create',
    locale: 'menu.connection.social.create',
    path: '/connections/social/create/:strategy',
    component: './connection/social/create/create',
    wrappers: [
      '@/wrappers/auth',
    ],
  },
  {
    name: 'connection',
    locale: 'menu.authentication',
    icon: 'LockOutlined',
    path: '/connections',
    routes: [
      {
        layout: false,
        name: 'tester_callback',
        locale: 'menu.connection.tester_callback',
        hideInMenu: true,
        path: '/connections/tester/callback',
        component: './connection/tester/callback',
      },
      {
        icon: 'setting',
        name: 'database',
        locale: 'menu.connection.database',
        path: '/connections/database',
        component: './connection/database/list',
        wrappers: [
          '@/wrappers/auth',
        ],
      },
      {
        hideInMenu: true,
        path: '/connections/database/:id/:tab?',
        component: './connection/database/details',
        wrappers: [
          '@/wrappers/auth',
        ],
      },
      {
        icon: 'setting',
        name: 'social.list',
        locale: 'menu.connection.social',
        path: '/connections/social',
        component: './connection/social/list',
        wrappers: [
          '@/wrappers/auth',
        ],
      },
      {
        hideInMenu: true,
        path: '/connections/social/:id/:tab?',
        component: './connection/social/details',
        wrappers: [
          '@/wrappers/auth',
        ],
      },
      {
        icon: 'setting',
        name: 'enterprise',
        locale: 'menu.connection.enterprise',
        path: '/connections/enterprise',
        component: './connection/enterprise',
      },
      {
        icon: 'setting',
        name: 'passwordless',
        locale: 'menu.connection.passwordless',
        path: '/connections/passwordless',
        component: './connection/passwordless/list',
      },
      {
        hideInMenu: true,
        path: '/connections/passwordless/sms/:id/:tab?',
        component: './connection/passwordless/details/sms',
      },
    ],
  },
  {
    name: 'organization',
    locale: 'menu.organization',
    icon: 'TeamOutlined',
    path: '/organizations',
    routes: [
      {
        name: 'organization.list',
        locale: 'menu.organization',
        hideInMenu: true,
        path: '.',
        component: './organization/list',
      },
      {
        name: 'organization.details',
        locale: 'menu.organization.details',
        hideInMenu: true,
        path: ':org_id/:tab?',
        component: './organization/details',
      },
      {
        name: 'organization.member-details',
        locale: 'menu.organization.member-details',
        hideInMenu: true,
        path: ':org_id/members/:member_id',
        component: './organization/member-details',
      },
    ],
  },
  {
    name: 'user',
    locale: 'menu.user',
    icon: 'user',
    path: '/user_mgmt',
    routes: [
      {
        name: 'user.list',
        icon: 'user',
        path: 'users',
        locale: 'menu.user.list',
        component: './user/list/index_list',
      },
      {
        hideInMenu: true,
        name: 'user.details',
        locale: 'menu.user.details',
        path: 'users/:id/:tab?',
        component: '@/pages/user/details',
      },
      {
        name: 'role',
        icon: 'role',
        locale: 'menu.role.list',
        path: 'roles',
        component: './role/list',
      },
      {
        hideInMenu: true,
        name: 'role.details',
        locale: 'menu.role.details',
        path: 'roles/:id/:tab?',
        component: '@/pages/role/details',
      },
      {
        name: 'group',
        icon: 'group',
        locale: 'menu.group.list',
        path: 'groups',
        component: './group/list',
      },
    ],
  },
  {
    path: '/branding',
    locale: 'menu.branding',
    name: 'branding',
    icon: 'TagOutlined',
    routes: [
      {
        name: 'universal_login',
        path: 'universal_login',
        locale: 'menu.branding.universal_login',
        component: './branding/universal_login',
      },
      {
        name: 'custom_domains',
        path: 'custom_domains',
        locale: 'menu.branding.custom_domains',
        component: './branding/custom_domains',
      },
      {
        name: 'email-templates',
        path: 'email-templates',
        locale: 'menu.branding.email-templates',
        component: './branding/email-templates',
      }
    ]
  },
  {
    name: 'security',
    path: '/security',
    locale: 'menu.security',
    icon: 'SecurityScanOutlined',
    routes: [
      {
        name: 'security.attack-protection',
        locale: 'menu.security.attack-protection',
        path: 'attack-protection',
        component: './security/attack-protection',
      },
      {
        name: 'security.attack-protection.bot-detection',
        hideInMenu: true,
        locale: 'menu.security.attack-protection.bot-detection',
        path: 'attack-protection/bot-detection',
        component: './security/attack-protection/bot-detection',
      },
      {
        name: 'security.attack-protection.suspicious-ip-throttling',
        hideInMenu: true,
        locale: 'menu.security.attack-protection.suspicious-ip-throttling',
        path: 'attack-protection/suspicious-ip',
        component: './security/attack-protection/suspicious-ip-throttling',
      },
      {
        name: 'security.attack-protection.brute-force',
        hideInMenu: true,
        locale: 'menu.security.attack-protection.brute-force',
        path: 'attack-protection/brute-force',
        component: './security/attack-protection/brute-force',
      },
      {
        name: 'security.attack-protection.breached-password',
        hideInMenu: true,
        locale: 'menu.security.attack-protection.breached-password',
        path: 'attack-protection/breached-password',
        component: './security/attack-protection/breached-password',
      },
      {
        name: 'security.mfa',
        locale: 'menu.security.mfa',
        path: 'mfa',
        component: './security/mfa/list',
      },
      {
        name: 'security.mfa.details',
        locale: 'menu.security.mfa.details',
        hideInMenu: true,
        path: 'mfa/:factor',
        component: './security/mfa/details',
      },
    ],
  },
  {
    name: 'action',
    path: '/actions',
    locale: 'menu.action',
    icon: 'NodeIndexOutlined',
    routes: [
      {
        name: 'flow',
        path: 'flows',
        locale: 'menu.action.flow.list',
        component: './action/flow/list',
      },
      {
        hideInMenu: true,
        name: 'flow.details',
        path: 'flows/:trigger_id',
        locale: 'menu.action.flow.details',
        component: './action/flow/details',
      },
      {
        name: 'library',
        path: 'library',
        locale: 'menu.action.library.list',
        component: './action/library/list',
      },
      {
        hideInMenu: true,
        name: 'library.details',
        path: 'library/:id',
        locale: 'menu.action.library.details',
        component: './action/library/details',
      },
    ],
  },
  /*{
    name: 'pipeline',
    path: '/pipelines',
    locale: 'menu.pipeline',
    icon: 'NodeExpandOutlined',
    routes: [
      {
        name: 'rule',
        path: 'rules',
        locale: 'menu.pipeline.rule.list',
        component: './pipeline/rule/list',
      },
      {
        name: 'hook',
        path: 'hook',
        locale: 'menu.pipeline.hook.list',
        component: './pipeline/hook/list',
      },
    ],
  },*/
  {
    name: 'monitor',
    path: '/monitor',
    locale: 'menu.monitor',
    icon: 'MonitorOutlined',
    routes: [
      {
        name: 'logs',
        path: 'logs',
        locale: 'menu.logs.list',
        component: './monitor/logs/list',
      },
      {
        name: 'stream',
        path: 'stream',
        locale: 'menu.log_stream.list',
        component: './monitor/stream/list',
      },
    ],
  },
  {
    name: 'marketplace',
    path: '/marketplace',
    locale: 'menu.marketplace',
    icon: 'AppstoreAddOutlined',
    component: './marketplace/list',
  },
  {
    name: 'extension',
    path: '/extensions',
    locale: 'menu.extension',
    icon: 'BlockOutlined',
    component: './extension/list',
  },
  {
    name: 'settings',
    path: '/settings',
    icon: 'setting',
    locale: 'menu.settings',
    component: './settings',
  },
  {
    component: './404',
  },
];
