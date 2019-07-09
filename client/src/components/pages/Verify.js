import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { sendEmail } from '../helpers';
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

  const handleSendEmail = id => {
    const payload = { id };
    const endpoint = `email/confirm/${id}`;
    sendEmail(payload, endpoint);
    setRedirect(true);
  };

  return (
    <div>
      {renderReidrect()}
      <Button
        fullWidth
        variant='outlined'
        color='primary'
        onClick={() => handleSendEmail(id)}
      >
        Verify your email
      </Button>
    </div>
  );
};

export default Confirm;
