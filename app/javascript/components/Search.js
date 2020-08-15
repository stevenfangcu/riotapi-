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
  state={
    post:null
  }
  constructor(props) {
    super(props);
    this.counter = 0;
    this.pageMessage = "This summoner is not registered on League of Legends, Please check the spelling";
    this.username = "";
    this.playerLV = '';
    this.accountID = '';
    this.apiKey = '?api_key=RGAPI-9fe43dbb-d3ef-42af-8d4a-e13ff8764c40';
    this.textInput = React.createRef();
    this.bannChampion = new Array(1);
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
    this.fetchUserApi(username);
    this.aChampName()
  }
async aChampName(){
  const res = await axios.get('http://ddragon.leagueoflegends.com/cdn/9.18.1/data/en_US/champion.json')
  this.setState({
    post: res.data
  });
}

fetchMatchApi(accountID){
    var startUrl = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
    var accountID = this.accountID;
    if(accountID != ''){
      var urlAPI = startUrl + accountID + this.apiKey;
      axios.get(urlAPI)
        .then((response) => {
          this.fetchMatchStats(response.data.matches[0].gameId);
          for (var i = 0; i < response.data.matches.length; i++){

          }
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
    axios.get(urlAPI)
      .then((response) => {
        this.playerLV = response.data.summonerLevel;
        this.pageMessage = response.data.name;
        this.forceUpdate()
        this.accountID = response.data.accountId;
        this.fetchMatchApi(this.accountID);
      })
      .catch((error) => {
        console.log(error);
      });
  }


fetchMatchStats(matchid){
      const nameArray = new Array(1);
      const bannNumArray = new Array(1);
      var url = 'https://na1.api.riotgames.com/lol/match/v4/matches/' + matchid + this.apiKey;
      axios.get(url)
        .then((response) => {
          Object.values(response.data.participantIdentities).forEach((val) =>{
            nameArray.push(val.player.summonerName);
          });
          console.log(nameArray);
          for(var i = 0; i < 2; i++){
            Object.values(response.data.teams[i].bans).forEach((champBans) =>{
              //var numberOfTotalChampions = (Object.keys(this.state.post.data).length);
              bannNumArray.push(champBans.championId);
              Object.values(this.state.post.data).forEach((champion) =>{
              if(champion.key == champBans.championId){
                console.log("it worked! " + champion.id);
              }
              });
            });
          }
          console.log(bannNumArray);
          console.log(this.state.post.data);

        });

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
