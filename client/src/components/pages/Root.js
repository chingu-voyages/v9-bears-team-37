import React, {useContext} from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import Header from '../Common/Header';
import FileList from '../File/FileList';
import CreateFile from '../File/CreateFile';
import Loading from '../Common/Loading';
import { UserContext } from '../../App';

const Root = () => {
  const {email}= useContext(UserContext)

  return (
    <>
      <Header fixed='top' />
      <div>
        <CreateFile />
        <Query query={GET_DLFILES_QUERY} variables={{email}}  >
          {({ data, loading, error }) => {
            if (loading) return <Loading />;
            //if (error) return <ShowError error={error} />;

            return (
              <FileList dlfiles={data.dlfiles} id={data.dlfiles.postedBy} />
            );
          }}
        </Query>
      </div>
    </>
  );
};

export const GET_DLFILES_QUERY = gql`
query getDlFiles($email: String!) {
  dlfiles(email: $email) {
    id
    name
    description
    url
    fileToken
    tokenSent
    postedBy {
      id
      username
      email
    }
  }
}
`;

export default Root;
