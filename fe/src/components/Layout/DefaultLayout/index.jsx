// DefaultLayout.js
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.scss';

function DefaultLayout({ children }) {
  const [activeItem, setActiveItem] = useState('Management Books');

  return (
    <div className="app-container"> {/* Sử dụng className để áp dụng styles từ CSS */}
      <div className="header">
        <Header setActiveItem={setActiveItem} />
      </div>
      <div className="content">
        {React.cloneElement(children, { activeItem })}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default DefaultLayout;
