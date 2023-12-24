import { Alert, Button, Drawer, Form, Input, Switch } from "antd";
import React, { useState } from "react";
import { UnControlled as CodeMirror } from 'react-codemirror2'


interface TemplateDrawerProps {
    title: string;
    inputForm?: { label: string, name: string, placeholder: string }[];
    visible: boolean;
    onClose: () => void;
}
const TemplateDrawer: React.FC<TemplateDrawerProps> = (props: TemplateDrawerProps) => {
    return (<
        Drawer
        title={props.title}
        placement="right"
        closable={false}
        onClose={props.onClose}
        visible={props.visible}
        destroyOnClose>
        <Form layout="vertical">
            {props.inputForm!.map(data =>
                <Form.Item label={data.label}><Input name={data.name} placeholder={data.placeholder} /></Form.Item>)
            }
            <Form.Item label='模板'>
                <CodeMirror
                    value='<h1>I ♥ react-codemirror2</h1>'
                    options={{
                        mode: 'xml',
                        theme: 'material',
                        lineNumbers: true
                    }}
                    onChange={(editor, data, value) => { }}
                />
            </Form.Item>
        </Form>
    </Drawer>)
}

// 邮箱模板
export const EmailTemplate: React.FC<any> = (props: any) => {
    // const title = '欢迎邮件模版'
    const [visible, setVisible] = useState<boolean>(false);
    const listCards = [
        {
            title: '欢迎邮件',
            info: '一旦用户验证其电子邮件地址，将发送此电子邮件。 如果验证电子邮件已关闭， 则会在用户第一次注册或登录时发送。',
            switchChange: () => { setVisible(true) },
            click: () => { setVisible(true) },
            drawer: <TemplateDrawer
                title=''
                visible={visible}
                onClose={() => { setVisible(false) }}
                inputForm={
                    [{ label: '模版名', name: '', placeholder: '' },
                    { label: '发送人', name: '', placeholder: '' },
                    { label: '主题', name: '', placeholder: '' }]} />,
        },
        {
            title: '重置密码确认',
            info: '每当用户重置密码成功时，都会发送此电子邮件。',
            switchChange: () => { },
            click: () => { },

            drawer: <TemplateDrawer
                title=''
                visible={visible}
                onClose={() => { setVisible(false) }}
                inputForm={[{ label: '模版名', name: '', placeholder: '' },
                { label: '发送人', name: '', placeholder: '' },
                { label: '主题', name: '', placeholder: '' }]} />,
        }, {
            title: '验证邮件',
            info: '用户用邮箱初次注册时会发送一封验证邮箱的链接，用户点击邮件内的网址即可完成验证。',
            switchChange: () => { },
            click: () => { },
            drawer: <TemplateDrawer
                title=''
                visible={visible}
                onClose={() => { setVisible(false) }}
                inputForm={[{ label: '模版名', name: '', placeholder: '' },
                { label: '发送人', name: '', placeholder: '' },
                { label: '主题', name: '', placeholder: '' }]} />,
        }
        , {
            title: '修改绑定邮箱',
            info: '每当用户需要修改绑定邮箱、发送验证码时，都会发送此电子邮件。',
            switchChange: () => { },
            click: () => { },
            drawer: <TemplateDrawer
                title=''
                visible={visible}
                onClose={() => { setVisible(false) }}
                inputForm={[{ label: '模版名', name: '', placeholder: '' },
                { label: '发送人', name: '', placeholder: '' },
                { label: '主题', name: '', placeholder: '' }]} />,
        }
        , {
            title: '重置密码',
            info: '每当用户要求更改密码时，都会发送此电子邮件，可以使用 宏命令指定验证码。',
            switchChange: () => { },
            click: () => { },
            drawer: <TemplateDrawer
                title=''
                visible={visible}
                onClose={() => { setVisible(false) }}
                inputForm={[{ label: '模版名', name: '', placeholder: '' },
                { label: '发送人', name: '', placeholder: '' },
                { label: '主题', name: '', placeholder: '' }]} />,
        }
        , {
            title: '修改密码',
            info: '每当用户要求更改密码时，都会发送此电子邮件，可以使用 宏命令指定验证码。',
            switchChange: () => { },
            click: () => { },
            drawer: <TemplateDrawer
                title=''
                visible={visible}
                onClose={() => { setVisible(false) }}
                inputForm={[{ label: '模版名', name: '', placeholder: '' },
                { label: '发送人', name: '', placeholder: '' },
                { label: '主题', name: '', placeholder: '' }]} />,
        }
    ]
    return (
        <>
            <Alert message={<><span>模版包括：欢迎邮件，密码修改验证和帐户注册验证。</span><br /><span>若不启用模版，我们将会使用系统默认模板。</span></>} type="info" />
            <div>
                {listCards.map((data) =>
                    <div>
                        <div className="listCard">
                            <div className='main'>
                                <div className='icon' />
                                <div>
                                    <div className="title">{data.title}</div>
                                    <div className="info">{data.info}</div>
                                </div>
                            </div>
                            <div className='aside'>
                                <div>
                                    <Switch onChange={data.switchChange} />
                                    <Button style={{ marginLeft: '8px' }} type='primary' onClick={data.click}>配置</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>)
}