import user from '../assets/user.png';
import axios from "axios";
const CURRENT_USER_KEY = 'user';
const API_HOST = "http://10.0.0.7:4000"


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     LOGIN PAGE      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
// This is used to check if the credentials supplied by the user from the login.js page are correct.
async function attemptLogin(credentials) {
    try {
        return axios.post(API_HOST + "/api/users/login/", credentials)
    }
    catch (e) {
        console.log(e);
    }
}
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     REGSITER & EDIT PROFILE PAGE      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
// Adds a new user to localstorage
async function addUser(userDetails) {
    try {
        const response = await axios.post(API_HOST + "/api/users", userDetails);
        delete response.data.passwordHash;
        return response.data;
    }
    catch (e) {
        console.log(e.message)
        return "An unexpected error occurred"
    }
}
//
//
async function checkExistingDetails(newDetails, oldDetails) {
    if (newDetails.username !== oldDetails.username) {
        const checkUsername = await axios.get(API_HOST + "/api/users/username/" + newDetails.username);
        if (checkUsername.data) return "This username is already in use";
    }
    if (newDetails.email !== oldDetails.email) {
        const checkEmail = await axios.get(API_HOST + "/api/users/email/" + newDetails.email);
        if (checkEmail.data) return "This email is already in use";
    }
    return false;
}
//
//Function to check the fields for errors.
function checkErrors(userData, isRegistering) {
    // Email regex taken from http://emailregex.com/
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Originally had a forEach loop on the Object.keys(), but since return doesn't work properly inside a forEach loop, I 
    // changed it out to a for loop.
    const objectKeys = Object.keys(userData);
    const fieldNames = { email: "email address", firstName: "first name", lastName: "last name", username: "username", password: "password" }
    for (let i = 0; i < objectKeys.length; i++) {
        // Since password can be empty if you're updating profile, I ignore the empty field just for passwords.
        if (userData[objectKeys[i]].length <= 0 && objectKeys[i] !== "password") return 'Please enter your ' + fieldNames[objectKeys[i]];
        if (userData[objectKeys[i]].indexOf(' ') >= 0) return 'Please remove whitespaces from ' + fieldNames[objectKeys[i]];
    }

    if (!emailRegex.test(userData.email)) return 'Please check your email format';
    // console.log(userData.password)
    if (!isRegistering && userData.password == "") {
        return false;
    }
    else {
        const passwordError = checkPassword(userData.password);
        return (passwordError === '') ? false : passwordError;
    }
}
//
// I chose to do individual testing for each password requirement and provide specific error messages instead of using a 
// RegEx and providing one big error message.
function checkPassword(password) {
    if (password.length < 6) return 'Your password must be a minimum 6 characters long';
    if (!/^(?=.*[a-z])(?=.*[A-Z])/.test(password)) return 'Your password must contain both upper and lowercase characters';
    if (!/[!@#$*&^]/.test(password)) return 'Your password must contain at least 1 character from !@#$*&^';
    if (!/\d/.test(password)) return 'Your password must contain at least 1 number';
    return '';
}
//
// This function takes data from the editProfile.js page, then updates the corresponding users details.
async function updateUser(newData, originalData) {
    const response = await axios.put(API_HOST + "/api/users/" + originalData.userId, {
        newData: newData,
        originalData: {
            email: originalData.email,
            username: originalData.username
        }
    });
    if (response.data !== "Success") {
        return response.data;
    }
    else {
        delete newData.password;
        const localStorageData = Object.assign(originalData, newData);
        setLocalStorage(localStorageData)
        return "";
    }
}
//
// I used this site to help with using cloudinary to upload images: 
// https://medium.com/geekculture/how-to-upload-images-to-cloudinary-with-a-react-app-f0dcc357999c
async function uploadImage(imageFile) {
    // data holds the corresponding info needed to upload the image to cloudinary.
    return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append("file", imageFile)
        data.append("upload_preset", "webProg")
        data.append("cloud_name", "duuatzwjw")
        fetch("https:///api.cloudinary.com/v1_1/duuatzwjw/image/upload", {
            method: "post",
            body: data
        })
            .then(response => response.json())
            .then(data => { resolve(data.url) })
            .catch(err => reject(false))
    })
}
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     PROFILE PAGE     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//
// This takes an email as an argument, finds the corresponding account and deletes the user, all their posts and their replies.
async function deleteUser(userId) { return axios.delete(API_HOST + "/api/users/" + userId); }
//
async function getFollowings(currentUser) { return axios.get(API_HOST + "/api/users/following/" + currentUser) }
async function followUser(currentUser, isFollowing) { return axios.post(API_HOST + "/api/users/follow/" + isFollowing, { currentUser: currentUser }) }
async function unfollowUser(currentUser, isFollowing) { return axios.post(API_HOST + "/api/users/unfollow/" + isFollowing, { currentUser: currentUser }) }
//
//
async function getUserDetails(selectedUser, currentUser) {
    try {
        const userDetails = await axios.post(API_HOST + "/api/users/user/" + selectedUser, { currentUser: currentUser });
        return userDetails;
    }
    catch (e) {
        console.log(e)
    }
}
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     VIEW FORUM POSTS        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
//
async function addPostRating(postId, currentUser, isLike) { return axios.post(API_HOST + "/api/posts/addPostRating/" + postId, { currentUser: currentUser, isLike: isLike }); }
//
async function addReplyRating(replyId, currentUser, isLike) { return axios.post(API_HOST + "/api/posts/addReplyRating/" + replyId, { currentUser: currentUser, isLike: isLike }); }
//
async function deletePostRating(postId, currentUser) { return axios.post(API_HOST + "/api/posts/deletePostRating/" + postId, { currentUser: currentUser }); }
//
async function deleteReplyRating(replyId, currentUser) { return axios.post(API_HOST + "/api/posts/deleteReplyRating/" + replyId, { currentUser: currentUser }); }

// Used to delete a post
async function deletePost(postId) { return axios.delete(API_HOST + "/api/posts/" + postId); }
//
//
async function addReply(replyData) { return axios.post(API_HOST + "/api/posts/reply", replyData); }
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     CREATE/EDIT FORUM POSTS        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
//
async function addPost(postData) { return axios.post(API_HOST + "/api/posts/create", postData); }
//
// Used to update an already existing post, like when a user replies to a post or when a post owner edits a post.
async function updatePost(postData, postId) { return axios.post(API_HOST + "/api/posts/update/" + postId, postData) }
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     SHARED FORUM FUNCTIONS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
// This function takes a post hash as an argument, then searches all posts for a post that has a matching hash, and 
// returns the post data.
async function getPost(postId, currentUser) { return axios.post(API_HOST + "/api/posts/post/" + postId, { currentUser: currentUser }); }
//
// Function to return all posts with a fresh ID for easy array index access.
async function getPage(pageNumber) { return axios.get(API_HOST + "/api/posts/page/" + pageNumber); }
//
//
async function getPostCount() { return axios.get(API_HOST + "/api/posts/count"); }
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     OTHER     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
//
function defaultIcon() { return user; }
//
// Upon successful login, this sets the log in email as the current user 
function setLocalStorage(userData) { localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData)) }
//
// This returns the current users email
function getCurrentUser() {
    if (localStorage.getItem(CURRENT_USER_KEY) === null || localStorage.getItem(CURRENT_USER_KEY) === "") {
        return false;
    }
    const userDetails = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    return userDetails;
}
//
//Function to sleep for X amount of milliseconds
function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)) }








export {
    addUser,
    setLocalStorage,
    getCurrentUser,
    attemptLogin,
    checkErrors,
    updateUser,
    sleep,
    deleteUser,
    addPost,
    getPage,
    getPost,
    updatePost,
    deletePost,
    checkPassword,
    defaultIcon,
    getUserDetails,
    uploadImage,
    checkExistingDetails,
    addReply,
    getPostCount,
    followUser,
    unfollowUser,
    getFollowings,
    addPostRating,
    addReplyRating,
    deletePostRating,
    deleteReplyRating
    // disaddRating
};