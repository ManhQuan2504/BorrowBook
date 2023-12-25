
import React, { useState, useEffect } from "react";
import { Image } from "semantic-ui-react";
import { Menu, Segment, Dropdown, Icon } from "semantic-ui-react";
import "./style.scss";
import { useDispatch, useSelector } from 'react-redux';
import { decodeToken } from "react-jwt";

import { LANGUAGES } from "../../contants/path";
import bookImage from "../../assets/images/ngonha.png";
import { Link, useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { detailUser,setLanguage } from "../../redux/borrowBookSlice";
import { PATHS } from "../../contants/path";
import languageDataEn from '../../translations/en.json';
import languageDataVi from '../../translations/vi.json';
// Import font Roboto
import 'typeface-roboto';



const HeaderComponent = () => {
  // const [activeItem, setActiveItem] = useState("tms");
  const [activeItem, setActiveItem] = useState(localStorage.getItem('activeItem') || "tms");

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [{ data: currentUser } = {}] = useSelector((state) => state.borrowBookReducer.userInfo);
  const language = useSelector((state) => state.borrowBookReducer.language);


  const changeLanguage = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
    // Gọi hàm thực hiện các thay đổi cần thiết khi thay đổi ngôn ngữ
  };
  const handleItemClick = (itemName) => {
    localStorage.setItem('activeItem', itemName);
    setActiveItem(itemName);
  };
  useEffect(() => {
    // Retrieve activeItem from localStorage on component mount
    const storedActiveItem = localStorage.getItem('activeItem');
    if (storedActiveItem) {
      setActiveItem(storedActiveItem);
    }
  }, []);
  useEffect(() => {
   
    if (window.location.pathname === '/') {
      setActiveItem('tms');
      localStorage.setItem('activeItem', 'tms');
    } else {
      // Nếu không phải trang chính, thì lấy giá trị từ localStorage
      const storedActiveItem = localStorage.getItem('activeItem');
      if (storedActiveItem) {
        setActiveItem(storedActiveItem);
      }
    }
  }, []);

  useEffect(() => {
    // After login, return user detail
    const fetchDetailUser = async () => {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        const decodedToken = decodeToken(access_token);
        const res = await UserService.detailUserLogin(decodedToken?.id, access_token);
        if (res.code === 200) {
          dispatch(detailUser({
            success: true,
            data: res.data,
          }))
        }
      }
      else {
        dispatch(detailUser({
          success: false,
          data: [],
        }))
      }
    }
    fetchDetailUser()
  }, []);

  const handleLogOut = async () => {
    if (!localStorage.getItem('access_token')) {
      alert('ban chua dang nhap')
    } else {
      const access_token = localStorage.getItem('access_token')
      const res = await UserService.logoutAccount(access_token)

      dispatch(
        detailUser({
          success: false,
          data: [],
        })
      )

      if (res.code === 200) {

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token_at');
        navigate('/sign-in')

      }
    }

  }

  const handleCombinedClick = (e, { value }) => {
    handleDropdownItemClick(e, { value });
    handleItemClick();
  }

  const handleDropdownItemClick = (event, data) => {
    if (data.value === 1) {
      navigate(PATHS.PROFILE);
    } else if (data.value === 2) {
      handleLogOut();
    }
  };
 

  return (
    <div>
      <Segment className="headerComponent_container" inverted color="blue">
        <Menu className="Menu-border" inverted pointing secondary >
          <Menu.Item
            name="tms"
            active={activeItem === "tms"}

          >
            <Link className="LinkTMS" onClick={() => handleItemClick("tms")} to={PATHS.HOME}>TMS</Link>
          </Menu.Item>
          <Menu.Item
          className="menuItem"
            name="User Management"
            active={activeItem === "user"}

          >
            <Link onClick={() => handleItemClick("user")} to={PATHS.USER}>{language === LANGUAGES.VI ? languageDataVi.header.userManagement : languageDataEn.header.userManagement}</Link>
          </Menu.Item>
          <Menu.Item
          className="menuItem"
            name="Book Management"
            active={activeItem === "book"}

          >
            <Link onClick={() => handleItemClick("book")} to={PATHS.BOOK}>{language === LANGUAGES.VI ? languageDataVi.header.bookManagement : languageDataEn.header.bookManagement}</Link>
          </Menu.Item>
          <Menu.Item
          className="menuItem"
            name="Book Borrow Management"
            active={activeItem === "borrow"}

          >
            {" "}
            <Link onClick={() => handleItemClick("borrow")} to={PATHS.BORROW}>{language === LANGUAGES.VI ? languageDataVi.header.bookBorrowManagement : languageDataEn.header.bookBorrowManagement}</Link>
          </Menu.Item>

        
          <Menu.Menu className="right-menu" position="right">
            {/* <Menu.Item className="right-content">
              <div
                className={`language-vi ${language === LANGUAGES.VI ? 'active' : ''}`}
                onClick={() => changeLanguage('vi')}
              >VN</div>
              <div
                className={`language-en ${language === LANGUAGES.EN ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >EN</div>
            </Menu.Item> */}
              <Menu.Item className="right-content">
  <Dropdown text={language === LANGUAGES.VI ? (<><Icon className="iconLanguage" size="large" name="globe" />VI</>) : (<><Icon className="iconLanguage" size="large" name="globe" />EN</>)}>
    <Dropdown.Menu>
    <Dropdown.Item text='Tiếng Việt' onClick={() => changeLanguage('vi')} />
      <Dropdown.Item text='English' onClick={() => changeLanguage('en')} />
    </Dropdown.Menu>
  </Dropdown>
</Menu.Item>
            
            <Menu.Item className="MenuItemImage">
              <Image className="imageAvatar" src={bookImage} avatar />
            </Menu.Item>
            <Menu.Item className="dropdown">
              <Dropdown text={currentUser?.name || 'user'}>
                <Dropdown.Menu>
                  <Dropdown.Item text={language === LANGUAGES.VI ? languageDataVi.header.myProfile : languageDataEn.header.myProfile} active={activeItem === ""} value={1} onClick={handleCombinedClick} />
                  <Dropdown.Item text={language === LANGUAGES.VI ? languageDataVi.header.logOut : languageDataEn.header.logOut} value={2} onClick={handleDropdownItemClick} />
                </Dropdown.Menu>
              </Dropdown>



            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Segment>

      {/* Render content based on activeItem */}
      {/* {renderContent()} */}
    </div>
  );
};

export default HeaderComponent;
