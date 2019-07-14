import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import Button from '@material-ui/core/Button';

const Confirm = props => {
  const [redirect, setRedirect] = useState(false);
  const { id } = props.match.params;

  const renderReidrect = () => {
    if (redirect) {
      return <Redirect to="/" />;
    }
  };

  const handleConfirmEmail = (event, updateUser) => {
    event.preventDefault();
    updateUser();
    setRedirect(true);
  };

  return (
    <>
      {renderReidrect()}
      <Mutation
        mutation={CONFIRM_EMAIL_QUERY}
        variables={{ userId: id, isVerified: true }}
        onCompleted={data => {
          console.log({ data });
        }}
        onError={error => console.log(error)}
      >
        {(updateUser, { loading, error }) => {
          if (error) {
            console.log(error);
          }
          if (loading) {
            console.log('loading ...');
          }

          return (
            <Button
              fullWidth
              variant="outlined"
              color="primary"
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
