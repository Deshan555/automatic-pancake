import React from "react";
import { Button, Checkbox, Form, Grid, Input, theme, Typography, message } from "antd";
import { useNavigate } from 'react-router-dom';
import { apiExecutions } from '../../api/api-call';
import './../../App.css';
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import appLogo from "../../assets/app.png";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

export default function AuthAdmin() {
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = React.useState(false);

  const authenticateDetails = async (email, password) => {
    setIsLoaded(true);
    try {
      const response = await apiExecutions.authEmployee(email, password);
      if (response !== null) {
        if (response.success === true) {
          navigate('/');
          setIsLoaded(false);
        } else {
          message.error(<span className='textStyles-small'>Auth Failed: {response.message}</span>);
          setIsLoaded(false);
        }
      }
    } catch (error) {
      message.error(<span className='textStyles-small'>Error in authenticating employee</span>);
      setIsLoaded(false);
    }
  }

  const onFinish = (values) => {
    authenticateDetails(values.email, values.password);
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md ? `${token.paddingXL}px` : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px"
    },
    footer: {
      marginTop: token.marginLG,
      textAlign: "center",
      width: "100%"
    },
    forgotPassword: {
      float: "right"
    },
    header: {
      marginBottom: token.marginXL
    },
    section: {
      alignItems: "center",
      backgroundColor: token.colorBgContainer,
      display: "flex",
      height: screens.sm ? "85vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px"
    },
    text: {
      color: token.colorTextSecondary
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3
    }
  };

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src={appLogo} alt="App Logo" width={screens.md ? "400px" : "200px"} height='auto' />
          <Title className="textStyles-small" style={{ fontSize: 22, fontWeight: '550px' }} >Sign in</Title>
          <Text className="textStyles-small" style={styles.text}>
            Welcome back to Thaprobane Admin! Please enter your details below to
            sign in.
          </Text>
        </div>
        <Form name="email"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item name="email" rules={[{ type: "email", required: true, message: "Please input your Email!" }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox><span style={styles.text} className="textStyles-small">Remember me</span></Checkbox>
            </Form.Item>
            <a style={styles.forgotPassword} href="" className="textStyles-small">
              Forgot password?
            </a>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0px" }}>
            <Button block="true" type="primary" htmlType="submit" loading={isLoaded}>
              <span style={{ color: 'white' }} className="textStyles-small">Signin as Admin</span>
            </Button>
            <div style={styles.footer}>
              <Text style={styles.text} className="textStyles-small">Thaprobane Dev {new Date().getFullYear()}</Text>
              {/* <Link href="" className="textStyles-small">Sign up now</Link> */}
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}