//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     CONSTANTS & IMPORTS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
import { request, gql } from "graphql-request";
import userIcon from "../assets/user.png"
const GRAPH_QL_URL = "http://10.0.0.7:5000/graphql";
//
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     PROFILE FUNCTIONS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
async function deleteAccount(userId) {
  const query = gql`
    mutation ($userId: Int) {
      deleteAccount(userId: $userId)
    }
  `;

  const variables = { userId };
  const data = await request(GRAPH_QL_URL, query, variables);
  return data.deleteAccount;
}
//
// getUsers searches for all users matching the searchData argument. I needed to create big queries for username, email and userId but 
// there is probably a way to make it shorter.
async function getUsers(searchType, searchData) {
  let variables;
  let query;
  if (searchType == "userId") {
    try {
      variables = { userId: parseInt(searchData) };
      searchType = "userById";
      query = gql`
            query ($userId: Int) {
                userById(userId: $userId) {
                    email,
                    firstName,
                    lastName,
                    username,
                    userId,
                    userIcon,
                    isBlocked
                }
            }
            `;
    }
    catch (e) {
      console.log(e);
    }
  }
  else if (searchType == "email") {
    variables = { email: searchData };
    searchType = "userByEmail";
    query = gql`
        query ($email: String) {
          userByEmail(email: $email) {
            email,
            firstName,
            lastName,
            username,
            userId,
            userIcon,
            isBlocked
          }
        }
        `;
  }
  else if (searchType == "username") {
    variables = { username: searchData };
    searchType = "userByUsername";
    query = gql`
        query ($username: String) {
          userByUsername(username: $username) {
            email,
            firstName,
            lastName,
            username,
            userId,
            userIcon,
            isBlocked
          }
        }
        `;
  }
  const data = await request(GRAPH_QL_URL, query, variables);
  return data[searchType];
}
//
//
async function updateBlockStatus(userId, isBlocked) {
  const query = gql`
        mutation ($userId: Int, $isBlocked: Boolean) {
          updateBlockStatus( isBlocked: $isBlocked, userId: $userId) 
        }
      `;

  const variables = { userId, isBlocked };
  const data = await request(GRAPH_QL_URL, query, variables);

  return data.update_owner;
}
//
//
async function updateAccount(userDetails) {
  // First check if the email or username exists with a count, if it returns anything > 0 trh 
  const checkEmailQuery = gql`query ($email: String, $userId: Int) { checkExistingEmail(email: $email, userId: $userId) } `;
  const checkEmailData = await request(GRAPH_QL_URL, checkEmailQuery, { email: userDetails.email, userId: parseInt(userDetails.userId) });
  if (checkEmailData.checkExistingEmail) {
    return "This email is already in used"
  }
  const checkUsernameQuery = gql`query ($username: String, $userId: Int) { checkExistingUsername(username: $username, userId: $userId)} `;
  const checkUsernameData = await request(GRAPH_QL_URL, checkUsernameQuery, { username: userDetails.username, userId: parseInt(userDetails.userId) });
  if (checkUsernameData.checkExistingUsername) {
    return "This username is already in used"
  }

  const updateStatement = gql`
      mutation ($firstName: String, $lastName: String, $email: String, $username: String, $password: String, $userId: Int) {
        updateAccount(accountData: {
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          username: $username,
          password: $password,
          userId: $userId
        })
      }
      `;

  const data = await request(GRAPH_QL_URL, updateStatement, userDetails);
  return "";
}
//
//
//    
//Function to check the fields for errors.
function checkErrors(userData) {
  // Email regex taken from http://emailregex.com/
  const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  // Originally had a forEach loop on the Object.keys(), but since return doesn't work properly inside a forEach loop, I 
  // changed it out to a for loop.
  const objectKeys = Object.keys(userData);
  const fieldNames = { email: "email address", firstName: "first name", lastName: "last name", username: "username", password: "password" }
  for (let i = 0; i < objectKeys.length; i++) {
    // Since password can be empty if you're updating profile, I ignore the empty field just for passwords.
    if (userData[objectKeys[i]].length <= 0 && objectKeys[i] !== "password") return 'Please enter a ' + fieldNames[objectKeys[i]];
    if (userData[objectKeys[i]].indexOf(' ') >= 0) return 'Please remove whitespaces from ' + fieldNames[objectKeys[i]];
  }

  if (!emailRegex.test(userData.email)) return 'Please check the email format';
  if (userData.password == "") {
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
  if (password.length < 6) return 'The password must be a minimum 6 characters long';
  if (!/^(?=.*[a-z])(?=.*[A-Z])/.test(password)) return 'The password must contain both upper and lowercase characters';
  if (!/[!@#$*&^]/.test(password)) return 'The password must contain at least 1 character from !@#$*&^';
  if (!/\d/.test(password)) return 'The password must contain at least 1 number';
  return '';
}
//
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     PROFILE FUNCTIONS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
//
async function searchPosts(searchType, searchData) {
  let variables, query;
  if (searchType == "postId") {
    try {
      variables = { postId: parseInt(searchData) };
      searchType = "postById";
      query = gql`
      query ($postId: Int) {
        postById(postId: $postId) {
            postId,
            postTitle,
            postBody,
            postImage,
            postDate,
            userId,
            user {
              username
            }
        }
    }
    `;
    }
    catch (e) {
      console.log(e);
    }
  }
  else if (searchType == "postDate") {
    variables = { postDate: searchData.toString() };
    searchType = "postsByDate";
    query = gql`
          query ($postDate: String) {
              postsByDate(postDate: $postDate) {
                  postId,
                  postTitle,
                  postBody,
                  postImage,
                  postDate,
                  userId,
                  user {
                    username 
                  }
              }
          }
          `;
  }
  const data = await request(GRAPH_QL_URL, query, variables);
  return data[searchType];
}
//
//
//
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     PROFILE FUNCTIONS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
//
async function deletePost(postId) {
  const query = gql`
    mutation ($postId: Int) {
      deletePost(postId: $postId)
    }
  `;

  const variables = { postId };
  const data = await request(GRAPH_QL_URL, query, variables);
  return data.deletePost;
}




//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     OTHER FUNCTIONS      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~// 
//
function defaultIcon() { return userIcon; }
// 
//Function to sleep for X amount of milliseconds
function sleep(milliseconds) { return new Promise(resolve => setTimeout(resolve, milliseconds)) }
//
export {
  deleteAccount, getUsers, updateAccount, updateBlockStatus, defaultIcon, checkErrors, sleep, searchPosts, deletePost
}
