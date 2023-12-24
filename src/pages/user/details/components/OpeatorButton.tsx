import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect, ConnectProps, UserModelState, history } from 'umi';
import { Button, Dropdown, Form, Input, Menu, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatPath } from '@/utils/link.utils';



interface OperatorButtonProps extends ConnectProps {
    id: string
    user?: API.User
}

const OperatorButton: React.FC<OperatorButtonProps> = (props: OperatorButtonProps) => {
    const { dispatch, id } = props
    const [modifyEmailVisible, setModifyEmailVisible] = useState<boolean>(false);
    const [modifyPsswordVisible, setModifyPasswordVisible] = useState<boolean>(false);
    const [emailform] = Form.useForm();
    const [passwordForm] = Form.useForm();
    // 新密码
    const handleCheckPwd = async (_: any, value: string) => {
        const cfmPwd = passwordForm.getFieldValue('newPassword');
        if (cfmPwd && cfmPwd !== value) {
            throw new Error('两次密码输入不一致')
        }
    }
    // 确认密码
    const handleCfmPwd = async (_: any, value: string) => {
        const loginpass = passwordForm.getFieldValue('password');
        if (loginpass && loginpass !== value) {
            throw new Error('两次密码输入不一致')
        }
    }
    // 锁定、解锁
    const blockedHandler = () => {
        // message.loading({ content: 'Loading...', key: 'lockUser' });
        dispatch({
            type: 'user/block',
            payload: { id: props.id, blocked: !(props.user!.blocked) },
            callback: (res) => {
                if (res.blocked) {
                    message.success({ content: '锁定成功，该用户暂时将无法登录', key: 'lockUser', duration: 0.5 });
                } else {
                    message.success({ content: '解锁成功，该用户可以重新进行登录', key: 'lockUser', duration: 0.5 });
                }
            }
        });
    }
    // 确认删除模态
    const confirmDeleteModal = () => {

        const confirmDeleteHandler = async () => {
            dispatch({
                type: "user/deleteUser",
                payload: props.id,
                callback: (resp) => {
                    if (resp) {
                        message.info('删除成功！')
                        history.push({
                            pathname: formatPath(`/user/user-list/`),
                        });
                    } else {
                        message.error('删除失败')
                    }
                }
            })

        }
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '确定删除用户？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => { confirmDeleteHandler() }
        });
    }
    // 修改邮箱
    const modifyEmailHandler = async () => {
        await emailform.validateFields()
        emailform.submit()
        console.log('email', emailform.getFieldsValue());
        message.loading({ content: 'Loading...', key: 'email' });
        dispatch({
            type: "user/modifyEmail",
            payload: { id: props.id, email: emailform.getFieldValue('email') },
            callback: () => {
                setModifyEmailVisible(false);
                message.success({ content: '修改成功', key: 'email', duration: 1 });
            }
        })
    }
    // 修改密码
    const modifyPasswordHandler = async () => {
        await passwordForm.validateFields()
        passwordForm.submit()
        message.loading({ content: '加载中...', key: 'password' });
        console.log('password', passwordForm.getFieldsValue());
        dispatch({
            type: "user/modifyPassword",
            payload: { id: props.id, password: passwordForm.getFieldValue('password') },
            callback: () => {
                setModifyPasswordVisible(false);
                message.success({ content: '修改成功', key: 'password', duration: 1 });
            }
        })
    }
    // 刷新token模态
    const confirmRefreshTokenModal = () => {
        const refreshTokenHandler = async () => {
            message.loading({ content: 'Loading...', key: 'refreshtoken' });
            dispatch({
                type: "user/refreshToken",
                payload: id,
                callback: () => {
                    message.success({ content: '刷新成功', key: 'refreshtoken', duration: 1 });
                }
            })
        }
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '确定强制刷新用户当前的 token 吗，刷新之后用户当前 token 将会失效。',
            okText: '确认',
            cancelText: '取消',
            onOk: () => { refreshTokenHandler() }
        });
    }
    // 菜单按钮点击 行为
    const handleMenuClick = async (e) => {
        switch (e.key) {
            case '1':
                blockedHandler();
                break
            case '2':
                confirmDeleteModal();
                break
            case '3':
                emailform.resetFields();
                setModifyEmailVisible(true);
                break;
            case '4':
                passwordForm.resetFields();
                setModifyPasswordVisible(true)
                break;
            case '5':
                confirmRefreshTokenModal();
                break
            default:
                break
        }
    }
    
    const menu = (
        <Menu  onClick={handleMenuClick}>
            <Menu.Item key="1">{props.user!.blocked ? '解锁用户' : '锁定用户'}</Menu.Item>
            <Menu.Item key="2">删除用户</Menu.Item>
            <Menu.Item key="3">修改邮箱</Menu.Item>
            <Menu.Item key="4">修改密码</Menu.Item>
            <Menu.Item key="5">强制刷新 token</Menu.Item>
        </Menu>
    );
    return (
        <>
            <Modal
                title="修改邮箱"
                visible={modifyEmailVisible}
                onOk={() => { modifyEmailHandler() }}
                onCancel={() => { setModifyEmailVisible(false) }}
                okText="确认"
                destroyOnClose
                cancelText="取消"
            >
                <Form form={emailform}>
                    <Form.Item rules={[{ required: true, message: "请输入邮箱", type: 'email' }]} required label="邮箱" name="email" >
                        <Input placeholder="请输入用户新邮箱" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="修改密码"
                visible={modifyPsswordVisible}
                onOk={() => { modifyPasswordHandler() }}
                onCancel={() => { setModifyPasswordVisible(false) }}
                okText="确认"
                destroyOnClose
                cancelText="取消"
            >
                <Form form={passwordForm}>
                    <Form.Item labelCol={{ span: 6 }} required rules={[{ required: true }, { validator: (rules, value) => handleCheckPwd(rules, value) }]} label="新密码" name="password" >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item labelCol={{ span: 6 }} required rules={[{ required: true }, { validator: (rules, value) => handleCfmPwd(rules, value) }]} label="确认新密码" name="newPassword" >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
            <Dropdown  overlay={menu} placement="bottomCenter">
                <Button>操作</Button>
            </Dropdown>
        </>

    )
}

export default connect(
    ({
        user,
    }: {
        user: UserModelState;
    }) => ({
        user: user.user,
    }),
)(OperatorButton);

