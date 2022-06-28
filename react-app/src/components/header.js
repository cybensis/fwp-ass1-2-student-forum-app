import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../contexts/userContext.js";
import '../css/header.css';
import logo from '../assets/logo.png';
//Vibe Check logo created on https://www.freelogodesign.org/
function Header() {
  const { currentUser } = useContext(UserContext);
  const { logoutUser } = useContext(UserContext);

  return (
    <div className='header'>
      <img className='logo' src={logo} alt='Website logo' />
      <div className='navigation'>
        <div className='navContents'>
          <div className='homeNav'>
            <div className='homeNav'>
              <Link to="/">Home</Link>
            </div>
          </div>
          {currentUser.userId != null ?
            <>
              <div className='forumNav'>
                <Link to="/forum">Forum</Link>
              </div>
              <div className='myAccountNav'>
                <Link to="/profile">My Account</Link>
              </div>
              <div className='logoutNav'>
                <Link to="/login" onClick={logoutUser}>Logout</Link>
              </div>
            </>
            :
            <>
              <div className='loginNav'>
                <Link to="/login">Login</Link>
              </div>
              <div className='registerNav'>
                <Link to="/register">Register</Link>
              </div>
            </>
          }
        </div>
      </div>

    </div>

  )
}

export default Header;