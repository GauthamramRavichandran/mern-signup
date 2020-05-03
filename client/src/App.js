import React, {Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
//import 'materialize-css/dist/css/materialize.min.css';

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render(){
    return (
      

      <Provider store={store}>
          <Router>
            <head>
              <link type="text/html" rel="stylesheet" href="materialize.min.css"  media="screen,projection"/>
              
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <div className="App">
              
                  <Navbar />                      
                  <Switch>
                       <Route exact path="/" component={Landing} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                  </Switch>
                  <Switch>
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  </Switch>
                
            </div>
            <body>
              <script type="text/javascript" src="materialize.min.js"></script>
            </body>
          </Router>
        </Provider>
        
    );
  }
}

export default App;
