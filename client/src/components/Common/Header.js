import React from 'react';
import { Link } from 'react-router-dom';
import Signout from '../Authentications/Signout';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import UploadIcon from '@material-ui/icons/CloudUploadTwoTone';
import FaceIcon from '@material-ui/icons/FaceTwoTone';
import Typography from '@material-ui/core/Typography';

const NavBar = ({ currentUser, classes }) => {
  return (
    // <Navbar bg="dark" variant="dark">
    //   <Navbar.Brand>
    //     {currentUser && (
    //       <Link to={`/profile/${currentUser.id}`}>{currentUser.username}</Link>
    //     )}
    //     <Signout />
    //   </Navbar.Brand>
    // </Navbar>
    <AppBar position='static' className={classes.root}>
      <Toolbar>
        {/* Title / Logo */}
        <Link to='/' className={classes.grow}>
          <UploadIcon className={classes.logo} color='secondary' />
          <Typography variant='headline' color='secondary' noWrap>
            Upload
          </Typography>
        </Link>

        {/* Auth User Info */}
        {currentUser && (
          <Link to={`/`} className={classes.grow}>
            <FaceIcon className={classes.faceIcon} />
            <Typography variant='headline' className={classes.username} noWrap>
              {currentUser.username}
            </Typography>
          </Link>
        )}

        {/* Signout Button */}
        <Signout />
      </Toolbar>
    </AppBar>
  );
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 0,
    padding: 0
  },
  grow: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  },
  logo: {
    marginRight: theme.spacing(),
    fontSize: 45
  },
  faceIcon: {
    marginRight: theme.spacing(),
    fontSize: 30,
    color: 'white'
  },
  username: {
    color: 'white',
    fontSize: 30
  }
});

export default withStyles(styles)(NavBar);
