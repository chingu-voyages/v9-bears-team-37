import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Loading from '../Common/Loading';
import ShowError from '../Common/ShowError';
import Button from '@material-ui/core/Button';

const Confirm = props => {
  const [redirect, setRedirect] = useState(false);
  const { id } = props.match.params;

  const renderReidrect = () => {
    if (redirect) {
      return <Redirect to='/' />;
    }
  };

  const handleConfirmEmail = (event, updateUser) => {
    event.preventDefault();
    updateUser()
      .then(data => console.log(data))
      .catch(error => console.log(error));
    setRedirect(true);
  };

  return (
    <>
      {renderReidrect()}
      <Mutation
        mutation={CONFIRM_EMAIL_QUERY}
        variables={{ userId: id, isVerified: true }}
        onCompleted={data => {
          console.log(data);
        }}
      >
        {(updateUser, { loading, error }) => {
          if (error) {
            console.log('error=>', error);
          }
          if (loading) {
            console.log('loading ...');
          }

          return (
            <Button
              fullWidth
              variant='outlined'
              color='primary'
              onClick={event => handleConfirmEmail(event, updateUser)}
            >
              Verify your email
            </Button>
          );
        }}
      </Mutation>
    </>
  );
};

const CONFIRM_EMAIL_QUERY = gql`
  mutation($userId: Int!, $isVerified: Boolean) {
    updateUser(userId: $userId, isVerified: $isVerified) {
      user {
        id
        isVerified
      }
    }
  }
`;

export default Confirm;
