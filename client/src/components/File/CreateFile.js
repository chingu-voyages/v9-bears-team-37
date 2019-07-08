import React, { useState, useContext } from 'react';
//import { Button, Toast, Form, Row, Col } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import axios from 'axios';
import { GET_DLFILES_QUERY } from '../pages/Root';

import ShowError from '../Common/ShowError';

import { UserContext, ME_QUERY } from '../../App';

import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const CreateFile = ({ classes }) => {
  const currentUser = useContext(UserContext);

  const [reveal, setReveal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sizeError, setSizeError] = useState('');

  const handleFileupload = e => {
    const selectedFile = e.target.files[0];
    const fileSizeLimit = 15000000;
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setSizeError(`${selectedFile.name}: File size too large`);
    } else {
      setFile(selectedFile);
      setSizeError('');
    }
  };

  const handleFile = async () => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('resource_type', 'raw');
      data.append('upload_preset', 'file-download');
      data.append('cloud_name', 'inightelf');

      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/inightelf/raw/upload',
        data
      );
      return res.data.url;
    } catch (err) {
      console.error('Error uploading file', err);
      setSubmitting(false);
    }
  };

  const handleUpdateCache = (cache, { data: { createDlfile } }) => {
    const data = cache.readQuery({ query: GET_DLFILES_QUERY });
    const dlfiles = data.dlfiles.concat(createDlfile.dlfile);
    cache.writeQuery({ query: GET_DLFILES_QUERY, data: { dlfiles } });
  };

  const handleSubmit = async (e, createDlfile) => {
    e.preventDefault();
    setSubmitting(true);

    const uploadedURL = await handleFile();
    createDlfile({ variables: { name, description, url: uploadedURL } });
  };

  const handleCancel = () => {
    setReveal(false);
    setName('');
    setDescription('');
    setFile('');
  };

  return (
    <>
      <Button
        fullWidth
        variant='outlined'
        color='primary'
        onClick={() => setReveal(true)}
        style={reveal === false ? { display: 'block' } : { display: 'none' }}
        disabled={!currentUser.isVerified}
      >
        {currentUser.isVerified
          ? 'Upload'
          : 'Verify your email to upload files'}
      </Button>
      <Mutation
        mutation={CREATE_DLFILE_MUTATION}
        onCompleted={data => {
          console.log({ data });
          setSubmitting(false);
          setReveal(false);
          setName('');
          setDescription('');
          setFile('');
        }}
        update={handleUpdateCache}
        // refetchQueries={() => [{ query: GET_DLFILES_QUERY }]}
      >
        {(createDlfile, { loading, error }) => {
          if (error) return <ShowError error={error} />;
          return (
            <Dialog open={reveal} className={classes.dialog}>
              <form onSubmit={event => handleSubmit(event, createDlfile)}>
                <DialogTitle>Create File</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a Title, Description & File (Under 15MB)
                  </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      label='Title'
                      placeholder='Add Title'
                      onChange={event => setName(event.target.value)}
                      value={name}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      multiline
                      rows='4'
                      label='Description'
                      placeholder='Add Description'
                      onChange={event => setDescription(event.target.value)}
                      value={description}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl error={Boolean(sizeError)}>
                    <input
                      id='audio'
                      required
                      type='file'
                      //accept="audio/mp3,audio/wav"
                      className={classes.input}
                      onChange={handleFileupload}
                    />
                    <label htmlFor='audio'>
                      <Button
                        variant='outlined'
                        color={file ? 'secondary' : 'inherit'}
                        component='span'
                        className={classes.button}
                      >
                        File
                        <AttachFileIcon className={classes.icon} />
                      </Button>
                      {file && file.name}
                      <FormHelperText>{sizeError}</FormHelperText>
                    </label>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={submitting}
                    onClick={() => handleCancel()}
                    className={classes.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      submitting || !name.trim() || !description.trim() || !file
                    }
                    type='submit'
                    className={classes.save}
                  >
                    {submitting ? (
                      <CircularProgress className={classes.save} size={24} />
                    ) : (
                      'Create File'
                    )}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          );
        }}
      </Mutation>
    </>
  );
};

const CREATE_DLFILE_MUTATION = gql`
  mutation($name: String!, $description: String!, $url: String) {
    createDlfile(name: $name, description: $description, url: $url) {
      dlfile {
        id
        name
        description
        url
        postedBy {
          id
          username
        }
      }
    }
  }
`;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dialog: {
    margin: '0 auto',
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing()
  },
  cancel: {
    color: 'red'
  },
  save: {
    color: 'green'
  },
  button: {
    margin: theme.spacing(2)
  },
  icon: {
    marginLeft: theme.spacing()
  },
  input: {
    display: 'none'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: '200'
  }
});

export default withStyles(styles)(CreateFile);
