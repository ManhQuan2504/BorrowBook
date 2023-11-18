import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { Notification } from '../../components/Notification/Notification'



const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };
  useEffect(() => {
    if (localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) {
      navigate('/')

    } else {
      navigate('/sign-in')
    }
  }, [])
  const handleSignIn = async (e) => {
    try {
      e.preventDefault()

      const res = await UserService.signInAccount(email, password)
      console.log("res", res)
      if (res.code !== 200) {
        return Notification('Đăng nhập thất bại', res.response.data.message, 'error')
      }

      const now = new Date()
      localStorage.setItem('access_token', res?.data?.access_token)
      localStorage.setItem('refresh_token', res?.data?.refresh_token)
      localStorage.setItem('access_token_at', now)

      setEmail('')
      setPassword('')
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid
      className="signInPage_container"
      textAlign="center"
      style={{ height: "100vh" }}
      verticalAlign="middle"
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" color="yellow" textAlign="center">
          ĐĂNG NHẬP HỆ THỐNG
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <Button onClick={handleSignIn} color="teal" fluid size="large">
              Đăng Nhập
            </Button>
          </Segment>
        </Form>
        <Message>
          Bạn chưa có tài khoản?{" "}
          <Message.Content
            className="button-text"
            onClick={handleNavigateSignUp}
          >
            <span>Đăng ký</span>
          </Message.Content>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LoginForm;
