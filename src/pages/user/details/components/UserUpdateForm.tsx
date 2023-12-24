import { DatePicker as AntdDatePicker, Select as AntdSelect, Input as AntdInput, Form, Row, Col, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { API } from '@/services/API';
import CustomFormItemHoc, { FormDisabledContext } from "@/components/FormDisabledContext";
import { useIntl } from 'umi';
import styles from '../style.less';

const { Option } = AntdSelect;
const Input = CustomFormItemHoc(AntdInput);
const Select = CustomFormItemHoc(AntdSelect);
const DatePicker = CustomFormItemHoc(AntdDatePicker);

interface UserUpdateProps {
  user?: API.User;
  onFinish?: any;
  loading?: boolean;
}

const UserUpdateForm: React.FC<UserUpdateProps> = (props) => {
  // const formRef = React.createRef<FormInstance>();
  const [form] = Form.useForm();

  const intl = useIntl();

  const { user, onFinish, loading } = props;
  const [editMode, setEditMode] = useState<boolean>(false);
  useEffect(() => {
    form.setFieldsValue(user);
  }, [user]);

  const handleFinish = async (values: any) => {
    try {
      await onFinish(values);

    } catch (error) {
      message.warning('fail');
      message.warning(intl.formatMessage({ id: 'user.update.catch' }));
    }
    setEditMode(false);
  }




  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  return (
    <>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>详细信息</div>
        <div>
          <Button type="primary" loading={loading} onClick={() => {
            if (editMode) {
              form.submit();
            }
            setEditMode(!editMode)
          }
          }>{!editMode ? '编辑' : '保存'}</Button>
        </div>
      </div>
      <FormDisabledContext.Provider
        value={{
          disabled: !editMode,
        }}>
        <Form
          {...layout}
          form={form}
          layout='vertical'
          onFinish={() => { handleFinish(form.getFieldsValue()) }}
          initialValues={user}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <Col sm={12}>
              <Form.Item name="name" label="名称">
                <Input placeholder="用户昵称" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name="givenName" label="Given Name">
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name="familyName" label="Family Name">
                <Input placeholder="请输入 Family Name" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name="middleName" label="Middle Name">
                <Input placeholder="请输入 Middle Name" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name='nickname' label="昵称">
                <Input placeholder="请输入昵称" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name="phone" label="手机号" rules={[{
                message: '手机号码格式错误',
                validator(rule, value) {
                  console.log('value', value);
                  if (!value || (/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
                    .test(value))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(Error('手机号码格式错误'));
                }
              }]}>
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name="email" label="邮箱" rules={[
                {
                  type: 'email',
                  message: '请输入邮箱!',
                },
              ]}>
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name="preferredUsername" label="首选用户名">
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item name="gender" label="性别">
                <Select>
                  <Option value="U">未知</Option>
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item label="生日">
                <DatePicker placeholder="请选择日期" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item label="国家代码">
                <Input placeholder="请输入国家代码" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item label="省/区">
                <Input placeholder="请输入省/区" />
              </Form.Item>
            </Col>
            <Col sm={12}>
              <Form.Item label="城市">
                <Input placeholder="请输入城市" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </FormDisabledContext.Provider>
    </>);
}

export default UserUpdateForm;