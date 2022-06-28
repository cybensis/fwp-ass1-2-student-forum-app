import React, { useContext } from "react";
import AlertContext from "../contexts/alertContext.js";
import "../css/alert.css";

//Vibe Check logo created on https://www.freelogodesign.org/
function Header() {
    //   const { colour } = useContext(AlertContext);
    const { alertMessage } = useContext(AlertContext);
    const { setAlert } = useContext(AlertContext);

    return (
        <div className="alertContainer">
            {alertMessage &&
            <div className="alertBody">
                <p className="closeBtn" onClick={() => {setAlert(null)}}>&times;</p>
                <p className="alertMessage"><b>Alert! </b>{alertMessage}</p>
            </div>
            }
        </div>
    )
}

export default Header;