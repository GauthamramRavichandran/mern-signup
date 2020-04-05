import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-4">
          <div className="nav-wrapper white">
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="col s4 brand-logo center black-text"
              >
              <i className="material-icons">code</i>
              MERN
            </Link>
            {this.props.auth.isAuthenticated === true ?
              <button
                style={{
                  float:"right",
                  width: "10%",
                  borderRadius: ".1rem",
                  fontSize: "110%",
                  marginRight:".8rem",
                  marginTop:".8rem"
                }}
                onClick={this.onLogoutClick}
                className="btn btn-small offset-s5 waves-effect waves-light hoverable blue accent-3"
                >
                Logout
              </button>: ''}
          </div>
        </nav>
      </div>
    );
  }
}
Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);