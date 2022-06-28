import AlertContext from "../../../contexts/alertContext";
import deleteIcon from '../../../assets/delete.png';
import back from '../../../assets/back.png';
import '../../../css/administration/posts/posts.css';
import { useState } from "react";
import { searchPosts, updateBlockStatus, deletePost } from '../../../data/dao.js'
import { useContext } from "react";
import { useHistory } from "react-router-dom";


function Users() {
    const searchTypeDisplay = { postDate: "Date", postId: "Post ID" }
    const { setAlert } = useContext(AlertContext);
    let history = useHistory();
    const [selectedPost, setSelectedPost] = useState();
    const [searchResults, setSearchResults] = useState();
    const [searchType, setSearchType] = useState("postDate");
    const [searchInput, setSearchInput] = useState();

    // This submission handler is used when the admin user searches for users with email, username or user id
    async function handleSubmit(event) {
        event.preventDefault();
        const posts = await searchPosts(searchType, searchInput);
        console.log(posts);
        setSearchResults(posts);
    }

    async function handleBlockStatusChange() {
        await updateBlockStatus(selectedPost.userId, !selectedPost.isBlocked);
        let newUserData = {};
        Object.assign(newUserData, selectedPost);
        newUserData.isBlocked = !newUserData.isBlocked;
        await setSelectedPost(newUserData);
        const alertMessage = "This users blocked status has now been updated to " + (newUserData.isBlocked ? "blocked" : "unblocked");
        setAlert(alertMessage);
    }

    async function handleDelete(accepted) {
        if (accepted) {
            console.log(selectedPost);
            await deletePost(selectedPost.postId);
            setAlert("This post has successfully been deleted");
            history.push("/adminDashboard/");
        }
        else {
            document.querySelector('.deletePopup').style.display = "none";
        }
    }

    return (
        <div className='posts'>
            <h1>Post administration</h1>
            <hr />
            {/* If a post hasn't been selected, then allow for an admin to search for one */}
            {selectedPost == undefined

                ?

                <div className='searchPost'>
                    <h2>Select for a post</h2>
                    <form onSubmit={handleSubmit}>

                        <p>Search by:</p>
                        <select onChange={(event) => {
                            setSearchType(event.target.value);
                            setSearchResults(null);
                            setSearchInput("");
                        }} className="form-select form-select">
                            <option value="postDate" >Date</option>
                            <option value="postId">Post ID</option>
                        </select>
                        <p>Enter {searchTypeDisplay[searchType]} here:</p>
                        <input type={(searchType == "postDate" ? "date" : "number")} class="form-control" placeholder={searchTypeDisplay[searchType] + "..."} onChange={(event) => { setSearchInput(event.target.value) }} />
                        <br />
                        <button type="button" class="btn btn-dark backButton" onClick={() => { history.push("/adminDashboard/") }}>Go Back</button>
                        <button type="submit" class="btn btn-primary">Search</button>
                    </form>
                    {searchResults != null &&
                        <div className="searchResults">
                            <h2>Search results</h2>
                            {searchResults.length > 0
                                ? searchResults.map(post =>
                                    <div className="resultContainer" onClick={() => { setSelectedPost(post); console.log(post) }}>
                                        {/* {post.postImage !== null && <img src={post.postImage} /> } */}
                                        <p className="postTitle">{post.postTitle}</p>
                                        <p className="postHeader">Posted by {post.user.username} on {post.postDate}</p>
                                        <p className="postBody"><b></b>{post.postBody}</p>
                                        <p className="containsImage"><b>Contains Image: </b> {post.postImage == null ? "No" : "Yes"}</p>
                                    </div>
                                )
                                : <div>
                                    <p>No posts were found matching this {searchTypeDisplay[searchType].toLowerCase()}</p>
                                </div>
                            }
                        </div>
                    }
                </div>

                :

                <div className='selectedPost'>
                    <div className="postInfo">
                        <p className='postTitle'>{selectedPost.postTitle}</p>
                        <i className='postHeader'>Posted by {selectedPost.user.username} on {selectedPost.postDate}</i>
                        {(selectedPost.postImage) && <div className='attachedImage'><img src={selectedPost.postImage} /></div>}
                        <p className='postBody'>{selectedPost.postBody}</p>
                    </div>
                    <hr />
                    {/* To "go bacK" from the currently selected user screen, to searching for a user, all that needs to be done is to reset these 3 states */}
                    <div className="card" onClick={() => {
                        setSelectedPost(null);
                        setSearchResults(null);
                        setSearchInput(null);
                    }}>
                        <div className="goBack">
                            <img src={back}></img>
                            <p>Go Back</p>
                        </div>
                    </div>
                    <div className="card" onClick={() => { document.querySelector('.deletePopup').style.display = "block"; }}>
                        <div className="delete">
                            <img src={deleteIcon}></img>
                            <p>Delete Post</p>
                        </div>
                    </div>
                </div>
            }
            <div className="deletePopup">
                <div className="deleteConfirmation">
                    <h1>Are you sure you want to delete this post?</h1>
                    <button type="submit" className="btn btn-primary cancelButton" onClick={() => { handleDelete(false) }}>Cancel</button>
                    <button type="submit" className="btn btn-primary deleteButton" onClick={() => { handleDelete(true) }} >Delete</button>
                </div>
            </div>
        </div>
    )
}

export default Users;