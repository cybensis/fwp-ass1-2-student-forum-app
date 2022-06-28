import React, { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './css/global.css';
import 'bootstrap/dist/css/bootstrap.min.css'

///////// Components
import Header from './components/header.js'
import Footer from './components/footer.js'
import Alert from './components/alert.js'
/////////

///////// Contexts
import AlertContext from './contexts/alertContext.js'
/////////

///////// Web pages
import Index from './pages/index.js'
import AdminDashboard from './pages/administration/adminDashboard.js'
import Users from './pages/administration/users/users.js'
import Posts from './pages/administration/posts/posts.js'
import EditUser from './pages/administration/users/editUser.js'
/////////


function App() {
  const [alertMessage, setAlertMessage] = useState();

  function setAlert(message) {
    setAlertMessage(message);
  }

  return (
    <AlertContext.Provider value={{ alertMessage, setAlert }}>
      <Router>
        <Header />
        <Alert />
        <div className='body'>
          <Switch>
            <Route path="/adminDashboard/users">
              <Users />
            </Route>
            <Route path="/adminDashboard/posts">
              <Posts />
            </Route>
            <Route path="/adminDashboard/editUser/:userId">
              <EditUser />
            </Route>
            <Route path="/adminDashboard">
              <AdminDashboard />
            </Route>
            <Route path="/">
              <Index />
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>
    </AlertContext.Provider>
  )
}

export default App;

