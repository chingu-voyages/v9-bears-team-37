import React, { useState, useRef } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

const DashBoard = () => {
  const ref = useRef();
  const ref1 = useRef();
  console.log(ref.current, ref1.current);
  const [email, setEmail] = useState('');
  const [fileToken, setFileToken] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    setEmail(ref.current.value);
    setFileToken(ref1.current.value);
  };
  return (
    <div>
      <h1>DashBoard11</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email..."
          ref={ref}
        />
        <input
          type="text"
          name="token"
          placeholder="Enter token..."
          ref={ref1}
        />
        <input type="submit" value="Download File" />
      </form>
      <Query query={GET_DLFILE_QUERY} variables={{ email, fileToken }}>
        {({ data, loading, error }) => {
          if (!data) return <div>Please fill input field</div>;
          if (loading) return <div>Loading</div>;
          return (
            <div>
              {console.log(typeof data.dlfile.url)}
              <a href={data.dlfile.url} download>
                hii
              </a>
            </div>
          );
        }}
      </Query>
    </div>
  );
};

const GET_DLFILE_QUERY = gql`
  query getDownloadFile($email: String!, $fileToken: String!) {
    dlfile(email: $email, fileToken: $fileToken) {
      url
    }
  }
`;

export default DashBoard;
