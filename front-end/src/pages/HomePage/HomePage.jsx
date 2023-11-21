import React from 'react'
import book2 from '../../assets/images/book3.jpg'
import {Image} from 'semantic-ui-react'
import './style.scss'
const HomePage = () => {
  return (
    <div className='HomePage'>
     {/* <Image  src={book2} size='massive'/> */}
     <img className='imgBook3' src={book2} alt="" />
    </div>
  )
}

export default HomePage
