import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Button } from 'react-bootstrap';

const Signout = () => {
  const handleSignOut = client => {
    localStorage.removeItem('authToken');
    client.writeData({ data: { isLoggedIn: false } });
    console.log('User Signed out', client);
  };

  return (
    <ApolloConsumer>
      {client => (
        <Button onClick={() => handleSignOut(client)} variant="danger">
          Sign Out
        </Button>
      )}
    </ApolloConsumer>
  );
};

export default Signout;
