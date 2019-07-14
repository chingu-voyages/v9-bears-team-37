import React, { useState } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { gql } from 'apollo-boost';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import Error from '../Common/ShowError';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';

import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Paper from '@material-ui/core/Paper';

const DashBoard = () => {
  const [email, setEmail] = useState('');
  const [fileToken, setFileToken] = useState('');
  const [fileName, setFileName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e, client) => {
    e.preventDefault();
    try {
      const { data } = await client.query({
        query: GET_DLFILE_QUERY,
        variables: { email, fileToken }
      });
      setEmail('');
      setFileToken('');
      setFileName(data.dlfile.name);
      setUrl(data.dlfile.url);
    } catch (error) {
      setError('Please enter a valid email and a token.');
    }
  };

  return (
    <Paper>
      <AppBar position='static' color='default' style={{ boxShadow: 'none' }}>
        <Toolbar>
          <Typography variant='h6' color='inherit'>
            Created By
          </Typography>
          <Button
            style={{ float: 'right' }}
            color='inherit'
            target='_blank'
            href='https://github.com/picklu'
          >
            Picklu
          </Button>
          <Typography variant='h6' color='inherit'>
            {'&'}
          </Typography>
          <Button
            color='inherit'
            target='_blank'
            href='https://github.com/iNightElf'
          >
            Shahzad
          </Button>
        </Toolbar>
      </AppBar>
      <ApolloConsumer>
        {client => (
          <form onSubmit={e => handleSubmit(e, client)}>
            <DialogTitle>Download File</DialogTitle>
            <DialogContent>
              <DialogContentText>Type your email and token</DialogContentText>
              <FormControl fullWidth>
                <input
                  type='email'
                  name='email'
                  placeholder='Enter Email...'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    display: 'inline-block',
                    boxSizing: 'content-box',
                    padding: '10px 20px',
                    border: '1px solid #b7b7b7',
                    borderRadius: '3px',
                    font: 'normal 16px/normal "Times New Roman", Times, serif',
                    color: 'rgba(0,142,198,1)',
                    textOverflow: 'clip',
                    background: 'rgba(252,252,252,1)',
                    textShadow: '1px 1px 0 rgba(255,255,255,0.66)'
                  }}
                />
              </FormControl>
              <br />
              <br />
              <FormControl fullWidth>
                <input
                  type='text'
                  name='token'
                  placeholder='Enter token...'
                  value={fileToken}
                  onChange={e => setFileToken(e.target.value)}
                  style={{
                    display: 'inline-block',
                    boxSizing: 'content-box',
                    padding: '10px 20px',
                    border: '1px solid #b7b7b7',
                    borderRadius: '3px',
                    font: 'normal 16px/normal "Times New Roman", Times, serif',
                    color: 'rgba(0,142,198,1)',
                    textOverflow: 'clip',
                    background: 'rgba(252,252,252,1)',
                    textShadow: '1px 1px 0 rgba(255,255,255,0.66)'
                  }}
                />
              </FormControl>
              <br />
              <br />
              <FormControl>
                <input
                  type='submit'
                  value='Search'
                  style={{
                    borderRadius: '3px',
                    border: 'none',
                    backgroundColor: '#2dabf9',
                    display: 'inline-block',
                    cursor: 'pointer',
                    color: '#ffffff',
                    fontFamily: 'Arial',
                    fontSize: '15px',
                    padding: '9px 23px',
                    textDecoration: 'none'
                  }}
                />
              </FormControl>
            </DialogContent>
          </form>
        )}
      </ApolloConsumer>
      <div>
        {error && <Error error={{ message: error }} />}
        {!!url && !!fileName && (
          <ExpansionPanel>
            <ExpansionPanelSummary>
              <ListItem>
                <ListItemText
                  primaryTypographyProps={{
                    variant: 'inherit',
                    color: 'primary'
                  }}
                  primary={`File: ${fileName}`}
                />
                <Typography variant='inherit'>
                  <Button>
                    <a href={url} download>
                      Download
                    </a>
                  </Button>
                </Typography>
              </ListItem>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        )}
      </div>
    </Paper>
  );
};

const GET_DLFILE_QUERY = gql`
  query getDownloadFile($email: String!, $fileToken: String!) {
    dlfile(email: $email, fileToken: $fileToken) {
      url
      name
    }
  }
`;

export default DashBoard;
