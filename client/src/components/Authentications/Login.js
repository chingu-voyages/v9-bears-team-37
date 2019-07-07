import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Card, Form, Button, Alert, Toast } from 'react-bootstrap';
import Error from '../Common/ShowError';

const Login = ({ classes, setNewUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e, authToken, client) => {
    e.preventDefault();
    const res = await authToken();
    localStorage.setItem('authToken', res.data.tokenAuth.token);
    client.writeData({ data: { isLoggedIn: true } });
  };

  return (
    <div>
      <Card style={{ width: '18rem', border: 'none' }}>
        <Card.Img variant='top' src='holder.js/100px180' />
        <Card.Body>
          <Card.Title>
            <h3>Login</h3>
          </Card.Title>
        </Card.Body>

        <Mutation mutation={LOGIN_MUTATION} variables={{ username, password }}>
          {(authToken, { loading, error, called, client }) => {
            return (
              <Form onSubmit={e => handleSubmit(e, authToken, client)}>
                <Form.Group controlId='formBasicEmail'>
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    //id="name"
                    type='text'
                    placeholder='Enter User Name'
                    onChange={e => setUsername(e.target.value)}
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
                  disabled={loading || !username.trim() || !password.trim()}
                >
                  {loading ? 'Login...Please wait' : 'Login'}
                </Button>
                <Button
                  block
                  onClick={() => setNewUser(true)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'black',
                    textAlign: 'center'
                  }}
                >
                  New User? Register here
                </Button>
                {error && <Error error={error} />}
              </Form>
            );
          }}
        </Mutation>
      </Card>
    </div>
  );
};

const LOGIN_MUTATION = gql`
  mutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
    }
  }
`;

export default Login;
