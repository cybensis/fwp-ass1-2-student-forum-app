import { Link } from "react-router-dom";
import AlertContext from "../../../contexts/alertContext";
import users from '../../../assets/users.png';
import block from '../../../assets/block.png';
import deleteUser from '../../../assets/delete.png';
import back from '../../../assets/back.png';
import '../../../css/administration/users/users.css';
import { useState } from "react";
import { getUsers, defaultIcon, updateBlockStatus, deleteAccount } from '../../../data/dao.js'
import { useContext } from "react";
import { useHistory } from "react-router-dom";


function Users() {
    const searchTypeDisplay = { email: "Email", username: "Username", userId: "User ID" }
    const { setAlert } = useContext(AlertContext);
    let history = useHistory();
    const [selectedUser, setSelectedUser] = useState();
    const [searchResults, setSearchResults] = useState();
    const [searchType, setSearchType] = useState("email");
    const [searchInput, setSearchInput] = useState();

    // This submission handler is used when the admin user searches for users with email, username or user id
    async function handleSubmit(event) {
        event.preventDefault();
        const users = await getUsers(searchType, searchInput);
        setSearchResults(users);
    }

    async function handleBlockStatusChange() {
        await updateBlockStatus(selectedUser.userId, !selectedUser.isBlocked);
        let newUserData = {};
        Object.assign(newUserData, selectedUser);
        newUserData.isBlocked = !newUserData.isBlocked;
        await setSelectedUser(newUserData);
        const alertMessage = "This users blocked status has now been updated to " + (newUserData.isBlocked ? "blocked" : "unblocked");
        setAlert(alertMessage);
    }

    async function handleDelete(accepted) {
        if (accepted) {
            await deleteAccount(selectedUser.userId);
            setAlert("This users account has successfully been deleted");
            history.push("/adminDashboard/");
        }
        else {
            document.querySelector('.deletePopup').style.display = "none";
        }
    }

    return (
        <div className='users'>
            <h1>User account administration</h1>
            <hr />
            {/* If a user hasn't been selected, then allow for an admin to search for one */}
            {selectedUser == undefined

                ?

                <div className='searchUser'>
                    <h2>Select a user account</h2>
                    <form onSubmit={handleSubmit}>

                        <p>Search by:</p>
                        <select onChange={(event) => {
                            setSearchType(event.target.value);
                            setSearchResults(null);
                        }} className="form-select form-select">
                            <option value="email" >Email</option>
                            <option value="username" >Username</option>
                            <option value="userId">User ID</option>
                        </select>
                        <p>Enter {searchTypeDisplay[searchType]} here:</p>
                        {/* Since email and username are both text, I only need to use this ternary to check if they're searching by userId, if so then set the type to number */}
                        <input type={(searchType == "userId" ? "number" : "text")} class="form-control" placeholder={searchTypeDisplay[searchType] + "..."} onChange={(event) => { setSearchInput(event.target.value) }} />
                        <br />
                        <button type="button" class="btn btn-dark backButton" onClick={() => { history.push("/adminDashboard/") }}>Go Back</button>
                        <button type="submit" class="btn btn-primary">Search</button>
                    </form>
                    {searchResults != null &&
                        <div className="searchResults">
                            <h2>Search results</h2>
                            {searchResults.length > 0
                                ? searchResults.map(user =>
                                    <div className="resultContainer" onClick={() => { setSelectedUser(user) }}>
                                        <img src={(user.userIcon == null) ? defaultIcon() : user.userIcon} />
                                        <p><b>Username: </b>{user.username}</p>
                                        <p><b>Email: </b>{user.email}</p>
                                        <p><b>User ID: </b>{user.userId}</p>
                                    </div>
                                )
                                : <div>
                                    <p>No users were found matching this {searchTypeDisplay[searchType].toLowerCase()}</p>
                                </div>
                            }
                        </div>
                    }
                </div>

                :

                <div className='selectedUser'>
                    <div className="userInfo">
                        <div className='iconContainer'>
                            <img src={(selectedUser.userIcon == null) ? defaultIcon() : selectedUser.userIcon} />
                        </div>
                        <b>Username </b>
                        <p>{selectedUser.username}</p>
                        <b>Email </b>
                        <p>{selectedUser.email}</p>
                        <b>User ID </b>
                        <p>{selectedUser.userId}</p>
                    </div>
                    <hr />
                    <div className="card">
                        <Link to={"/adminDashboard/editUser/" + selectedUser.userId}>
                            <div className="modify">
                                <img src={users}></img>
                                <p>Modify Details</p>
                            </div>
                        </Link>
                    </div>

                    <div className="card" onClick={handleBlockStatusChange}>
                        <div className="block">
                            <img src={block}></img>
                            <p>{(selectedUser.isBlocked) ? "Unblock Account" : "Block Account"}</p>
                        </div>
                    </div>

                    <div className="card" onClick={() => { document.querySelector('.deletePopup').style.display = "block"; }}>
                        <div className="delete">
                            <img src={deleteUser}></img>
                            <p>Delete Account</p>
                        </div>
                    </div>
                    {/* To "go bacK" from the currently selected user screen, to searching for a user, all that needs to be done is to reset these 3 states */}
                    <div className="card" onClick={() => {
                        setSelectedUser(null);
                        setSearchResults(null);
                        setSearchInput(null);
                    }}>
                        <div className="goBack">
                            <img src={back}></img>
                            <p>Go Back</p>
                        </div>
                    </div>
                </div>
            }
            <div className="deletePopup">
                <div className="deleteConfirmation">
                    <h1>Are you sure you want to delete this account?</h1>
                    <button type="submit" className="btn btn-primary cancelButton" onClick={() => { handleDelete(false) }}>Cancel</button>
                    <button type="submit" className="btn btn-primary deleteButton" onClick={() => { handleDelete(true) }} >Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Users;