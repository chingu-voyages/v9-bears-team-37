import React, { useState, useContext } from 'react';
// import { Button, Toast, Form, Row, Col } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import axios from 'axios';
import { UserContext } from '../../App';
// import { GET_DLFILES_QUERY } from '../pages/Root';
import { PROFILE_QYERY } from '../pages/Root';

import ShowError from '../Common/ShowError';

import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const UpdateFile = ({ dlfile, classes }) => {
  console.log({ dlfile });
  const currentUser = useContext(UserContext);
  const [reveal, setReveal] = useState(false);
  const [name, setName] = useState(dlfile.name);
  const [description, setDescription] = useState(dlfile.description);
  const [file, setFile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sizeError, setSizeError] = useState('');
  const isCurrentUser = currentUser.id === dlfile.postedBy.id;

  const handleFileupload = e => {
    const selectedFile = e.target.files[0];
    const fileSizeLimit = 15000000;
    if (selectedFile && selectedFile.size > fileSizeLimit) {
      setSizeError(`${selectedFile.name}: File size too large`);
    } else {
      setFile(selectedFile);
      setSizeError('');
    }
    //setFile(selectedFile);
    console.log(file);
    console.log(name, description);
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

  const handleSubmit = async (e, updateDlfile) => {
    e.preventDefault();
    setSubmitting(true);

    const uploadedURL = await handleFile();
    updateDlfile({
      variables: { dlfileId: dlfile.id, name, description, url: uploadedURL }
    });
  };

  const handleCancel = () => {
    setReveal(false);
    setName('');
    setDescription('');
    setFile('');
  };

  return (
    isCurrentUser && (
      <>
        <Button
          onClick={() => setReveal(true)}
          style={reveal === false ? { display: 'block' } : { display: 'none' }}
        >
          Edit
        </Button>
        <Mutation
          mutation={UPDATE_DLFILE_MUTATION}
          onCompleted={data => {
            console.log({ data });
            setSubmitting(false);
            setReveal(false);
            setName('');
            setDescription('');
            setFile('');
          }}
          //refetchQueries={() => [{ query: GET_DLFILES_QUERY }]}
        >
          {(updateDlfile, { loading, error }) => {
            if (error) return <ShowError error={error} />;
            return (
              <Dialog open={reveal} className={classes.dialog}>
                <form onSubmit={event => handleSubmit(event, updateDlfile)}>
                  <DialogTitle>Update Track</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Add a Title, Description & File (Under 15MB)
                    </DialogContentText>
                    <FormControl fullWidth>
                      <TextField
                        label="Title"
                        placeholder="Add Title"
                        onChange={event => setName(event.target.value)}
                        value={name}
                        className={classes.textField}
                      />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextField
                        multiline
                        rows="4"
                        label="Description"
                        placeholder="Add Description"
                        onChange={event => setDescription(event.target.value)}
                        value={description}
                        className={classes.textField}
                      />
                    </FormControl>
                    <FormControl error={Boolean(sizeError)}>
                      <input
                        id="audio"
                        required
                        type="file"
                        //accept="audio/mp3,audio/wav"
                        className={classes.input}
                        onChange={handleFileupload}
                      />
                      <label htmlFor="audio">
                        <Button
                          variant="outlined"
                          color={file ? 'secondary' : 'inherit'}
                          component="span"
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
                      onClick={() => setReveal(false)}
                      className={classes.cancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={
                        submitting ||
                        !name.trim() ||
                        !description.trim() ||
                        !file
                      }
                      type="submit"
                      className={classes.save}
                    >
                      {submitting ? (
                        <CircularProgress className={classes.save} size={24} />
                      ) : (
                        'Update Track'
                      )}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            );
          }}
        </Mutation>
      </>
    )
  );
};

const UPDATE_DLFILE_MUTATION = gql`
  mutation($dlfileId: Int!, $name: String, $url: String, $description: String) {
    updateDlfile(
      dlfileId: $dlfileId
      name: $name
      url: $url
      description: $description
    ) {
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
    margin: theme.spacing.unit
  },
  cancel: {
    color: 'red'
  },
  save: {
    color: 'green'
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: 'none'
  }
});

export default withStyles(styles)(UpdateFile);
