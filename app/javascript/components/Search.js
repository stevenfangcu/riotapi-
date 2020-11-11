  import React from 'react';
  import InputGroup from 'react-bootstrap/InputGroup';
  import FormControl from 'react-bootstrap/FormControl';
  import Button from 'react-bootstrap/Button';
  import {Helmet} from 'react-helmet';
  import Resizer from 'react-image-file-resizer';
  import logo from './filler.png'
  import './Search.css'
  import {HorizontalBar,Line,Pie} from 'react-chartjs-2';

  // usage of apis from Riot Games

  class Search extends React.Component{
    state={
      champs:null,
      stats: [],
      information: {
        baronKills: "",
        win: "",
        dragonKills: "",
        inhibs: "",
        towers: "",
        rifts: "",
      }
    }
    constructor(props) {
      super(props);
      this.counter = 0;
      this.pageMessage = "This summoner is not registered on League of Legends, Please check the spelling";
      this.username = "";
      this.playerLV = '';
      this.accountID = '';
      this.apiKey = '?api_key='//your api key goes here ;
      this.textInput = React.createRef();
      this.bannChampion = new Array(1);
      this.gameID = new Array();
      this.numberOfGamesSpawned = 0;
      this.noBanIdArray = [875,876,235,523];
      this.newChampArray = ["Lillia","Sett","Senna","Aphelios"];
      this.matchArrays = new Array(1);
      this.winStatistics = new Map();
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

    if(champid == 875){
      ans = "Sett"
    }else if(champid == 876){
      ans = "Lillia"
    }else if(champid == 235){
      ans = "Senna"
    }else if(champid == 523){
      ans = "Aphelios"
    }

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
        const teamMap0 = new Map();
        const teamMap1 = new Map();
        var gameMode = '';
        var url = 'https://na1.api.riotgames.com/lol/match/v4/matches/' + matchid + this.apiKey;
        fetch(url)
        .then(response => response.json())
        .then(data => {
          //duration of the game
          console.log(data);
          var gameTime = ((data.gameDuration-(data.gameDuration%=60))/60+(9<data.gameDuration?':':':0')+data.gameDuration);
          //playes summoners name
          Object.values(data.participantIdentities).forEach((val) =>{
            nameArray.push(val.player.summonerName);
            if(val.player.summonerName.toUpperCase() == this.username.toUpperCase()){ // which team the user is on
                if(nameArray.length > 5){
                  teamMap0.set('username',this.username);
                  if(val.player.summonerName.toUpperCase() == this.username.toUpperCase()){
                    teamMap0.set('userChampion',data.participants[(val.participantId-1)].championId);
                  }
                }else{
                  console.log(val.player.summonerName == this.username);
                  teamMap1.set('username',this.username);
                  if(val.player.summonerName.toUpperCase() == this.username.toUpperCase()){
                    teamMap1.set('userChampion',data.participants[(val.participantId-1)].championId);
                  }
                }
            }
          });
          //champions on each team
          Object.values(data.participants).forEach((val) =>{
            championArray.push(val.championId);
          });
          //banned champions on each team
          for(var i = 0; i < 2; i++){ // 2 teams
            Object.values(data.teams[i].bans).forEach((champBans) =>{ // for each team
              //console.log(champBans);
              if(this.noBanIdArray.includes(champBans.championId)){ // if none

                //bannChampArray.push(this.getChampion(champBans.championId));

                bannChampArray.push("None");
              }

              var championPush = this.getChampion(champBans.championId); //get champ banns
              bannChampArray.push(championPush);

            });
            if (i == 0){
              teamMap0.set('baronKills',data.teams[i].baronKills);
              teamMap0.set('win', data.teams[i].win);
              // might be irrelevant might take out
              teamMap0.set('firstBaron', data.teams[i].firstBaron);
              teamMap0.set('dragonKills', data.teams[i].dragonKills);
              teamMap0.set('inhibs', data.teams[i].inhibitorKills);
              teamMap0.set('towers', data.teams[i].towerKills);
              teamMap0.set('rifts', data.teams[i].riftHeraldKills);
              teamMap0.set('firstBlood',data.teams[i].firstBlood);
              teamMap0.set('Summoner1',data.participants[0]);
              teamMap0.set('Summoner2',data.participants[1]);
              teamMap0.set('Summoner3',data.participants[2]);
              teamMap0.set('Summoner4',data.participants[3]);
              teamMap0.set('Summoner5',data.participants[4]);
            }else{
              teamMap1.set('baronKills',data.teams[i].baronKills);
              teamMap1.set('win', data.teams[i].win);
              // might be irrelevant might take out
              teamMap1.set('firstBaron', data.teams[i].firstBaron);
              teamMap1.set('dragonKills', data.teams[i].dragonKills);
              teamMap1.set('inhibs', data.teams[i].inhibitorKills);
              teamMap1.set('towers', data.teams[i].towerKills);
              teamMap1.set('rifts', data.teams[i].riftHeraldKills);
              teamMap1.set('firstBlood',data.teams[i].firstBlood);
              teamMap1.set('Summoner5',data.participants[5]);
              teamMap1.set('Summoner6',data.participants[6]);
              teamMap1.set('Summoner7',data.participants[7]);
              teamMap1.set('Summoner8',data.participants[8]);
              teamMap1.set('Summoner9',data.participants[9]);
            }
          }
          //getting champpion picks and turn it was picked
          console.log(teamMap0);
          console.log(teamMap1);
          console.log(data);
          gameMode = data.gameMode;
          console.log(gameMode);
          this.appendGame(nameArray,bannChampArray,gameMode,matchid, teamMap0, teamMap1,gameTime, championArray);
          console.log(gameTime);
        });
    }


    checkUserWinGame(teamMap0,teamMap1){
      var ans = '';
      console.log(this.username);

      if(teamMap1.get("username") == this.username){//background colour
        var stat = this.winStatistics.get(teamMap1.get("userChampion"));
        var prevWin = this.winStatistics.win;
        var prevLose = this.winStatistics.lose;
        if(isNaN(prevWin)){
          prevWin = 0;
        }
        if(isNaN(prevLose)){
          prevLose = 0;
        }
        if(teamMap1.get("win") == "Fail"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: black; background-color:#99ff99;'
          this.winStatistics.set( (teamMap1.get("userChampion")) , {win: prevWin, lose: (prevLose+1)});
        }else if(teamMap1.get("win") == "Win"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: black; background-color:#ff6666;'
          this.winStatistics.set( (teamMap1.get("userChampion")) , {win: (prevWin+1), lose: prevLose});
        }
      }else if(teamMap0.get("username") == this.username){
        var stat = this.winStatistics.get(teamMap0.get("userChampion"));
        var prevWin = this.winStatistics.win;
        var prevLose = this.winStatistics.lose;
        if(isNaN(prevWin)){
          prevWin = 0;
        }
        if(isNaN(prevLose)){
          prevLose = 0;
        }
        if(teamMap0.get("win") == "Fail"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: black; background-color:#99ff99;'
          this.winStatistics.set( (teamMap0.get("userChampion")) , {win: prevWin, lose: (prevLose+1)});
        }else if(teamMap0.get("win") == "Win"){
          ans = ' border-radius: 1px;border-width: medium;border-style: solid;border-color: black; background-color:#ff6666;'
          this.winStatistics.set( (teamMap0.get("userChampion")) , {win: (prevWin+1), lose: prevLose});
        }
        console.log(teamMap0);
      }
      console.log(this.winStatistics);
      return ans;
    }
    appendGame(nameArray,bannChampArray,gameMode,matchid,teamMap0, teamMap1,gameTime,championArray){
      /* TO-DO LIST
        - make a counter so we dont have duplicataes from componentDidMount
        - get icons and better organization (more divs for each player and champion)
      */
      //return, do not do this gameid
      if(this.gameID.includes(matchid)){
        return;
      }
      var information = '';
      this.setState({
        informationArray: [nameArray,bannChampArray,gameMode]
      });

      this.gameID.push(matchid);

      information = this.state.informationArray;
      var node = document.getElementById("riotGameWrapper");
      //summonernames
      var gameText = document.createElement("div");

      gameText.style.cssText = this.checkUserWinGame(teamMap0,teamMap1);

      gameText.setAttribute("id",matchid);
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

      console.log(championArray);


      //summoners names
      for(var i = 1; i < 6; i++){
        //first team (on the right)
        var summonerNameTextTeam0 = document.createElement("div");
        summonerNameTextTeam0.innerHTML = (this.getChampion(championArray[i])) + ' ' + information[0][i];
        summonerNameTextTeam0.setAttribute("id", (matchid+i));
        summonerNameTextTeam0.className = "team0";
        summonerNameTextTeam0.onclick = (function(){
          //actual information of summoner and his corresponding opponent
          var parentNodeID = document.getElementById(this.id).parentNode.id;

          if(document.getElementById(this.id).parentNode.id != summonerNameTextTeam0.parentNode.id){
            return;
          }
          console.log(document.getElementById(("team0PlayerDetails"+parentNodeID)));
          try{
            console.log(parentNodeID + " " + matchid);
            if(document.getElementById(("teamTab"+parentNodeID))){
              document.getElementById(("teamTab"+parentNodeID)).remove();
              document.getElementById(("personalTab"+parentNodeID)).remove();
              if(document.getElementById(("team1Details"+matchid))){
                document.getElementById(("team1Details"+matchid)).remove();
                document.getElementById(("team0Details"+matchid)).remove();
              }else if(document.getElementById(("team0PlayerDetails"+parentNodeID))){
                document.getElementById(("team0PlayerDetails"+parentNodeID)).remove();
                document.getElementById(("team1PlayerDetails"+parentNodeID)).remove();
              }
            }else if(document.getElementById(("teamTab1"+parentNodeID))){
              document.getElementById(("teamTab1"+parentNodeID)).remove();
              document.getElementById(("personalTab"+parentNodeID)).remove();
              if(document.getElementById(("team0PlayerDetails"+parentNodeID))){
                document.getElementById(("team0PlayerDetails"+parentNodeID)).remove();
                document.getElementById(("team1PlayerDetails"+parentNodeID)).remove();
                console.log("5")
              }
              if(document.getElementById(("team1Details"+matchid))){
                document.getElementById(("team1Details"+matchid)).remove();
                document.getElementById(("team0Details"+matchid)).remove();
                console.log("6")
              }
            }
            if(document.getElementById("firstteam0Details"+matchid) || document.getElementById("firstteam1Details"+matchid)){
              document.getElementById("firstteam0Details"+matchid).remove();
              document.getElementById("firstteam1Details"+matchid).remove();
            }
          }catch(err){
            console.log(err);
          }
          var arr = ['goldEarned','totalDamageDealtToChampions','wardsPlaced','totalMinionsKilled','totalTimeCrowdControlDealt'];
          //Tab links when information is retrieved
          var personalStatsTab = document.createElement("button");
          personalStatsTab.innerHTML = "Personal stats";
          personalStatsTab.className = "tablinks";
          personalStatsTab.setAttribute("id",("personalTab"+matchid));
          personalStatsTab.style.opacity = "0.75";
          var backgroundColorOfDiv = document.getElementById(matchid);
          personalStatsTab.onclick = (function(){
            try{
              document.getElementById("team0PlayerDetails"+matchid).style.visibility = "visible";
              //gameText.removeChild(document.getElementById("team1PlayerDetails"+matchid));
              document.getElementById("team1PlayerDetails"+matchid).style.visibility = "visible";
              //team off
              document.getElementById("team1Details"+matchid).remove();
              document.getElementById("team0Details"+matchid).remove();

              document.getElementById("personalTab"+matchid).style.opacity = 0.75;
              document.getElementById("teamTab1"+matchid).style.opacity = 0.50;
            }catch(err){
              console.log(err)
            }
          });
          //
          gameDetailsButton.before(personalStatsTab);

          var teamStatsTab = document.createElement("button");
          teamStatsTab.innerHTML = "Team stats";
          teamStatsTab.className = "tablinks";
          teamStatsTab.setAttribute("id",("teamTab1"+matchid));
          teamStatsTab.onclick = (function() {
            if(document.getElementById("team0PlayerDetails"+matchid) || (document.getElementById("team1PlayerDetails"+matchid))){
              //gameText.removeChild(document.getElementById("team0PlayerDetails"+matchid));
              document.getElementById("team0PlayerDetails"+matchid).style.visibility = "hidden";
              //gameText.removeChild(document.getElementById("team1PlayerDetails"+matchid));
              document.getElementById("team1PlayerDetails"+matchid).style.visibility = "hidden";
            }
            if(document.getElementById("team0Details"+matchid) || document.getElementById("team1Details"+matchid)){
              return;
            }else{

              var gameDetailsTextTeam0 = document.createElement("div");
              gameDetailsTextTeam0.setAttribute("id","team0Details"+matchid);
              console.log("team0Details"+matchid);
              gameDetailsTextTeam0.className = "team0DetailsVisibility";
              gameDetailsTextTeam0.style.fontSize = "10px";
              gameDetailsTextTeam0.innerHTML = "Barons: " + teamMap0.get("baronKills");
              var linebreak = document.createElement("br");
              gameDetailsTextTeam0.append(linebreak);
              gameDetailsTextTeam0.innerHTML += "Dragons: " + teamMap0.get("dragonKills");
              gameDetailsTextTeam0.append(linebreak);
              gameDetailsTextTeam0.innerHTML += "Towers: " + teamMap0.get("towers");
              gameDetailsTextTeam0.append(linebreak);
              gameDetailsTextTeam0.innerHTML += "Inhibs: " + teamMap0.get("inhibs");
              gameDetailsTextTeam0.append(linebreak);
              gameDetailsTextTeam0.innerHTML += "Heralds: " + teamMap0.get("rifts");
              gameDetailsButton.before(gameDetailsTextTeam0);


              var gameDetailsTextTeam1 = document.createElement("div");
              gameDetailsTextTeam1.setAttribute("id","team1Details"+matchid);
              gameDetailsTextTeam1.style.fontSize = "10px";
              gameDetailsTextTeam1.className = "team1DetailsVisibility";
              gameDetailsTextTeam1.innerHTML = "Barons: " + teamMap1.get("baronKills");
              var linebreak = document.createElement("br");
              gameDetailsTextTeam1.append(linebreak);
              gameDetailsTextTeam1.innerHTML += "Dragons: " + teamMap1.get("dragonKills");
              gameDetailsTextTeam1.append(linebreak);
              gameDetailsTextTeam1.innerHTML += "Towers: " + teamMap1.get("towers");
              gameDetailsTextTeam1.append(linebreak);
              gameDetailsTextTeam1.innerHTML += "Inhibs: " + teamMap1.get("inhibs");
              gameDetailsTextTeam1.append(linebreak);
              gameDetailsTextTeam1.innerHTML += "Heralds: " + teamMap1.get("rifts");
              gameDetailsButton.before(gameDetailsTextTeam1);
              teamStatsTab.style.opacity = "0.75";
              personalStatsTab.style.opacity = "0.5";
            }
          });
          gameDetailsButton.before(teamStatsTab);

          //playerDetails
          var lane = teamMap0.get('Summoner'+(this.id - parentNodeID)).timeline.lane;
          var role = teamMap0.get('Summoner'+(this.id - parentNodeID)).timeline.role;
          var linebreak = document.createElement("br");
          var summonerTeam0Clicked = teamMap0.get('Summoner'+(this.id - parentNodeID))
          var summonerTeam1Clicked = "";
          //entity that was clicked
          var clickedEntityDiv = document.createElement("div");
          clickedEntityDiv.setAttribute("id",("team0PlayerDetails"+matchid));
          clickedEntityDiv.className = "team0";
          clickedEntityDiv.style.fontSize = "10px";
          clickedEntityDiv.innerHTML = document.getElementById(this.id).innerHTML;
          clickedEntityDiv.innerHTML += " " + summonerTeam0Clicked.stats['kills'] + "/" + summonerTeam0Clicked.stats['deaths'] + "/" + summonerTeam0Clicked.stats['assists'];
          clickedEntityDiv.append(linebreak);
          if(this.className == 'team0'){
            console.log(teamMap1.get('Summoner'+(this.id - parentNodeID)));
            clickedEntityDiv.innerHTML += " " + lane + " " + role;
          }

          // matching div to compare role to role
          var matchEntityDiv = document.createElement("div");
          matchEntityDiv.setAttribute("id",("team1PlayerDetails"+matchid));
          matchEntityDiv.style.fontSize = "10px";
          matchEntityDiv.className = "team1";

          for(var xp = 5; xp < 10; xp++){
            var matchedEntityRole = teamMap1.get('Summoner'+xp).timeline.role;
            if((teamMap1.get('Summoner'+xp).timeline.role) == role && (teamMap1.get('Summoner'+xp).timeline.lane) == lane){
              summonerTeam1Clicked = teamMap1.get('Summoner'+xp);
              matchEntityDiv.innerHTML = document.getElementById(xp+matchid).innerHTML;
              matchEntityDiv.innerHTML += " " + summonerTeam1Clicked.stats['kills'] + "/" + summonerTeam1Clicked.stats['deaths'] + "/" + summonerTeam1Clicked.stats['assists'];
              matchEntityDiv.append(linebreak);
              matchEntityDiv.innerHTML += " " + (teamMap1.get('Summoner'+(xp)).timeline.lane + " " + teamMap1.get('Summoner'+(xp)).timeline.role);
            }
          }
          clickedEntityDiv.append(linebreak);

          gameDetailsButton.before(clickedEntityDiv);
          gameDetailsButton.before(matchEntityDiv);

          for (var key in summonerTeam0Clicked.stats) {
              if (summonerTeam0Clicked.stats.hasOwnProperty(key)) {
                //console.log(key, summonerTeam0Clicked.stats[key]);
                  if(arr.includes(key)){
                    var surroundningStatDiv0 = document.createElement("div");
                    surroundningStatDiv0.setAttribute = ("id",(key.toString()+parentNodeID+"team0"));
                    var surroundningStatDiv1 = document.createElement("div");
                    surroundningStatDiv1.setAttribute = ("id",(key.toString()+parentNodeID+"team1"));
                    var team0Stat = document.createElement("div");
                    var team1Stat = document.createElement("div");
                    team1Stat.style.display = "inline";
                    team0Stat.style.display = "inline";
                    var team0bar = document.createElement("div");
                    //team0bar.setAttribute("id","comparsionBar");
                    team0bar.className = "percentBar";
                    var team1bar = document.createElement("div");
                    //team1bar.setAttribute("id","comparsionBar");
                    team1bar.className = "percentBar";

                    var keyArr = key.toString().match(/[A-Z]+[^A-Z]*|[^A-Z]+/g);
                    var newKey = keyArr[0][0].toUpperCase() + keyArr[0].slice(1);
                    team0Stat.innerHTML += newKey + " " + key.toString().match(/[A-Z][a-z]+|[0-9]+/g).join(" ").toLowerCase() + " " + summonerTeam0Clicked.stats[key] + "      ";
                    team1Stat.innerHTML += newKey + " " + key.toString().match(/[A-Z][a-z]+|[0-9]+/g).join(" ").toLowerCase() + " " + summonerTeam1Clicked.stats[key] + "      ";
                    team0Stat.append(team0bar);
                    team1Stat.append(team1bar);
                    var total = (summonerTeam0Clicked.stats[key] + summonerTeam1Clicked.stats[key]);
                    var team0StatPercent = (summonerTeam0Clicked.stats[key]/total)*100;
                    var team1StatPercent = (summonerTeam1Clicked.stats[key]/total)*100;
                    team0Stat.style.width = team0StatPercent.toString() + "%";
                    team1Stat.style.width = team1StatPercent.toString() + "%";
                    if(team0StatPercent > team1StatPercent){
                      team0bar.style.backgroundColor = "green";
                      team1bar.style.backgroundColor = "red";
                      team0bar.innerHtml = (team0StatPercent-team1StatPercent) + "%";
                    }else{
                      team0bar.style.backgroundColor = "red";
                      team1bar.style.backgroundColor = "green";
                      team1bar.innerHtml = (team1StatPercent-team0StatPercent) + "%";
                    }
                    if(clickedEntityDiv.className == "team1"){
                      surroundningStatDiv1.append(team1Stat);
                      surroundningStatDiv0.append(team0Stat);
                      clickedEntityDiv.append(surroundningStatDiv1);
                      matchEntityDiv.append(surroundningStatDiv0);
                    }else{
                      surroundningStatDiv1.append(team1Stat);
                      surroundningStatDiv0.append(team0Stat);
                      clickedEntityDiv.append(surroundningStatDiv0);
                      matchEntityDiv.append(surroundningStatDiv1);
                    }

                  }
              }
          }
          gameDetailsButton.style.visibility = "visible";
        });

        appendNode.appendChild(summonerNameTextTeam0);

        var summonerNameTextTeam1 = document.createElement("div");
        summonerNameTextTeam1.setAttribute("id",(matchid+(i+5)));
        summonerNameTextTeam1.className = "team1";
        summonerNameTextTeam1.innerHTML = (this.getChampion(championArray[i+5])) + ' ' + information[0][i+5];
        //function for left side
        /*
        =====
        =====
        =====
        */
        summonerNameTextTeam1.onclick = (function(){
          //actual information of summoner and his corresponding opponent
          var parentNodeID = document.getElementById(this.id).parentNode.id;

          if(document.getElementById(this.id).parentNode.id != summonerNameTextTeam1.parentNode.id){
            return;
          }
          console.log(document.getElementById(("team0PlayerDetails"+parentNodeID)));
          if(document.getElementById("team1PlayerDetails"+matchid)){
            document.getElementById("team1PlayerDetails"+matchid).remove();
            document.getElementById("team0PlayerDetails"+matchid).remove();
            if(document.getElementById("teamTab"+matchid)){
              document.getElementById("teamTab"+matchid).remove();
              document.getElementById("personalTab"+matchid).remove()
            }
            if(document.getElementById("teamTab1"+matchid)){
              document.getElementById("teamTab1"+matchid).remove();
              document.getElementById("personalTab"+matchid).remove()
            }
            if(document.getElementById("team1Details"+matchid)){
              document.getElementById("team1Details"+matchid).remove();
              document.getElementById("team0Details"+matchid).remove();
            }
          }
          try{
            document.getElementById(("team0PlayerDetails"+parentNodeID)).remove();
            document.getElementById(("team1PlayerDetails"+parentNodeID)).remove();
            document.getElementById(("teamTab"+parentNodeID)).remove();
            document.getElementById(("personalTab"+parentNodeID)).remove();
            document.getElementById(("team1Details"+parentNodeID)).remove();
            document.getElementById(("team0Details"+parentNodeID)).remove();
          }catch(err){
            console.log(err);
          }

          var arr = ['goldEarned','totalDamageDealtToChampions','wardsPlaced','totalMinionsKilled', 'totalTimeCrowdControlDealt','wardsPlaced','damageSelfMitigated'];
          //Tab links when information is retrieved
          var personalStatsTab = document.createElement("button");
          personalStatsTab.innerHTML = "Personal stats";
          personalStatsTab.className = "tablinks";
          personalStatsTab.setAttribute("id",("personalTab"+matchid));
          personalStatsTab.style.opacity = "0.75";
          var backgroundColorOfDiv = document.getElementById(matchid);
          personalStatsTab.onclick = (function(){
            try{
              document.getElementById("team0PlayerDetails"+matchid).style.visibility = "visible";
              //gameText.removeChild(document.getElementById("team1PlayerDetails"+matchid));
              document.getElementById("team1PlayerDetails"+matchid).style.visibility = "visible";
              //team off
              if(document.getElementById("team1Details"+matchid)){
                document.getElementById("team1Details"+matchid).remove();
                document.getElementById("team0Details"+matchid).remove();
              }
              if(document.getElementById("firstteam1Details"+matchid)){
                document.getElementById("firstteam0Details"+matchid).remove();
                document.getElementById("firstteam1Details"+matchid).remove();
              }
              document.getElementById("personalTab"+matchid).style.opacity = 0.75;
              document.getElementById("teamTab"+matchid).style.opacity = 0.50;
            }catch(err){
              console.log(err)
            }
          });
          //
          gameDetailsButton.before(personalStatsTab);

          var teamStatsTab1 = document.createElement("button");
          teamStatsTab1.innerHTML = "Team stats";
          teamStatsTab1.className = "tablinks";
          teamStatsTab1.setAttribute("id",("teamTab"+matchid));
          teamStatsTab1.onclick = (function() {
            if(document.getElementById("firstteam0Details"+matchid)){
              document.getElementById("firstteam0Details"+matchid).remove();
              document.getElementById("firstteam1Details"+matchid).remove();
            }
            document.getElementById("team0PlayerDetails"+matchid).style.visibility = "hidden";
            document.getElementById("team1PlayerDetails"+matchid).style.visibility = "hidden";
            var gameDetailsTextTeam01 = document.createElement("div");
            gameDetailsTextTeam01.setAttribute("id","firstteam0Details"+matchid);
            gameDetailsTextTeam01.className = "team0DetailsVisibility";
            gameDetailsTextTeam01.style.fontSize = "10px";
            var linebreak = document.createElement("br");
            gameDetailsTextTeam01.innerHTML = "Barons: " + teamMap1.get("baronKills");
            gameDetailsTextTeam01.append(linebreak);
            gameDetailsTextTeam01.innerHTML += "Dragons: " + teamMap1.get("dragonKills");
            gameDetailsTextTeam01.append(linebreak);
            gameDetailsTextTeam01.innerHTML += "Towers: " + teamMap1.get("towers");
            gameDetailsTextTeam01.append(linebreak);
            gameDetailsTextTeam01.innerHTML += "Inhibs: " + teamMap1.get("inhibs");
            gameDetailsTextTeam01.append(linebreak);
            gameDetailsTextTeam01.innerHTML += "Heralds: " + teamMap1.get("rifts");

            var gameDetailsTextTeam11 = document.createElement("div");
            gameDetailsTextTeam11.setAttribute("id","firstteam1Details"+matchid);
            gameDetailsTextTeam11.style.fontSize = "10px";
            gameDetailsTextTeam11.className = "team1DetailsVisibility";
            gameDetailsTextTeam11.innerHTML = "Barons: " + teamMap1.get("baronKills");
            gameDetailsTextTeam11.append(linebreak);
            gameDetailsTextTeam11.innerHTML += "Dragons: " + teamMap1.get("dragonKills");
            gameDetailsTextTeam11.append(linebreak);
            gameDetailsTextTeam11.innerHTML += "Towers: " + teamMap1.get("towers");
            gameDetailsTextTeam11.append(linebreak);
            gameDetailsTextTeam11.innerHTML += "Inhibs: " + teamMap1.get("inhibs");
            gameDetailsTextTeam11.append(linebreak);
            gameDetailsTextTeam11.innerHTML += "Heralds: " + teamMap1.get("rifts");
            gameDetailsButton.before(gameDetailsTextTeam11);
            teamStatsTab1.style.opacity = "0.75";
            personalStatsTab.style.opacity = "0.5";
            gameDetailsButton.before(gameDetailsTextTeam01);

          });
          gameDetailsButton.before(teamStatsTab1);
          console.log(this.id-parentNodeID);
          var lane = teamMap1.get('Summoner'+((this.id - parentNodeID)-1)).timeline.lane;
          var role = teamMap1.get('Summoner'+((this.id - parentNodeID)-1)).timeline.role;
          var linebreak = document.createElement("br");
          var summonerTeam0Clicked = teamMap1.get('Summoner'+((this.id - parentNodeID)-1))
          var summonerTeam1Clicked = "";
          var clickedEntityDiv = document.createElement("div");
          clickedEntityDiv.setAttribute("id",("team1PlayerDetails"+matchid));
          clickedEntityDiv.className = "team1";
          clickedEntityDiv.style.fontSize = "10px";
          clickedEntityDiv.innerHTML = document.getElementById(this.id).innerHTML;
          clickedEntityDiv.innerHTML += " " + summonerTeam0Clicked.stats['kills'] + "/" + summonerTeam0Clicked.stats['deaths'] + "/" + summonerTeam0Clicked.stats['assists'];
          clickedEntityDiv.append(linebreak);

          var matchEntityDiv = document.createElement("div");
          matchEntityDiv.setAttribute("id",("team0PlayerDetails"+matchid));
          matchEntityDiv.style.fontSize = "10px";
          matchEntityDiv.className = "team1";

          for(var xp = 1; xp < 6; xp++){
            var matchedEntityRole = teamMap0.get('Summoner'+xp).timeline.role;
            if((teamMap0.get('Summoner'+xp).timeline.role) == role && (teamMap0.get('Summoner'+xp).timeline.lane) == lane){
              summonerTeam1Clicked = teamMap0.get('Summoner'+xp);
              matchEntityDiv.innerHTML = document.getElementById(xp+matchid).innerHTML;
              matchEntityDiv.innerHTML += " " + summonerTeam1Clicked.stats['kills'] + "/" + summonerTeam1Clicked.stats['deaths'] + "/" + summonerTeam1Clicked.stats['assists'];
              matchEntityDiv.append(linebreak);
              matchEntityDiv.innerHTML += " " + (teamMap0.get('Summoner'+(xp)).timeline.lane + " " + teamMap0.get('Summoner'+(xp)).timeline.role);
            }
          }
          clickedEntityDiv.append(linebreak);
          if(this.className == 'team1'){
            console.log(teamMap1.get('Summoner'+(this.id - parentNodeID)));
            clickedEntityDiv.innerHTML += " " + lane + " " + role;
          }

          gameDetailsButton.before(clickedEntityDiv);
          gameDetailsButton.before(matchEntityDiv);
          var arr = ['goldEarned','totalDamageDealtToChampions','wardsPlaced','totalMinionsKilled', 'totalTimeCrowdControlDealt','wardsPlaced','damageSelfMitigated'];

          for (var key in summonerTeam0Clicked.stats) {
              if (summonerTeam0Clicked.stats.hasOwnProperty(key)) {
                //console.log(key, summonerTeam0Clicked.stats[key]);
                  if(arr.includes(key)){
                    var surroundningStatDiv0 = document.createElement("div");
                    surroundningStatDiv0.setAttribute = ("id",(key.toString()+parentNodeID+"team0"));
                    var surroundningStatDiv1 = document.createElement("div");
                    surroundningStatDiv1.setAttribute = ("id",(key.toString()+parentNodeID+"team1"));
                    var team0Stat = document.createElement("div");
                    var team1Stat = document.createElement("div");
                    team1Stat.style.display = "inline";
                    team0Stat.style.display = "inline";
                    var team0bar = document.createElement("div");
                    //team0bar.setAttribute("id","comparsionBar");
                    team0bar.className = "percentBar";
                    var team1bar = document.createElement("div");
                    //team1bar.setAttribute("id","comparsionBar");
                    team1bar.className = "percentBar";
                    var keyArr = key.toString().match(/[A-Z]+[^A-Z]*|[^A-Z]+/g);
                    var newKey = keyArr[0][0].toUpperCase() + keyArr[0].slice(1);
                    team0Stat.innerHTML += newKey + " " + key.toString().match(/[A-Z][a-z]+|[0-9]+/g).join(" ").toLowerCase() + " " + summonerTeam0Clicked.stats[key] + "      ";
                    team1Stat.innerHTML += newKey + " " + key.toString().match(/[A-Z][a-z]+|[0-9]+/g).join(" ").toLowerCase() + " " + summonerTeam1Clicked.stats[key] + "      ";
                    team0Stat.append(team0bar);
                    team1Stat.append(team1bar);
                    var total = (summonerTeam0Clicked.stats[key] + summonerTeam1Clicked.stats[key]);
                    var team0StatPercent = (summonerTeam0Clicked.stats[key]/total)*100;
                    var team1StatPercent = (summonerTeam1Clicked.stats[key]/total)*100;
                    team0Stat.style.width = team0StatPercent.toString() + "%";
                    team1Stat.style.width = team1StatPercent.toString() + "%";
                    if(team0StatPercent > team1StatPercent){
                      team0bar.style.backgroundColor = "green";
                      team1bar.style.backgroundColor = "red";
                      team0bar.innerHtml = (team0StatPercent-team1StatPercent) + "%";
                    }else{
                      team0bar.style.backgroundColor = "red";
                      team1bar.style.backgroundColor = "green";
                      team1bar.innerHtml = (team1StatPercent-team0StatPercent) + "%";
                    }
                    if(clickedEntityDiv.className == "team1"){
                      surroundningStatDiv1.append(team1Stat);
                      surroundningStatDiv0.append(team0Stat);
                      clickedEntityDiv.append(surroundningStatDiv1);
                      matchEntityDiv.append(surroundningStatDiv0);
                    }else{
                      surroundningStatDiv1.append(team1Stat);
                      surroundningStatDiv0.append(team0Stat);
                      clickedEntityDiv.append(surroundningStatDiv0);
                      matchEntityDiv.append(surroundningStatDiv1);
                    }

                  }
              }
          }
          gameDetailsButton.style.visibility = "visible";
        });

        appendNode.appendChild(summonerNameTextTeam1);
      }
      //champion banns (null if none)
      var bannTeam0Text = document.createElement("div");
      bannTeam0Text.setAttribute("id", "team0");
      if(information[1][1] != undefined){
        var team0Banns = information[1][1] + "," + information[1][2] + "," + information[1][3]+ "," + information[1][4]+ "," + information[1][5];
        bannTeam0Text.innerHTML = team0Banns;
        var bannTeam1Text = document.createElement("div");
        bannTeam1Text.setAttribute("id", "team1");
        var team1Banns = information[1][6] + "," + information[1][7] + "," + information[1][8]+ "," + information[1][9]+ "," + information[1][10];
        bannTeam1Text.innerHTML = team1Banns;
        appendNode.appendChild(bannTeam0Text);
        appendNode.appendChild(bannTeam1Text);
      }

      var gameDetailsButton = document.createElement("Button");
      gameDetailsButton.setAttribute("id","expandButton");
      gameDetailsButton.innerHTML = "x";
      if(!(document.getElementById("personalStatsTab"+matchid))){
        gameDetailsButton.style.visibility = "hidden";
      }

      gameDetailsButton.onclick = (function() {
        try{
          var parentNodeID = document.getElementById(this.id).parentNode.id;
          console.log(matchid);
          if(document.getElementById("team1Details"+matchid)){
            document.getElementById("team1Details"+matchid).remove();
            document.getElementById("team0Details"+matchid).remove();
          }
          if(document.getElementById("personalTab"+matchid)){
            document.getElementById("personalTab"+matchid).remove();
          }
          if(document.getElementById("teamTab"+matchid)){
            document.getElementById("teamTab"+matchid).remove();
          }
          if(document.getElementById("teamTab1"+matchid)){
            document.getElementById("teamTab1"+matchid).remove();
          }
          if(document.getElementById("team0PlayerDetails"+matchid)){
            document.getElementById("team0PlayerDetails"+matchid).remove();
            document.getElementById("team1PlayerDetails"+matchid).remove();
          }
          if(document.getElementById("firstteam0Details"+matchid)){
            document.getElementById("firstteam0Details"+matchid).remove();
            document.getElementById("firstteam1Details"+matchid).remove();
          }
        }catch(err){
            console.log(err);
        }
        gameDetailsButton.style.visibility = "hidden";
      });
        var lineBreak = document.createElement("br");
        gameText.append(gameDetailsButton);
        node.appendChild(lineBreak);
        node.appendChild(lineBreak);
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
