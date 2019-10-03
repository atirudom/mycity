import React, { Component } from 'react';
import './customers.css';
import axios from 'axios';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'flaty',
      name: '',
      email: '',
      previewAccess: null,
    };

    
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {

    event.preventDefault();
    const data = JSON.stringify(this.state)
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    console.log(data)

    // axios.post("/signup", data, config)
    //   .then(response => {
    //     console.log(response)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })


    fetch("/signup", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data,
    });
  }


  render() {
    return (
      <form id="signupForm" role="form" onSubmit={this.handleSubmit}>
        <input type="hidden" id="theme" name="theme" value="<%= theme %>" onChange={this.handleInputChange} />
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" class="form-control" id="name" name="name" placeholder="Your name" onChange={this.handleInputChange} />
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input type="email" class="form-control" id="email" name="email" placeholder="Your email address" onChange={this.handleInputChange} />
        </div>
        <div class="form-group">
          <label for="previewAccess">Interested in Preview Access?</label>
          <select class="form-control" name="previewAccess" value={this.state.previewAccess} onChange={this.handleInputChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div class="modal-footer">
          <button id="signup" type="submit" class="btn btn-primary" >Sign Up!</button>
        </div>
      </form>
    );
  }
}

export default Test;
