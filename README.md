# Authok

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

### Docker构建发布
```bash
docker build -t authok/authok-mgmt-spa -m 8144m .
```

### 上传
```bash
docker tag authok/authok-mgmt-spa ccr.ccs.tencentyun.com/authok/authok-mgmt-spa:latest
docker push ccr.ccs.tencentyun.com/authok/authok-mgmt-spa:latest
```

### CDN COS/OSS部署
参考: https://cloud.tencent.com/document/product/436/64575
静态回源地址设置通配 history 路由.

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).
