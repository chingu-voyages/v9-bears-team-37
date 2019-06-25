import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Signout from '../Authentications/Signout';

const NavBar = ({ currentUser }) => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>
        {currentUser && (
          <Link to={`/profile/${currentUser.id}`}>{currentUser.username}</Link>
        )}
        <Signout />
      </Navbar.Brand>
    </Navbar>
  );
};

export default NavBar;
