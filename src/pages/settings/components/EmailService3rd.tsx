import { Alert, Form, Switch } from "antd"
import React from "react"

// 第三方邮箱服务
export const EmailService3rd: React.FC<any> = (props) => {
    return (
        <>
            <Alert style={{ marginBottom: '24px' }} message="你目前正在使用由 Authing 提供的第三方邮件服务, 若想更换服务请选择相应服务输入相关信息后点击保存按钮。" type="info" />
            <Form><Form.Item label='开启第三方邮件服务'><Switch /></Form.Item></Form>
        </>)
}