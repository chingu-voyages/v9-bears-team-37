import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { FILE_TOKEN_ENDPOINT } from '../../config';
import { sendEmail } from '../../helpers';
import ShowError from '../Common/ShowError';
import Loading from '../Common/Loading';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

const SendToken = ({ currentUser, dlfile }) => {
  const [tokenSent, setTokenSent] = useState(false);

  const handleSendToken = (
    updateDlfile,
    { fileName, fileDescription, fileToken }
  ) => {
    updateDlfile({
      variables: { dlfileId: dlfile.id, tokenSent: true }
    });
    const payload = {
      userName: currentUser.username,
      email: currentUser.email,
      fileName,
      fileDescription,
      fileToken
    };
    sendEmail(FILE_TOKEN_ENDPOINT, payload)
      .then(() => {
        setTokenSent(true);
      })
      .catch(error => console.log(error));
  };

  return (
    <Mutation
      mutation={UPDATE_DLFILE_MUTATION}
      onCompleted={data => {
        console.log(data);
        setTokenSent(true);
      }}
    >
      {(updateDlfile, { loading, error }) => {
        if (error) return <ShowError error={error} />;
        return (
          <Button
            variant={tokenSent ? 'contained' : 'outlined'}
            onClick={() =>
              handleSendToken(updateDlfile, {
                fileName: dlfile.name,
                fileDescription: dlfile.description,
                fileToken: dlfile.fileToken
              })
            }
            disabled={tokenSent}
          >
            {tokenSent || dlfile.tokenSent ? 'Token Sent' : 'Send Token'}
          </Button>
        );
      }}
    </Mutation>
  );
};

const UPDATE_DLFILE_MUTATION = gql`
  mutation($dlfileId: Int!, $tokenSent: Boolean) {
    updateDlfile(dlfileId: $dlfileId, tokenSent: $tokenSent) {
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

export default SendToken;
