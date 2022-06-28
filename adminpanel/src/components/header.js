import React, { useContext } from "react";
import { Link } from "react-router-dom";
import '../css/header.css';
//Vibe Check logo created on https://www.freelogodesign.org/
function Header() {

  return (
    <div className='header'>
      <div className='navigation'>
        <div className='navContents'>
          {/* <div className='homeNav'>
            <Link to="/">Home</Link>
          </div>
          <div className='loginNav'>
            <Link to="/login">Login</Link>
          </div> */}

        </div>
      </div>
    </div>

  )
}

export default Header;