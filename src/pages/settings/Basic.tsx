import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Button, Form, Input, message, Modal, Upload, Popover, Spin } from 'antd';
import { CopyOutlined, EditFilled, RedoOutlined } from '@ant-design/icons';
import './Basic.less';
import copy from 'copy-to-clipboard';
import { connect, ConnectProps, UserPoolModelState } from 'umi';

interface UserpoolsBasicProps extends ConnectProps {
  userpool: API.UserPool
}

const Basic: React.FC<UserpoolsBasicProps> = (props: UserpoolsBasicProps) => {
  // const { refresh } = useRequest({});
  const [loading, setLoading] = useState(false)
  const [refeshSerectPopoverVisable, setRefeshSerectPopoverVisable] = useState<boolean>(false);
  const [basicForm] = Form.useForm();

  const saveUserpoolHandler = () => {
    setLoading(true);
    props.dispatch({
      type: 'userpool/update',
      payload: basicForm.getFieldsValue(),
      callback: () => {
        message.success('保存成功')
        setLoading(false);
        // console.log('保存成功')
        // history.go(0)
      }
    })
  }
  useEffect(() => {
    // console.log('props', props)


  }, [])
  // 复制操作
  const copyHandler = (text: string) => {
    if (copy(text)) {
      message.success("已复制到剪贴板");
    } else {
      message.error("复制失败，请手动复制到剪贴板");
    }
  }
  // 刷新秘钥
  const refreshSercetHandler = () => {
    setRefeshSerectPopoverVisable(true)
  }
  // 删除用户池操作
  const deleteUserpoolsHandler = () => {
    const contentMsg = (<>
      <Form layout="vertical">
        <Form.Item label>
          <Input placeholder="请输入用户池名称" name="userpoolsName" />
        </Form.Item>
      </Form >
    </>)

    Modal.confirm({
      title: `请输入要删除用户池名称:${props.userpool.name}`,
      content: contentMsg,
      okText: '确认',
      cancelText: '取消',
      onOk: () => { },
    });
  }
  return (
    <Spin spinning={loading}>
      <PageContainer style={{ backgroundColor: '#fff' }}>
        <div className='content'>
          <Form form={basicForm} labelCol={{ span: 4 }} labelAlign="left"
            onFinish={() => {
              saveUserpoolHandler()
            }}
            initialValues={props.userpool}
          >
            <Form.Item label="用户池 Logo">
              <Upload

                listType="picture"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              >
                <div className="groupLogo">
                  <div style=
                    {{
                      width: '100%', height: '100%',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      backgroundImage: 'url(https://files.authing.co/authing-console/login_logo.svg)'
                    }} />
                  <EditFilled className='edit' />
                  <div className="mask"><span>修改</span><span>图片</span></div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item
              label="用户池 ID"
            // name="userpoolsId"
            >
              <span>
                {props.userpool.id!}&nbsp; <CopyOutlined onClick={() => { copyHandler(props.userpool.id!) }} />
              </span>
            </Form.Item>
            <Form.Item

            label="密钥"
          // name="clientSecret"
          >
            <span>
              {props.userpool.secret}
              <CopyOutlined onClick={() => { copyHandler(props.userpool.secret!) }} />
            </span>
            {/* <span style={{ marginLeft: '11px', cursor: 'pointer' }}>
              <Popover trigger="click"
                visible={refeshSerectPopoverVisable}
                placement="topLeft"
                content={() => {
                  return (<>
                    <div className="popover-message">
                      刷新后，所有授权的应用都需要使用新的密钥进行更新。确定刷新吗？（该操作不可逆)
                    </div>
                    <div className="popover-buttons">
                      <Button size="small" onClick={() => { setRefeshSerectPopoverVisable(false) }}>取消</Button>
                      <Button type="primary" size="small">确认</Button>
                    </div>
                  </>)
                }}
                onVisibleChange={() => { setRefeshSerectPopoverVisable(false) }}>
                刷新密钥&nbsp;
                </Popover>
            </span> */}
            {/* <RedoOutlined onClick={refreshSercetHandler} /> */}
          </Form.Item>
            {/* <Form.Item
            label="用户池地址"
          // name="domain"
          >
            <a href="/">{props.userpool.domain!}</a>
          </Form.Item>
           */}
            <Form.Item
              label="用户池名称"
              name="name"
            >
              <Input style={{ width: '300px' }} value={props.userpool.name!}/>
            </Form.Item>
            <Form.Item

              label="描述"
              name="description"
            >
              <Input.TextArea value={props.userpool.description!} />
            </Form.Item>
            <Form.Item style={{ marginTop: '60px' }}>
              <Button type="primary" onClick={() => { basicForm.submit() }}>
                保存
          </Button>
            </Form.Item>
          </Form>
          <div style={{ height: '48px' }} />
          {/* <div className="titleWrapper">
          <div className="title" style={{ fontSize: '20px' }}>
            <span>危险操作</span>
          </div>
        </div>
        <Alert
          message="删除用户池"
          description={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              此操作不可恢复，请谨慎操作
            <Button type="primary" onClick={deleteUserpoolsHandler} danger style={{ transform: 'translateY(-50%)' }}>删除此用户池</Button>
            </div>
          }
          type="error"
          showIcon
        /> */}
        </div>
      </PageContainer>
    </Spin>
  );
};


export default connect(
  ({
    userpool,
  }: {
    userpool: UserPoolModelState;
  }) => ({
    userpool: userpool.current,
  }),
)(Basic);