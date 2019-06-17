import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

export default class DownloadForm extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  handleSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    if (email === '') {
      this.setState({
        errors: { email: 'Email is required' }
      });
      return;
    }
    if (password === '') {
      this.setState({
        errors: { password: 'Password is required' }
      });
      return;
    }

    this.setState({
      email: '',
      password: '',
      errors: {}
    });
    //console.log(this.state.email, this.state.password);
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
    const { email, password, errors } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={this.handleChange}
            //error={errors.email}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Token</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Token"
            value={password}
            onChange={this.handleChange}
            //error={errors.password}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Get File
        </Button>
      </Form>
    );
  }
}
