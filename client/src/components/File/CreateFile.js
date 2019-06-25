import React, { useState } from 'react';
import { Button, Toast, Form, Row, Col } from 'react-bootstrap';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import axios from 'axios';
import { GET_DLFILES_QUERY } from '../pages/Root';

import ShowError from '../Common/ShowError';

const CreateFile = () => {
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
    <Col>
      <Button
        onClick={() => setReveal(true)}
        style={reveal === false ? { display: 'block' } : { display: 'none' }}
      >
        To Upload
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
            <Toast
              //show={reveal}
              style={
                reveal === false ? { display: 'none' } : { display: 'block' }
              }
            >
              <Form onSubmit={e => handleSubmit(e, createDlfile)}>
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
                    Add File
                  </Button>
                </Form.Row>
                {Boolean(sizeError) ? sizeError : ''}
              </Form>
            </Toast>
          );
        }}
      </Mutation>
    </Col>
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

export default CreateFile;
