import React, { useState } from 'react';
import { Segment, Menu } from 'semantic-ui-react';
import './Header.scss';

function Header({ setActiveItem }) {
  const [localActiveItem, setActiveItemLocal] = useState('Management Books');

  const handleItemClick = (e, { name }) => {
    setActiveItemLocal(name);
    setActiveItem(name);
  };

  return (
    <>
      <Segment inverted color='blue' className='custom-header-segment'>
        <Menu inverted pointing secondary>
          <Menu.Item
            name='LOGO'
          />
          <Menu.Item
            name='Management Books'
            active={localActiveItem === 'TableBooks'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='Management BorrowBook'
            active={localActiveItem === 'TableBorrow'}
            onClick={handleItemClick}
          />
          <Menu.Item
            name='Management User'
            active={localActiveItem === 'TableUser'}
            onClick={handleItemClick}
          />
        </Menu>
      </Segment>
    </>
  );
}

export default Header;
