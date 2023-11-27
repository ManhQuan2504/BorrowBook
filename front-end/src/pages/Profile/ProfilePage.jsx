import React,{useState} from 'react';
import { Image, List, Input, Form,Button, Divider} from 'semantic-ui-react';
import logoUser from '../../assets/images/logo-user.jpg'; // Đảm bảo import đúng đường dẫn của hình ảnh
import './style.scss';
import { useSelector  } from 'react-redux';
import * as UserService from '../../services/UserService';
import { Notification } from "../../components/Notification/Notification";
import languageDataEn from "../../translations/en.json";
import languageDataVi from "../../translations/vi.json";
import { LANGUAGES } from "../../contants/path";

const ProfilePage = () => {
  const language = useSelector((state) => state.borrowBookReducer.language);

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
     
    </div>
    <Divider />
    <List>
      <List.Item>
        <List.Icon name="user" />
        <List.Content>
          <List.Header> {language === LANGUAGES.VI
            ? languageDataVi.content.profile.fullName
            : languageDataEn.content.profile.fullName}</List.Header>
          <Input value={currentUser?.name || ''} readOnly />
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Icon name="mail" />
        <List.Content>
          <List.Header>{language === LANGUAGES.VI
            ? languageDataVi.content.profile.email
            : languageDataEn.content.profile.email}</List.Header>
          <Input value={currentUser?.email || ''} readOnly />
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Icon name="phone" />
        <List.Content>
          <List.Header>{language === LANGUAGES.VI
            ? languageDataVi.content.profile.phone
            : languageDataEn.content.profile.phone}</List.Header>
          <Input value={currentUser?.phone || ''} readOnly />
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Icon name="home" />
        <List.Content>
          <List.Header>{language === LANGUAGES.VI
            ? languageDataVi.content.profile.address
            : languageDataEn.content.profile.address}</List.Header>
          <Input value={currentUser?.address || language === LANGUAGES.VI
            ? languageDataVi.content.profile.noAddress
            : languageDataEn.content.profile.noAddress} readOnly />
        </List.Content>
      </List.Item>
    </List>
    <Divider />
    <Form>
      <Form.Field>
        <label>{language === LANGUAGES.VI
            ? languageDataVi.content.profile.changePassword
            : languageDataEn.content.profile.changePassword}</label>
        <Input
          type="password"
          placeholder={language === LANGUAGES.VI
            ? languageDataVi.content.profile.newPassword
            : languageDataEn.content.profile.newPassword}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <Input
          type="password"
          placeholder= {language === LANGUAGES.VI
            ? languageDataVi.content.profile.confirmPassword
            : languageDataEn.content.profile.confirmPassword}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </Form.Field>
      <Button primary onClick={handlePasswordChange}>
      {language === LANGUAGES.VI
            ? languageDataVi.content.profile.updatePassword
            : languageDataEn.content.profile.updatePassword}
      </Button>
    </Form>
  </div>
  );
};

export default ProfilePage;
