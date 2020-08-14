import React from 'react';
import axios from 'axios';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import {Helmet} from 'react-helmet';
import Resizer from 'react-image-file-resizer';
import logo from './filler.png'
import './Search.css'

// usage of apis from Riot Games

class Search extends React.Component{
  constructor(props) {
    super(props);
    this.counter = 0;
    this.pageMessage = "This summoner is not registered on League of Legends, Please check the spelling";
    this.username = "";
    this.playerLV = '';
    this.accountID = '';
    this.apiKey = '?api_key=RGAPI-578489f7-2901-4af7-8b7c-2d788ea2e25f';
    this.textInput = React.createRef();
  }
  // getters and setters
  getUrl(){
    const url = window.location.href;
    return url;
  }
  getUserData(){
    const {data} = this.props.location;
    return {data};
  }
  setUsername(data,url){
    var username = "";
    if (data == null || data == undefined){
      username = url.slice(38);
      if(username.includes('%20')){ // checks for space and removes it
        username = username.replace("%20"," ");
      }
    }else{
      username = data;
    }
    this.username = username;
    return username;
  }
  // search bar functions
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
    window.location.reload();
  }
  // api functions and component mounts
  componentDidMount(){
    const {data} = this.getUserData();
    const url = this.getUrl();
    var username = this.setUsername(data,url);
    console.log(username);
    this.fetchUserApi(username);
  }


fetchMatchApi(accountID){
    var startUrl = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
    var accountID = this.accountID;
    if(accountID != ''){
      var urlAPI = startUrl + accountID + this.apiKey;
      console.log("not empty c:")
      axios.get(urlAPI)
        .then((response) => {
          console.log(response.data.matches[0].champion);
          console.log(response.data.matches[0]);
          for (var i = 0; i < response.data.matches.length; i++){
            //this.getChampionName(response.data.matches[i].champion);
          }
          this.getChampionName(111);
        });
    }else{
      console.log("empty :c")
    }
  }

  fetchUserApi = (username) => {
    var apiKey = this.apiKey;
    var startUrl = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
    var username = this.username;
    var urlAPI = startUrl + username + this.apiKey;
    console.log("2")
    axios.get(urlAPI)
      .then((response) => {
        console.log(response.data);
        this.playerLV = response.data.summonerLevel;
        this.pageMessage = response.data.name;
        this.forceUpdate()
        this.accountID = response.data.accountId;
        console.log(this.accountID + " account ID");
        this.fetchMatchApi(this.accountID);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getChampionName(id){
    var url = 'http://ddragon.leagueoflegends.com/cdn/9.18.1/data/en_US/champion.json'
    axios.get(url).then((response) => {
      var length1 = Object.keys(response.data.data).length
      Object.values(response.data.data).forEach((val) => {
        if(id == val.key){
          console.log(val);
        }
      });

    })
  }

  render(){
    let message;
    const {data} = this.getUserData();
    const url = this.getUrl();
    var username = this.setUsername(data,url);

    if(this.counter < 1){ // how to render the page without overloading the api server
      this.componentDidMount();
      this.counter = this.counter + 1;
      if(!this.pageMessage){
        console.log("not null");
        console.log(message);
      }else {
        console.log(this.pageMessage + " owo.");
        //message = this.username;
      }
    }
    return(
      <div>

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

        <img src={logo} alt="Logo" />
      <br></br>

      <br></br>
      Username: {this.pageMessage}
      <br></br>
       Level: {this.playerLV}
      </div>
    )
  }
}

export default Search
