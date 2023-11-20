import React from 'react';
import { Image, List, Input, Form, Divider, Label } from 'semantic-ui-react';
import logoUser from '../../assets/images/logo-user.jpg'; // Đảm bảo import đúng đường dẫn của hình ảnh
import './style.scss';
import { useDispatch, useSelector  } from 'react-redux';


const ProfilePage = () => {
const [{ data: currentUser } = {}] = useSelector((state) => state.orebiReducer.userInfo);

  return (
    <div className="profile-container">
      <div className="profile-header">
      <Image src={currentUser?.image || logoUser} size="small" avatar />

        <h2>User Name</h2>
      </div>
      <Divider />
      <List>
        <List.Item> 
          <List.Icon name="user" />
          <List.Content>
            <List.Header>Full Name</List.Header>
           {currentUser?.name || ''}
          </List.Content>
        </List.Item>

        <List.Item>
          <List.Icon name="mail" />
          <List.Content>
            <List.Header>Email</List.Header>
            {currentUser?.email || ''}
          </List.Content>
        </List.Item>

        <List.Item>
          <List.Icon name="phone" />
          <List.Content>
            <List.Header>Phone</List.Header>
            {currentUser?.phone || ''}
          </List.Content>
        </List.Item>

        <List.Item>
          <List.Icon name="home" />
          <List.Content>
            <List.Header>Address</List.Header>
            {currentUser?.address || 'No address!'}
          </List.Content>
        </List.Item>
        {/* Thêm thông tin người dùng khác nếu cần */}
      </List>
      <Divider />
      <Form>
        <Form.Field>
          <label>Change Password</label>
          <Input type="password" placeholder="New Password" />
        </Form.Field>
        <Form.Field>
          <Input type="password" placeholder="Confirm Password" />
        </Form.Field>
        <Form.Button primary>Update Password</Form.Button>
      </Form>
    </div>
  );
};

export default ProfilePage;
