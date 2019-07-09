import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import FileList from '../File/FileList';
import CreateFile from '../File/CreateFile';
import Loading from '../Common/Loading';
import ShowError from '../Common/ShowError';
import { Row, Col } from 'react-bootstrap';

const Confirm = () => {
  return (
    <div>
      <CreateFile />
      <Query query={GET_DLFILES_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;
          //if (error) return <ShowError error={error} />;

          return <FileList dlfiles={data.dlfiles} id={data.dlfiles.postedBy} />;
        }}
      </Query>
    </div>
  );
};

export const GET_DLFILES_QUERY = gql`
  query getDlfilesQuery {
    dlfiles {
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
`;

export default Confirm;
