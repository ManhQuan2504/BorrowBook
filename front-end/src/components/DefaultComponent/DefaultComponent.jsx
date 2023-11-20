import React, { useEffect } from 'react'  

import HeaderComponent from '../HeaderCompoent/HeaderComponent'
import { useNavigate } from 'react-router-dom'

const DefaultComponent = ({children}) => {
  const navigate = useNavigate()
 
  const _token = localStorage.getItem('access_token')
  useEffect(() => { 
    if(!!!_token){
      navigate('/sign-in')
    }
  },[_token])
  return (
    <div>
        <HeaderComponent />
        {children}
    </div>
  )
}

export default DefaultComponent