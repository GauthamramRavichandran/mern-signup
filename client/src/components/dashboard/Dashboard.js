import React, { Component } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import M from "materialize-css";

import { logoutUser } from "../../actions/authActions";
import classnames from "classnames";
import Dropzone from 'react-dropzone';
import request from 'superagent';
import "../dashboard/dashboard.css"

const CLOUDINARY_UPLOAD_PRESET = 'mern-social-media';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/deanwinchester/upload';
const DEFAULT_AVATAR = 'https://res.cloudinary.com/deanwinchester/image/upload/v1585934758/mern-social-profile-photos/avatar-default-icon_clyvdc.png'

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      password2: "",
      dob:"",
      errors: {},
      uploadedFileCloudinaryUrl: DEFAULT_AVATAR
    };
   
  }
  componentDidMount(){
    var context = this;
    // initalising datepicker
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelector('.datepicker');
      
      var options = {"autoClose": true,
                    "format": "mmm dd yyyy",
                    "defaultDate": new Date("1998-01-21"),
                    "setdefaultDate": false,
                    "yearRange": [1940,2002],
                    "onSelect": function (date){
                      context.setState({dob : date})
                    }};
      // storing in a var incase if you want to use in future
      var instances = M.Datepicker.init(elems, options);  
    });

    axios.get('/api/users/get/'+ this.props.auth.user.id)
    .then(response => {
        this.setState({
            id: response.data._id,
            name: response.data.name,
            email: response.data.email,
            password: response.data.password,
            password2: response.data.password,
            dob: response.data.dob
            })
        })
    .catch(function(error) {
        console.log(error);
    })

    axios.get('/api/users/profile/'+ this.props.auth.user.id)
    .then(response => {
      this.setState({
        uploadedFileCloudinaryUrl : response.data.secure_url
        })
      })
    .catch(function(error) {
      console.log(error);
      })
}
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  

  handleImageUpload = (file) => {
    axios.post('/api/users/profile/'+ this.state.id)
    .catch(function(error){
      console.log(error);
    })
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file[0])
                     .field('public_id', this.state.id);
    
    upload.end((err, response) => {
      if (err) {
        console.error(err);
        }
      this.setState({ uploadedFileCloudinaryUrl: response.body.secure_url });
      })
    M.toast({html: 'Profile picture updated!', classes: 'toasts-rounded rounded'})
  };

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onClick = e => {
    this.setState({[e.target.id]: "" });
  };
  onSubmit = e => {
    e.preventDefault();
    // FIXME handle DOB even if it's empty
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      dob:this.state.dob instanceof Date ? this.state.dob.toDateString().slice(4) : this.state.dob
    };
    this.setState({dob: this.state.dob instanceof Date ? this.state.dob.toDateString().slice(4) : this.state.dob})

    axios.post("/api/users/update", newUser)
    .then(res =>   M.toast({html: 'Changes saved successfully!', classes: 'toasts-rounded rounded'}))
    .catch(function(err) { console.error(err)})
  }; 

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  
  render() {
    const { user } = this.props.auth;
    const { errors } = this.state;
    return (    
      <div className="container ">
        <div className="row">
          <div className="col s10 center-align offset-s1">
            <p className="flow-text black-text text-darken-1">
              <b>Hey there,</b> {user.name.split(" ")[0]}
              <br/>
            </p>
            <div className="img-container">
              <Dropzone onDrop={this.handleImageUpload} multiple = {false}>
                {({ getRootProps, getInputProps }) => (
                  <div
                  {...getRootProps()}
                  className="hide-me" 
                  >
                    <i className="medium material-icons btn-flat" id ="upload-btn">cloud_upload</i>
                  <input {...getInputProps()} />
                  <div className = "upload-text flow-text">DROP IMAGE HERE</div>
                  </div>
                )}
              </Dropzone>
              <img src={this.state.uploadedFileCloudinaryUrl} className = "profile" alt = "sample"/>
            </div>
            
            <form onSubmit={this.onSubmit}>
              <div className="input-field col s8 center-align offset-s2">
                <input
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  id="name"
                  type="text"
                  className={classnames("", {
                    invalid: errors.name
                  })}
                />
                <label className ="active" htmlFor="name">Name</label>
                <span className="red-text">{errors.name}</span>
              </div>
      
              <div className="input-field col s8 center-align offset-s2">
                <input
                  disabled value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email
                  })}
                />
                <label className ="active" htmlFor="email"><i className="tiny material-icons offset-s2">email</i> Email</label>
                <span className="red-text">{errors.email}</span>
              </div>

              <div className="input-field col s8 center-align offset-s2">
                <input
                  onChange={this.onChange}
                  onClick = {this.onClick}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password
                  })}
                />
                <label className ="active" htmlFor="password">Password</label>
                <span className="red-text">{errors.password}</span>
              </div>
            
              <div className="input-field col s8 center-align offset-s2">
                <input
                  onChange={this.onChange}
                  onClick = {this.onClick}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password2
                  })}
                />
                <label className ="active" htmlFor="password2">Confirm Password</label>
                <span className="red-text">{errors.password2}</span>
              </div>

              <div className="input-field col s8 center-align offset-s2">
                <input
                  id="dob"
                  onChange={this.onChange}
                  value={this.state.dob}
                  error={errors.dob}
                  type="text"
                  className="datepicker"
                /> 
                <label className ="active" htmlFor="dob">DOB</label>
                {this.state.dob === "" ?<span className="red-text">Select your DOB</span> : ''}
              </div>
            
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "13rem",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-medium waves-effect waves-light hoverable blue accent-3 "
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);