import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import UpdateFile from './UpdateFile';
import DeleteFile from './DeleteFile';
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

const FileList = ({ dlfiles, classes }) => {
  // const id = match.params.id;
  //console.log(id);
  console.log(window);

  // return (
  //   <Query query={PROFILE_QYERY} variables={{ id }}>
  //     {({ data, loading, error }) => {
  //       if (loading) return <Loading />;
  //       if (error) return <ShowError />;
  //       console.log({ data });
  return (
    <List>
      {dlfiles.map(dlfile => (
        <ExpansionPanel key={dlfile.id}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <ListItem className={classes.root}>
              <ListItemText
                primaryTypographyProps={{
                  variant: 'subheading',
                  color: 'primary'
                }}
                primary={dlfile.title}
                secondary={
                  <Link
                    className={classes.link}
                    to={`/profile/${dlfile.postedBy.id}`}
                  >
                    {dlfile.postedBy.username}
                  </Link>
                }
              />
            </ListItem>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.details}>
            <Typography variant="body1">{dlfile.description}</Typography>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
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
      }
    }
  }
`;

export default withStyles(styles)(FileList);
