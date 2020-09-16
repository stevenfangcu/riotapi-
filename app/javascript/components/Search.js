  import React from 'react';
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
      this.apiKey = '?api_key=RGAPI-3922bdab-21e7-4d26-a446-9be376c32baf'//your api key goes here ;
      this.textInput = React.createRef();
      this.bannChampion = new Array(1);
      this.gameID = new Array();
      this.numberOfGamesSpawned = 0;
      this.noBanIdArray = [875,876,235,523];
      this.matchArrays = new Array(1);
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
    fetch('http://ddragon.leagueoflegends.com/cdn/9.18.1/data/en_US/champion.json')
    .then(response => response.json())
    .then(data => {
      this.setState({
        champs: data
      })
    });
  }

  fetchMatchApi(accountID){
      var startUrl = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/';
      var accountID = this.accountID;
      if(accountID != ''){
        var urlAPI = startUrl + accountID + this.apiKey;
        fetch(urlAPI)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          this.matchArrays = data.matches.map((x)=>x);
          console.log(this.matchArrays);
          for (var i = 0; i < 5; i++){
            this.fetchMatchStats(data.matches[i].gameId);
          }
        }
        );
      }else{
        console.log("empty :c")
      }
    }

    fetchUserApi = (username) => {
      var apiKey = this.apiKey;
      var startUrl = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
      var username = this.username;
      var urlAPI = startUrl + username + this.apiKey;
      fetch(urlAPI)
      .then(response => response.json())
      .then(data => {
        this.playerLV = data.summonerLevel;
        this.pageMessage = data.name;
        this.forceUpdate()
        this.accountID = data.accountId;
        this.fetchMatchApi(this.accountID);
      });
    }

  getChampion(champid){
    var ans = 'None';
    Object.values(this.state.champs.data).forEach((champion) =>{
      if(champion.key == champid){
        ans = champion.id;
      }
    });
    return ans;
  }
  fetchMatchStats(matchid){
        const nameArray = new Array(1);
        const bannChampArray = new Array(1);
        const championArray = new Array(1);
        const teamArray0 = new Map();
        const teamArray1 = new Map();
        var gameMode = '';
        var url = 'https://na1.api.riotgames.com/lol/match/v4/matches/' + matchid + this.apiKey;
        fetch(url)
        .then(response => response.json())
        .then(data => {
          //duration of the game
          var gameTime = ((data.gameDuration-(data.gameDuration%=60))/60+(9<data.gameDuration?':':':0')+data.gameDuration);
          //playes summoners name
          Object.values(data.participantIdentities).forEach((val) =>{
            nameArray.push(val.player.summonerName);
            if(val.player.summonerName.toUpperCase() == this.username.toUpperCase()){ // which team the user is on
                if(nameArray.length > 5){
                  teamArray0.set('username',this.username);
                }else{
                  teamArray1.set('username',this.username);
                }
            }
          });
          Object.values(data.participants).forEach((val) =>{
            championArray.push(val.championId);
          });
          //banned champions
          for(var i = 0; i < 2; i++){ // 2 teams
            Object.values(data.teams[i].bans).forEach((champBans) =>{ // for each team
              //console.log(champBans);
              if(this.noBanIdArray.includes(champBans.championId)){ // if none
                bannChampArray.push("None");
              }

              var championPush = this.getChampion(champBans.championId); //get champ banns
              bannChampArray.push(championPush);

            });
            if (i == 0){
              teamArray0.set('baronKills',data.teams[i].baronKills);
              teamArray0.set('win', data.teams[i].win);
              // might be irrelevant might take out
              teamArray0.set('firstBaron', data.teams[i].firstBaron);
              teamArray0.set('dragonKills', data.teams[i].dragonKills);
              teamArray0.set('inhibs', data.teams[i].inhibitorKills);
              teamArray0.set('towers', data.teams[i].towerKills);
              teamArray0.set('rifts', data.teams[i].riftHeraldKills);
            }else{
              teamArray1.set('baronKills',data.teams[i].baronKills);
              teamArray1.set('win', data.teams[i].win);
              // might be irrelevant might take out
              teamArray1.set('firstBaron', data.teams[i].firstBaron);
              teamArray1.set('dragonKills', data.teams[i].dragonKills);
              teamArray1.set('inhibs', data.teams[i].inhibitorKills);
              teamArray1.set('towers', data.teams[i].towerKills);
              teamArray1.set('rifts', data.teams[i].riftHeraldKills);
            }
          }
          //getting champpion picks and turn it was picked
          console.log(teamArray0);
          console.log(teamArray1);
          console.log(nameArray);
          console.log("banns: " + bannChampArray);
          console.log(data);
          gameMode = data.gameMode;
          console.log(gameMode);
          this.appendGame(nameArray,bannChampArray,gameMode,matchid, teamArray0, teamArray1,gameTime, championArray);
          console.log(gameTime);
        });
    }

    wonMatch(teamArray0,teamArray1){

    }

    checkUserWinGame(teamArray0,teamArray1){
      var ans = '';
      if(teamArray0.get("username") == this.username){//background colour
        if(teamArray0.get("win") == "Fail"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: gray; background-color:#ff6666;'
        }else if(teamArray0.get("win") == "Win"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: gray; background-color:#99ff99;'
        }
      }else if(teamArray1.get("username") == this.username){
        if(teamArray1.get("win") == "Fail"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: gray; background-color:#ff6666;'
        }else if(teamArray1.get("win") == "Win"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: gray; background-color:#99ff99;'
        }
      }
      return ans;
    }

    appendGame(nameArray,bannChampArray,gameMode,matchid,teamArray0, teamArray1,gameTime,championArray){
      /* TO-DO LIST
        - make a counter so we dont have duplicataes from componentDidMount
        - get icons and better organization (more divs for each player and champion)
      */
      //return, do not do this gameid
      console.log(championArray);
      if(this.gameID.includes(matchid)){
        return;
      }
      var information = '';
      this.setState({
        informationArray: [nameArray,bannChampArray,gameMode]
      });

      this.gameID.push(matchid);

      this.wonMatch(teamArray0,teamArray1);

      console.log(this.state.informationArray);
      information = this.state.informationArray;
      var node = document.getElementById("riotGameWrapper");
      //summonernames
      var gameText = document.createElement("div");

      gameText.style.cssText = this.checkUserWinGame(teamArray0,teamArray1);

      gameText.setAttribute("id",matchid);
      gameText.onclick = function(){

      };
      gameText.onmouseout = function(checkUserWinGame){
        gameText.style.cssText = checkUserWinGame(teamArray0,teamArray1);
      };
      gameText.onmouseover = function(){
        gameText.style.cssText += 'font-style:italic;';
      };

      gameText.setAttribute("class","gameText");
      //setting Style of first div
      node.appendChild(gameText);
      // spawn summoner name divs on both sides of the div
      var appendNode = document.getElementById(matchid);

      var gameMode = document.createElement("div");
      gameMode.setAttribute("id","gameMode");
      gameMode.innerHTML = information[2];
      appendNode.appendChild(gameMode);

      var gameDuration = document.createElement("div");
      gameDuration.setAttribute("id","gameTime");
      gameDuration.innerHTML = gameTime;
      appendNode.appendChild(gameDuration);

      //summoners names
      for(var i = 1; i < 6; i++){
        //first team (on the right)
        var summonerNameTextTeam0 = document.createElement("div");
        summonerNameTextTeam0.innerHTML = (this.getChampion(championArray[i])) + ' ' + information[0][i];
        summonerNameTextTeam0.setAttribute("id", "team1");
        appendNode.appendChild(summonerNameTextTeam0);
        //second team (on the left)
        var summonerNameTextTeam1 = document.createElement("div");
        summonerNameTextTeam1.setAttribute("id","team2");
        summonerNameTextTeam1.innerHTML = (this.getChampion(championArray[i+5])) + ' ' + information[0][i+5];
        appendNode.appendChild(summonerNameTextTeam1);
      }
      //champion banns (null if none)
      var bannTeam0Text = document.createElement("div");
      bannTeam0Text.setAttribute("id", "team1");
      if(information[1][1] != undefined){
        var team0Banns = information[1][1] + "," + information[1][2] + "," + information[1][3]+ "," + information[1][4]+ "," + information[1][5];
        bannTeam0Text.innerHTML = team0Banns;
        var bannTeam1Text = document.createElement("div");
        bannTeam1Text.setAttribute("id", "team2");
        var team1Banns = information[1][6] + "," + information[1][7] + "," + information[1][8]+ "," + information[1][9]+ "," + information[1][10];
        bannTeam1Text.innerHTML = team1Banns;
        appendNode.appendChild(bannTeam0Text);
        appendNode.appendChild(bannTeam1Text);
      }
      //more information button
      var moreInformationButt = document.createElement("button");
      moreInformationButt.setAttribute("id", "moreInformationButt")
      appendNode.appendChild(moreInformationButt);

      var lineBreak = document.createElement("br");
      node.appendChild(lineBreak);


      //delete previous expandbutton
      try{
        var deleteButton = document.getElementById("expandButton");
        node.removeChild(deleteButton);
      }catch(err){
        console.log(err);
      }
    }

    addMore(){

      console.log(this.matchArrays);
      var matchesShown = document.getElementsByClassName('gameText').length;
      console.log(matchesShown);
      for(var i = matchesShown; i < (matchesShown+5); i++){
        this.fetchMatchStats(this.matchArrays[i].gameId);
      }
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
          <img src={logo} alt="Logo" className="summonerIcon"/>
          <br></br><br></br>
          <div className="summonerIcon">Username: <mark>{this.pageMessage}</mark></div>
          <br></br>
           <div className="summonerIcon">Level: {this.playerLV}</div>
           <br></br>
           <br></br>
           <div className="riotGameWrapper" id="riotGameWrapper">
           </div>
           <button onClick={this.addMore.bind(this)} id = "expandButton">
           Load more ...
           </button>
        </div>
      )
    }
  }

  export default Search
