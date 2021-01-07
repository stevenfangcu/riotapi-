import React from 'react'
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import './About.scss'


class About extends React.Component{
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
        Steven.gg
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
        <div className="title">
          About me
        </div>
        <div className="wrapper">
          <div className ="firstInfoDiv">
            Hello, I'm Steven Fang, I graduated from Carleton University with a degree in Computer Science. One of the
            main reasons I went to university for computer is for my love of programmning and data science that I developed
            in highschool. This love was further enhanced while studying in post secondary school.
          </div>
          <div className ="secondInfoDiv">
            Graduated from Carleton University majoring in Computer Science
          </div>
        </div>
        <div className="title">
          Work Experience
        </div>
        <div className="subTitle">The Source</div>
        <div className="wrapper">
          <div className ="firstInfoDiv">
          </div>
          <div className ="secondInfoDiv">
          I have interned for the department of national defence as a data analyst. At the department of national defence
          I was tasked with reviewing and transforming XML, excel, and text data entries from an informational
          database.
          </div>
        </div>
      </div>
    )
  }
}

export default About
