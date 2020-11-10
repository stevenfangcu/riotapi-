import React from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import './About.scss'


class About extends React.Component{
  render(){
    return(
      <div className="default"> Steven.gg
      <br></br>
      about# Personal project :)
      <InputGroup className="mb-3" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
        <FormControl
          placeholder="Username...."
          aria-label="Username"
          aria-describedby="basic-addon2"
        />
        <InputGroup.Append>
          <Button variant="outline-secondary">Search</Button>
        </InputGroup.Append>
      </InputGroup>
      </div>
    )
  }
}

export default About
