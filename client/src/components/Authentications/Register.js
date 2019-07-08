import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Error from '../Common/ShowError';
import { API_URL } from '../../config';

import { Card, Form, Button, Alert, Toast } from 'react-bootstrap';

const Register = ({ setNewUser }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);

  const handleSubmit = (e, createUser) => {
    e.preventDefault();
    createUser();

    const headers = {
      accept: 'application/json',
      'content-type': 'application/json'
    };
    const body = JSON.stringify({ username, email });
    fetch(`${API_URL}/email`, {
      method: 'POST',
      headers,
      body
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.msg);
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
      <Card style={{ width: '18rem', border: 'none' }}>
        <Card.Img variant='top' src='holder.js/100px180' />
        <Card.Body>
          <Card.Title>
            <h3>Register</h3>
          </Card.Title>
        </Card.Body>

        <Mutation
          mutation={REGISTER_MUTATION}
          variables={{ username, email, password }}
          onCompleted={data => {
            // console.log({ data });
            setReveal(true);
          }}
        >
          {(createUser, { loading, error }) => {
            return (
              <Form onSubmit={e => handleSubmit(e, createUser)}>
                <Form.Group controlId='formBasicEmail'>
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    //id="name"
                    type='text'
                    placeholder='Enter User Name'
                    onChange={e => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId='formBasicEmail'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    // id="email"
                    type='email'
                    placeholder='Enter email'
                    onChange={e => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId='formBasicPassword'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    //id="password"
                    type='password'
                    placeholder='Password'
                    onChange={e => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant='primary'
                  type='submit'
                  block
                  disabled={
                    loading ||
                    !username.trim() ||
                    !email.trim() ||
                    !password.trim()
                  }
                >
                  {loading ? 'Registering...Please wait' : 'Register'}
                </Button>
                <Button
                  block
                  onClick={() => setNewUser(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'black',
                    textAlign: 'center'
                  }}
                >
                  Already Registered? Log in here
                </Button>
                {error && <Error error={error} />}
              </Form>
            );
          }}
        </Mutation>
        <Toast show={reveal}>
          <Alert variant={'success'}>
            This is a success alert—check it out!
          </Alert>
          <Toast.Body>
            <Button block onClick={() => setNewUser(false)}>
              Login
            </Button>
          </Toast.Body>
        </Toast>
      </Card>
    </div>
  );
};

const REGISTER_MUTATION = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        username
        email
      }
    }
  }
`;

export default Register;
