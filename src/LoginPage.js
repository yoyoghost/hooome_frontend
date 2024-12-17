// src/LoginPage.js
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import api from './tools/api.js';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 登录逻辑
      api.post('/api/login', values).then(response => {
        message.success('登录成功');
        // 重定向到首页
        window.location.href = '/trade';
      }).catch(error => {
        console.error('Error addTradeInfo: ', error);
        const errorresp = error.response.data;
        message.error(errorresp.message);
      });
    } catch (error) {
      message.error('登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '300px', margin: '40px auto' }}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: '100%' }}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;