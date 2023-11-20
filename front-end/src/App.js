import React, { Fragment } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
function App() {

  return (
    <div style={{height: '100vh', width: '100%'}}>
     
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              // const isCheckAuth =  !route.isPrivated || user.isAdmin; // Kiểm tra route có yêu cầu là admin và người dùng có quyền admin hay không
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              
              return (
                <Route key={route.path} path={route.path} element={
                 
                  // isCheckAuth ? (
                    <Layout>
                      <Page />
                    </Layout>
                  // ) : (
                   
                  //   <Layout>
                  //     <NotFoundPage />
                  //   </Layout>
                  // )
                } />
              );
            })}
          </Routes>
        </Router>
     
    </div>
  );
}

export default App;
