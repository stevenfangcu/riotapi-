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



  render(){
    return(
      <div> This is the Contact Page.
        <div className="contactPage">
          <form id="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
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
}

export default Contact
