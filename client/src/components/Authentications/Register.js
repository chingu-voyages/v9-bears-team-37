import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { sendEmail } from '../../helpers';
import { EMAIL_VERIFICATION_ENDPOINT } from '../../config';
import Error from '../Common/ShowError';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';

import { Card, Form, Button, Alert, Toast } from 'react-bootstrap';

const Register = ({ setNewUser }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const handleSubmit = (e, createUser) => {
    e.preventDefault();
    createUser();
  };

  const handleSendVerificationEmail = (username, email) => {
    const payload = { username, email };

    if (!mailSent) {
      sendEmail(EMAIL_VERIFICATION_ENDPOINT, payload)
        .then(data => {
          setMailSent(true);
        })
        .catch(err => console.log(err));
    }
  };
  // else do nothing

  return (
    <Paper>
      <Card style={{ width: '18rem', border: 'none' }}>
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
              <Form
                onSubmit={e => handleSubmit(e, createUser)}
                style={{ marginLeft: '1rem' }}
              >
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    //id="name"
                    type="text"
                    placeholder="Enter User Name"
                    onChange={e => setUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    // id="email"
                    type="email"
                    placeholder="Enter email"
                    onChange={e => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    //id="password"
                    type="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
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
                  <u> Already Registered? Log in here</u>
                </Button>
                {error && <Error error={error} />}
              </Form>
            );
          }}
        </Mutation>
        <Dialog open={mailSent ? (!reveal, setNewUser(false)) : reveal}>
          <Alert variant={'success'}>
            This is a success alert—check it out!
          </Alert>
          <Toast.Body>
            {/* <Button block onClick={() => setNewUser(false)}>
              Login
            </Button> */}
            <Button
              block
              onClick={() => handleSendVerificationEmail(username, email)}
            >
              {mailSent
                ? 'A verification email has been sent'
                : 'Send verification email'}
            </Button>
          </Toast.Body>
        </Dialog>
      </Card>
    </Paper>
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
