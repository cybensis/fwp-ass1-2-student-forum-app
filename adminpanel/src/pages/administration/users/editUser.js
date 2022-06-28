import AlertContext from "../../../contexts/alertContext";
import '../../../css/administration/users/editUser.css';
import { useState } from "react";
import { getUsers, defaultIcon, checkErrors, sleep, updateAccount } from '../../../data/dao.js'
import { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useEffect } from "react";


function EditUser() {
    const { setAlert } = useContext(AlertContext);
    let history = useHistory();
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState();
    const [response, setResponse] = useState("");


    useEffect(async () => {
        const user = await getUsers("userId", userId);
        user[0].password = "";
        setUserDetails(user[0]);
    }, [])

    async function handleSubmit(event) {
        event.preventDefault();
        document.querySelector('.btn-primary').disabled = true;
        // Only the attributes in temp need to be checked for errors, no need to send everything.
        let temp = { firstName: userDetails.firstName, lastName: userDetails.lastName, username: userDetails.username, email: userDetails.email, password: userDetails.password };
        const errorResponse = checkErrors(temp);
        if (errorResponse) {
            setResponse(errorResponse)
            document.querySelector('.btn-primary').disabled = false;
            return;
        }
        else {
            // Create a new details object that doesn't contain userIcon and isBlocked
            const updateDetails = {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                username: userDetails.username,
                password: userDetails.password,
                userId: userDetails.userId
            }
            const updateResponse = await updateAccount(updateDetails);
            // Update response will return "" if the update succeeded, otherwise it returns an error message.
            if (updateResponse != "") {
                document.querySelector('.response').style.color = "rgb(177, 10, 10)";
                document.querySelector('.btn-primary').disabled = false;
                setResponse(updateResponse);
            }
            else {
                submitRedirect();
            }
        }
    }

    // This function shows that the users submission's succeeded and they're then redirected to the admin dashboard page after 2 seconds.
    function submitRedirect() {
        document.querySelector('.response').style.color = "rgb(0, 168, 14)";
        setResponse('This account has been updated, now redirecting');
        sleep(2000).then(() => {
            setResponse('');
            history.push('/adminDashboard/');
            window.location.reload();
        })
    }


    async function fieldChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        let temp = {};
        // This creates a completely new object, otherwise assigning temp = userDetails would just be a reference and the changes wouldn't save
        Object.assign(temp, userDetails);
        temp[fieldName] = fieldValue;
        await setUserDetails(temp);
    }

    return (
        <div className='editUser'>
            <h1>Modify User Details</h1>
            {(userDetails != undefined &&
                <form className='detailsForm' onSubmit={handleSubmit}>
                    <div className='userIcon'>
                        <img alt='User icon' className='iconImage' src={!userDetails.userIcon ? defaultIcon() : userDetails.userIcon} />
                    </div>
                    <div className='inputFields'>
                        <div className="form-group email">
                            <p>Email</p>
                            <input type="email" className="form-control" name="email" onChange={fieldChange} value={userDetails.email} />
                        </div>
                        <div className="form-group firstName">
                            <p>First Name</p>
                            <input type="text" className="form-control" name="firstName" onChange={fieldChange} value={userDetails.firstName} />
                        </div>
                        <div className="form-group lastName">
                            <p>Last Name</p>
                            <input type="text" className="form-control" name="lastName" onChange={fieldChange} value={userDetails.lastName} />
                        </div>
                        <div className="form-group username">
                            <p>Username</p>
                            <input type="text" className="form-control" name="username" onChange={fieldChange} value={userDetails.username} />
                        </div>
                        <div className="form-group password">
                            <p>Password</p>
                            <input type="password" className="form-control" name="password" onChange={fieldChange} />
                        </div>
                        <p className='response'>{response}</p>
                    </div>
                    <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Change details</button>
                </form>
            )}
        </div>
    )
}

export default EditUser;