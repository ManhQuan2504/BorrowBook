import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { useLocation, useNavigate } from 'react-router-dom'
import './style.scss';
const SignUpPage = () => {
  const navigate = useNavigate()
  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };
  return(
    
  <Grid className='signUpPage_container' textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h1' color='yellow' textAlign='center'>
      ĐĂNG KÝ TÀI KHOẢN
      </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
          />
           <Form.Input fluid icon='address card outline' iconPosition='left' placeholder='Name Your' />
           <Form.Input fluid icon='phone' iconPosition='left' placeholder='Phone Your' />
           <Form.Input fluid icon='map' iconPosition='left' placeholder='Address Your' />

          <Button color='teal' fluid size='large'>
            Đăng ký
          </Button>
        </Segment>
      </Form>
      <Message size='small'>
        Bạn đã có tài khoản?<Message.Content className='button-text' onClick={handleNavigateSignIn}><span >Đăng nhập</span></Message.Content>
      </Message>
    </Grid.Column>
  </Grid>
 
  )
}

export default SignUpPage