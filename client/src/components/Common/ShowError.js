import React, { useState } from 'react';
import { Toast, Button } from 'react-bootstrap';
import Dialog from '@material-ui/core/Dialog';

const ShowError = ({ error, setError }) => {
  const [show, setShow] = useState(true);
  return (
    <Dialog open={show} variant='danger'>
      <Toast.Body variant='danger'>{error.message}</Toast.Body>
      <div className='d-flex justify-content-end'>
        <Button onClick={() => setShow(false)} variant='outline-success'>
          Close
        </Button>
      </div>
    </Dialog>
  );
};

export default ShowError;
