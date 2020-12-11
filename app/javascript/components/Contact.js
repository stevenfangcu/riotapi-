import React from 'react'
import './Contact.css'

class Contact extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      name: '',
      email: '',
      message: ''
    }
  }

  resetForm(){
    this.setState({name: '', email: '', message: ''})
  }


  render(){
    return(
      <div>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="/">Our Logo</a>
          <form className="form-inline">
            <a class="btn btn-outline-primary btn-space" href="/" role="button">
            Home
            </a>
            <a class="btn btn-outline-primary btn-space" href="/about" role="button">
            About
            </a>
            <a class="btn btn-outline-primary btn-space" href="/contact" role="button">
            Contact
            </a>
          </form>
      </nav>
      This is the Contact Page.
        <div className="contactPage">
          <form id="contact-form">
            <div className="form-group">
              <label htmlFor="name">Title</label>
              <input type="text" className="form-control" value={this.state.name} onChange={this.onNameChange.bind(this)}/>
            </div>
            <div className="form-group">
              <label htmlFor="name">Email</label>
              <input type="text" className="form-control" value={this.state.email} onChange={this.onEmailChange.bind(this)}/>
            </div>
            <div>
              <label htmlFor="name">Message</label>
              <textarea className="form-control" rows="5" value={this.state.message} onChange={this.onMessageChange.bind(this)}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    );
  }
  onNameChange(event) {
    this.setState({name: event.target.value})
  }
  onEmailChange(event) {
    this.setState({email: event.target.value})
  }
  onMessageChange(event) {
    this.setState({message: event.target.value})
  }
  handleSubmit(e) {
    e.preventDefault();

    fetch('http://localhost:3002/send', {
        method: "POST",
        body: JSON.stringify(this.state),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(
      (response) => (response.json())
        ).then((response)=> {
      if (response.status === 'success') {
        alert("Message Sent.");
        this.resetForm()
      } else if(response.status === 'fail') {
        alert("Message failed to send.")
      }
    })
  }
}

export default Contact
