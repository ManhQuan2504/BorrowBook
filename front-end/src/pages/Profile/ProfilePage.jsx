import React,{useState} from 'react';
import { Image, List, Input, Form,Button, Divider} from 'semantic-ui-react';
import logoUser from '../../assets/images/logo-user.jpg'; // Đảm bảo import đúng đường dẫn của hình ảnh
import './style.scss';
import { useDispatch, useSelector  } from 'react-redux';
import * as UserService from '../../services/UserService';
import { Notification } from "../../components/Notification/Notification";


const ProfilePage = () => {
const [{ data: currentUser } = {}] = useSelector((state) => state.borrowBookReducer.userInfo);
const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const handlePasswordChange =async () => {
    const access_token = localStorage.getItem("access_token");
   
    const res = await UserService.updatePassword(
      access_token,newPassword,confirmPassword
     
    );
    console.log('res',res)
    const dataSignUp = res?.response?.data;
    console.log("dataSignUp", dataSignUp);
    if (res?.code === 200) {
     

      Notification("Cập nhật mật khẩu thành công!", res.message, "success");
      
    } else if (dataSignUp.code !== 200) {
      Notification("Cập nhật mật khẩu thất bại", dataSignUp.message, "error");
     
    }
  };
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
          <Input value={currentUser?.name || ''} readOnly />
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Icon name="mail" />
        <List.Content>
          <List.Header>Email</List.Header>
          <Input value={currentUser?.email || ''} readOnly />
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Icon name="phone" />
        <List.Content>
          <List.Header>Phone</List.Header>
          <Input value={currentUser?.phone || ''} readOnly />
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Icon name="home" />
        <List.Content>
          <List.Header>Address</List.Header>
          <Input value={currentUser?.address || 'No address!'} readOnly />
        </List.Content>
      </List.Item>
    </List>
    <Divider />
    <Form>
      <Form.Field>
        <label>Change Password</label>
        <Input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Field>
      <Button primary onClick={handlePasswordChange}>
        Update Password
      </Button>
    </Form>
  </div>
  );
};

export default ProfilePage;
