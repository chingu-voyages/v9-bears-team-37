import React, { useState } from 'react';
import { Toast, Button } from 'react-bootstrap';

const ShowError = ({ error }) => {
  const [show, setShow] = useState(true);
  return (
    <Toast show={show} variant="danger">
      <Toast.Body varient={'danger'}>{error.message}</Toast.Body>
      <div className="d-flex justify-content-end">
        <Button onClick={() => setShow(false)} variant="outline-success">
          Close me ya'll!
        </Button>
      </div>
    </Toast>
  );
};

export default ShowError;
