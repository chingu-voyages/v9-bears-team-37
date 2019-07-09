import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../App';
import { sendEmail } from '../helpers';
import Loading from '../Common/Loading';
import ShowError from '../Common/ShowError';
import Button from '@material-ui/core/Button';

const Confirm = props => {
  const [redirect, setRedirect] = useState(false);

  const user = useContext(UserContext);
  const { id } = props.match.params;

  const renderReidrect = () => {
    if (redirect) {
      return <Redirect to='/' />;
    }
  };

  const handleSendEmail = (id, user) => {
    if (id !== user.id) {
      console.log('You are not authorized to verify!');
    } else if (user.isVerified) {
      console.log('Your email is already verified!');
    } else {
      console.log('Sending confirmation request');
      const payload = { user };
      const endpoint = `email/confirm`;
      sendEmail(payload, endpoint);
    }
    setRedirect(true);
  };

  return (
    <div>
      {renderReidrect()}
      <Button
        fullWidth
        variant='outlined'
        color='primary'
        onClick={() => handleSendEmail(id, user)}
      >
        Verify your email
      </Button>
    </div>
  );
};

export default Confirm;
