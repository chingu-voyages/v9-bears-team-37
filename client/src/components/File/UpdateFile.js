import React, { useState, useContext } from 'react';
import { Button, Toast, Form, Row, Col } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import axios from 'axios';
import { UserContext } from '../../App';
// import { GET_DLFILES_QUERY } from '../pages/Root';
import { PROFILE_QYERY } from '../pages/Root';

import ShowError from '../Common/ShowError';

const UpdateFile = ({ dlfile }) => {
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
      <Col>
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
              <Toast
                //show={reveal}
                style={
                  reveal === false ? { display: 'none' } : { display: 'block' }
                }
              >
                <Form onSubmit={e => handleSubmit(e, updateDlfile)}>
                  <Form.Group controlId="filename">
                    <Form.Label>File Name</Form.Label>
                    <Form.Control
                      onChange={e => setName(e.target.value)}
                      type="text"
                      placeholder="Add file name"
                      value={name}
                    />
                  </Form.Group>
                  <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      onChange={e => setDescription(e.target.value)}
                      type="text"
                      placeholder="Add Description"
                      value={description}
                    />
                  </Form.Group>

                  <Form.Group controlId="file">
                    <Form.Label>Max Size 15MB</Form.Label>
                    <Form.Control type="file" onChange={handleFileupload} />
                  </Form.Group>
                  <Form.Row>
                    <Button disabled={submitting} onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setReveal(false)}
                      type="submit"
                      disabled={
                        submitting ||
                        !name ||
                        !description ||
                        !file ||
                        Boolean(sizeError) === true
                      }
                    >
                      Update File
                    </Button>
                  </Form.Row>
                  {Boolean(sizeError) ? sizeError : ''}
                </Form>
              </Toast>
            );
          }}
        </Mutation>
      </Col>
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

export default UpdateFile;
