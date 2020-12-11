import * as React from 'react';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import './App.css'
import Search from './Search'
import {Redirect} from 'react-router-dom';
import {Link} from 'react-router-dom';
const apiKey = 'RGAPI-6a7601ae-0eb1-43b0-ac7a-3aaacf9ff20e'

class Home extends React.Component{
  constructor(){
    super();
    this.textInput = React.createRef();
    this.state = {
      name: ''
    };
  }

  componentDidMount(){
    console.log('COMPONENT DID MOUNT')
  }

  handleKeyPress(target) {
    if(target.charCode==13){
      alert('Enter clicked!!!');
      {this.onButtonClick}
    }
  }
  onButtonClick = (event) => {
    const value = this.textInput.current.value;

    console.log(value)
    this.props.history.push({
      pathname: '/Search',
      search: ('?username='+value),
      data: value,
    })
  }


  render(){
    return(
      <div className="default">
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
      This is the Home Page.
      <br></br>
      Steven.gg
      <InputGroup className="mb-3" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
        <FormControl
          placeholder="Username...."
          aria-label="Username"
          aria-describedby="basic-addon2"
          ref={this.textInput}
          onKeyPress={event => { //Enter key event
              if (event.key === "Enter") {
                this.onButtonClick()
              }
            }}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={this.onButtonClick}>Search</Button>
        </InputGroup.Append>
      </InputGroup>
            <h1 className="classHead">{this.state.name}</h1>
            <div className="footer">
              <Link to="/about">
              About
              </Link>
              <div> </div>
              <Link to="/contact">
              Contact
              </Link>
            </div>
      </div>

    )
  }
}

export default Home
