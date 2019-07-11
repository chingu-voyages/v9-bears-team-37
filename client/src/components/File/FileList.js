import React, { useContext, useState } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import UpdateFile from './UpdateFile';
import DeleteFile from './DeleteFile';
import { FILE_TOKEN_ENDPOINT } from '../../config';
import { sendEmail } from '../../helpers';
import ShowError from '../Common/ShowError';
import Loading from '../Common/Loading';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

import { UserContext } from '../../App';

const FileList = ({ dlfiles, classes }) => {
  const [tokenSent, setTokenSent] = useState(false);

  const currentUser = useContext(UserContext);
  //console.log(currentUser.id);
  let userFiles = dlfiles.filter(
    dlfile => currentUser.id === dlfile.postedBy.id
  );
  console.log(userFiles);
  // const id = match.params.id;
  //console.log(id);
  console.log(window);

  const handleSendToken = ({ fileName, fileDescription, fileToken }) => {
    const payload = {
      userName: currentUser.username,
      email: currentUser.email,
      fileName,
      fileDescription,
      fileToken
    };
    sendEmail(FILE_TOKEN_ENDPOINT, payload)
      .then(() => {
        setTokenSent(true);
      })
      .catch(error => console.log(error));
  };

  // return (
  //   <Query query={PROFILE_QYERY} variables={{ id }}>
  //     {({ data, loading, error }) => {
  //       if (loading) return <Loading />;
  //       if (error) return <ShowError />;
  //       console.log({ data });
  return (
    <List>
      {userFiles.map(dlfile => (
        <ExpansionPanel key={dlfile.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <ListItem className={classes.root}>
              <ListItemText
                primaryTypographyProps={{
                  variant: 'inherit',
                  color: 'primary'
                }}
                primary={dlfile.name}
              />
            </ListItem>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Typography variant='body1'>{dlfile.description}</Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            <Button
              variant={tokenSent ? 'contained' : 'outlined'}
              onClick={() =>
                handleSendToken({
                  fileName: dlfile.name,
                  fileDescription: dlfile.description,
                  fileToken: dlfile.fileToken
                })
              }
              disabled={tokenSent}
            >
              {tokenSent ? 'Token Sent' : 'Send Token'}
            </Button>
            <UpdateFile dlfile={dlfile} />
            <DeleteFile dlfile={dlfile} />
          </ExpansionPanelActions>
        </ExpansionPanel>
      ))}
    </List>
  );
};
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  details: {
    alignItems: 'center'
  },
  link: {
    color: '#424242',
    textDecoration: 'none',
    '&:hover': {
      color: 'black'
    }
  }
};

const PROFILE_QYERY = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
      dateJoined
      dlfileSet {
        id
        name
        description
        url
        fileToken
      }
    }
  }
`;

export default withStyles(styles)(FileList);
