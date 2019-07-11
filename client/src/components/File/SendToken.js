import React, { useState } from 'react';
import { FILE_TOKEN_ENDPOINT } from '../../config';
import { sendEmail } from '../../helpers';
import ShowError from '../Common/ShowError';
import Loading from '../Common/Loading';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

const SendToken = ({ currentUser, dlfile }) => {
  const [tokenSent, setTokenSent] = useState(false);

  const handleSendToken = ({ fileName, fileDescription, fileToken }) => {
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
    <Button
      variant={tokenSent ? 'contained' : 'outlined'}
      onClick={() =>
        handleSendToken({
          fileName: dlfile.name,
          fileDescription: dlfile.description,
          fileToken: dlfile.fileToken
        })
      }
      disabled={tokenSent}
    >
      {tokenSent ? 'Token Sent' : 'Send Token'}
    </Button>
  );
};

export default SendToken;
