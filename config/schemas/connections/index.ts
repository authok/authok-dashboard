import facebook from './facebook';
import wechat_pc from './wechat:pc';
import wechat_webpage_authorization from './wechat:webpage-authorization';
import wechat_miniprogram_default from './wechat:miniprogram:default';
import wechat_miniprogram_app_launch from './wechat:miniprogram:app-launch';
import wechat_mobile from './wechat:mobile';
import wechat_miniprogram_qrconnect from './wechat:miniprogram:qrconnect';
import wechat_mp_qrconnect from './wechat:mp:qrconnect';
import oauth2 from './oauth2';
import doudian from './doudian';
import slack from './slack';
import linkedin from './linkedin';
import wework_qrcode from './wework:qrcode.json';
import samlp from './samlp.json';
import oidc from './oidc.json';

const connectionSchemas = {
  'wechat:pc': wechat_pc,
  'wechat:webpage-authorization': wechat_webpage_authorization,
  'wechat:miniprogram:default': wechat_miniprogram_default,
  'wechat:mobile': wechat_mobile,
  'wechat:miniprogram:app-launch': wechat_miniprogram_app_launch,
  'wechat:miniprogram:qrconnect': wechat_miniprogram_qrconnect,
  'wechat:mp:qrconnect': wechat_mp_qrconnect,
  linkedin,
  facebook,
  oauth2,
  doudian,
  slack,
  'wework:qrcode': wework_qrcode,
  samlp,
  oidc,
}

export default connectionSchemas;