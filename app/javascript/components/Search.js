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
    champs:null,
    information: {
      baronKills: "",
      win: "",
      dragonKills: "",
      inhibs: "",
      towers: "",
      rifts: ""
    }
  }
  constructor(props) {
    super(props);
    this.counter = 0;
    this.pageMessage = "This summoner is not registered on League of Legends, Please check the spelling";
    this.username = "";
    this.playerLV = '';
    this.accountID = '';
    this.apiKey = '?api_key=';
    this.textInput = React.createRef();
    this.bannChampion = new Array(1);
    this.gameID = 0;
    this.numberOfGamesSpawned = 0;
    this.noBanIdArray = [875,876,235,523];
  }
  Child(props){
    const {caption} = props;
  }
  Parent(props){

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
    champs: res.data
  });
}

fetchMatchApi(accountID){
    var startUrl = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
    var accountID = this.accountID;
    if(accountID != ''){
      var urlAPI = startUrl + accountID + this.apiKey;
      axios.get(urlAPI)
        .then((response) => {
          for (var i = 0; i < 5; i++){
            console.log(response.data.matches[i].gameId);
            this.fetchMatchStats(response.data.matches[i].gameId);
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
      const bannChampArray = new Array(1);
      const teamArray0 = new Map();
      const teamArray1 = new Map();
      var gameMode = '';
      var url = 'https://na1.api.riotgames.com/lol/match/v4/matches/' + matchid + this.apiKey;
      axios.get(url)
        .then((response) => {
          //duration of the game
          var gameTime = ((response.data.gameDuration-(response.data.gameDuration%=60))/60+(9<response.data.gameDuration?':':':0')+response.data.gameDuration);
          //playes summoners name
          Object.values(response.data.participantIdentities).forEach((val) =>{
            nameArray.push(val.player.summonerName);
          });
          //banned champions
          for(var i = 0; i < 2; i++){ // 2 teams
            Object.values(response.data.teams[i].bans).forEach((champBans) =>{ // for each team
              console.log(champBans);
              if(this.noBanIdArray.includes(champBans.championId)){
                bannChampArray.push("None");
              }
              Object.values(this.state.champs.data).forEach((champion) =>{ //champion banns for each team
                if(champion.key == champBans.championId){
                  bannChampArray.push(champion.id);
                  console.log(champion.id);
                }
              });
            });
            if (i == 0){
              teamArray0.set('baronKills',response.data.teams[i].baronKills);
              teamArray0.set('win', response.data.teams[i].win);
              // might be irrelevant might take out
              teamArray0.set('firstBaron', response.data.teams[i].firstBaron);
              teamArray0.set('dragonKills', response.data.teams[i].dragonKills);
              teamArray0.set('inhibs', response.data.teams[i].inhibitorKills);
              teamArray0.set('towers', response.data.teams[i].towerKills);
              teamArray0.set('rifts', response.data.teams[i].riftHeraldKills);
            }else{
              teamArray1.set('baronKills',response.data.teams[i].baronKills);
              teamArray1.set('win', response.data.teams[i].win);
              // might be irrelevant might take out
              teamArray1.set('firstBaron', response.data.teams[i].firstBaron);
              teamArray1.set('dragonKills', response.data.teams[i].dragonKills);
              teamArray1.set('inhibs', response.data.teams[i].inhibitorKills);
              teamArray1.set('towers', response.data.teams[i].towerKills);
              teamArray1.set('rifts', response.data.teams[i].riftHeraldKills);
            }
          }
          //getting champpion picks and turn it was picked
          console.log(teamArray0);
          console.log(teamArray1);
          console.log(nameArray);
          console.log("banns: " + bannChampArray);
          console.log(response.data);
          gameMode = response.data.gameMode;
          console.log(gameMode);
          this.appendGame(nameArray,bannChampArray,gameMode,matchid);
          console.log(gameTime);
        });
  }



  appendGame(nameArray,bannChampArray,gameMode,matchid){
    /* TO-DO LIST
      - make a counter so we dont have duplicataes from componentDidMount
      - get icons and better organization (more divs for each player and champion)
    */
    if(matchid == this.gameID){
      return;
    }
    var information = '';
    this.setState({
      informationArray: [nameArray,bannChampArray,gameMode]
    });
    this.gameID = matchid;
    console.log(this.state.informationArray);
    information = this.state.informationArray;
    var node = document.getElementById("riotGameWrapper");
    //summonernames
    var gameText = document.createElement("div");
    gameText.setAttribute("id",matchid);
    //setting Style of first div
    gameText.style.cssText = '  border-radius: 1px;border-width: medium;border-style: solid;border-color: gray;'
    node.appendChild(gameText);
    // spawn summoner name divs on both sides of the div
    var appendNode = document.getElementById(matchid);

    var gameMode = document.createElement("div");
    gameMode.setAttribute("id","gameMode");
    gameMode.innerHTML = information[2];
    appendNode.appendChild(gameMode);

    //summoners names
    for(var i = 1; i < 6; i++){
      //first team (on the right)
      var summonerNameTextTeam1 = document.createElement("div");
      summonerNameTextTeam1.innerHTML = information[0][i];
      summonerNameTextTeam1.setAttribute("id", "team1");
      appendNode.appendChild(summonerNameTextTeam1);
      //second team (on the left)
      var summonerNameTextTeam2 = document.createElement("div");
      summonerNameTextTeam2.setAttribute("id","team2");
      summonerNameTextTeam2.innerHTML = information[0][i+5];
      appendNode.appendChild(summonerNameTextTeam2);
    }
    //champion banns (null if none)
    var bannTeam1Text = document.createElement("div");
    bannTeam1Text.setAttribute("id", "team1");
    var team1Banns = information[1][1] + "," + information[1][2] + "," + information[1][3]+ "," + information[1][4]+ "," + information[1][5];
    bannTeam1Text.innerHTML = team1Banns;

    var bannTeam2Text = document.createElement("div");
    bannTeam2Text.setAttribute("id", "team2");
    var team2Banns = information[1][6] + "," + information[1][7] + "," + information[1][8]+ "," + information[1][9]+ "," + information[1][10];
    bannTeam2Text.innerHTML = team2Banns;

    appendNode.appendChild(bannTeam1Text);
    appendNode.appendChild(bannTeam2Text);

    var lineBreak = document.createElement("br");
    node.appendChild(lineBreak);
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
      <div className="background">
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
        <br></br><br></br>
        Username: {this.pageMessage}
        <br></br>
         Level: {this.playerLV}
         <div className="riotGameWrapper" id="riotGameWrapper">
         </div>
      </div>
    )
  }
}

export default Search
