import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import Signout from '../Authentications/Signout';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import FaceIcon from '@material-ui/icons/FaceTwoTone';
import Typography from '@material-ui/core/Typography';

const Header = ({ classes }) => {
  const currentUser = useContext(UserContext);

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        {/* Auth User Info */}
        {
          <Link to={`/`} className={classes.grow}>
            <FaceIcon className={classes.faceIcon} />
            <Typography variant="subtitle2" className={classes.username} noWrap>
              {currentUser.username}
            </Typography>
          </Link>
        }

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

export default withStyles(styles)(Header);
