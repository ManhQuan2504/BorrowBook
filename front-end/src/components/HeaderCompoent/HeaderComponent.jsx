
import React, { useState, useEffect } from "react";
import { Header, Image } from "semantic-ui-react";
import { Menu, Segment, Dropdown } from "semantic-ui-react";
import "./style.scss";
import { useDispatch, useSelector } from 'react-redux';
import { decodeToken } from "react-jwt";


import bookImage from "../../assets/images/ngonha.png";
import { Link, useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { detailUser } from "../../redux/orebiSlice";
import { resetUser } from '../../redux/slides/userSlide'

import { PATHS } from "../../contants/path";

const HeaderComponent = () => {
  const [activeItem, setActiveItem] = useState("home");

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [{ data: currentUser } = {}] = useSelector((state) => state.orebiReducer.userInfo);


  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };

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
    // data.value contains the selected option value
    if (data.value === 1) {
      // Thông tin cá nhân
      navigate(PATHS.PROFILE); // Navigate to the "/profile" route
    } else if (data.value === 2) {
      // Đăng xuất
      handleLogOut();
      // alert("Đăng xuất");
      // Add your logout logic here, such as clearing user session, etc.
    }
  };

  return (
    <div>
      <Segment className="headerComponent_container" inverted color="blue">
        <Menu className="Menu-border" inverted pointing secondary>
          <Menu.Item
            name="home"
            active={activeItem === "home"}

          >
            <Link onClick={() => handleItemClick("home")} to={PATHS.HOME}>LOGO</Link>
          </Menu.Item>
          <Menu.Item
            name="User Management"
            active={activeItem === "user"}

          >
            <Link onClick={() => handleItemClick("user")} to={PATHS.USER}>User Management</Link>
          </Menu.Item>
          <Menu.Item
            name="Book Management"
            active={activeItem === "book"}

          >
            <Link onClick={() => handleItemClick("book")} to={PATHS.BOOK}>Book Management</Link>
          </Menu.Item>
          <Menu.Item
            name="Book Borrow Management"
            active={activeItem === "borrow"}

          >
            {" "}
            <Link onClick={() => handleItemClick("borrow")} to={PATHS.BORROW}>Book Borrow Management</Link>
          </Menu.Item>

          {/* Add right-aligned items */}
          <Menu.Menu position="right">
            <Menu.Item className="MenuItemImage">
              <Image className="imageAvatar" src={bookImage} avatar />
            </Menu.Item>
            <Menu.Item>
              <Dropdown text={currentUser?.name || 'user'}>

                <Dropdown.Menu>
                  <Dropdown.Item text='Thông tin cá nhân' active={activeItem === ""} value={1} onClick={handleCombinedClick} />
                  <Dropdown.Item text='Đăng xuất' value={2} onClick={handleDropdownItemClick} />
                </Dropdown.Menu>


              </Dropdown>
              {/* // className="DropdownName"
                // text="hoangdqh"
                // options={options}
                // simple
                // onChange={handleDropdownItemClick} */}


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
