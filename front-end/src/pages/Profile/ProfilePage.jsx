import React from 'react';
import { Image, List, Input, Form, Divider, Label } from 'semantic-ui-react';
import logoUser from '../../assets/images/logo-user.jpg'; // Đảm bảo import đúng đường dẫn của hình ảnh
import './style.scss';

const ProfilePage = () => {
  return (
    <div className="profile-container">
      <div className="profile-header">
        <Image src={logoUser} size="medium" circular />
        <h2>User Name</h2>
      </div>
      <Divider />
      <List>
        <List.Item> 
          <List.Icon name="user" />
          <List.Content>
            <List.Header>Full Name</List.Header>
            John Doe
          </List.Content>
        </List.Item>

        <List.Item>
          <List.Icon name="mail" />
          <List.Content>
            <List.Header>Email</List.Header>
            john.doe@example.com
          </List.Content>
        </List.Item>

        <List.Item>
          <List.Icon name="phone" />
          <List.Content>
            <List.Header>Phone</List.Header>
            +1-123-456-7890
          </List.Content>
        </List.Item>

        <List.Item>
          <List.Icon name="home" />
          <List.Content>
            <List.Header>Address</List.Header>
            54 Triều Khúc - Thanh Xuân - Hà Nội
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
