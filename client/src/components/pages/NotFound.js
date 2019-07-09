import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import FileList from '../File/FileList';
import CreateFile from '../File/CreateFile';
import Loading from '../Common/Loading';
import ShowError from '../Common/ShowError';
import { Row, Col } from 'react-bootstrap';
import { Typography } from '@material-ui/core';

const NotFound = () => {
  return <Typography variant='h2'>Page Not Found</Typography>;
};

export default NotFound;
