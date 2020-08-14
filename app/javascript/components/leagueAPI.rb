# first dpi class
require 'net/http'
require 'json'
require 'date'
=begin
#champmastery
champion
leaguev4
matchv4
specv4
summonerv4
=end
#API key
apiKey = 'RGAPI-e1a3ef79-7c05-43bc-b37f-280c0d9fc104'

def get_resposne(uri)
  response = Net::HTTP.get(uri)
  #parse the json
  rBody = JSON.parse(response)
  return rBody
end

def seconds_to_hrs(sec)
  return [sec / 3600, sec / 60 % 60, sec % 60].map{|t| t.to_s.rjust(2,'0')}.join(':')
end

def get_champion(champID)
  url = 'http://ddragon.leagueoflegends.com/cdn/9.18.1/data/en_US/champion.json'
  uri = URI(url)
  champJSON = get_resposne(uri)
  champJSON["data"].each do |obj| #iterate through each instance of data
    obj.each do |info| #iterate through each data
      if info["key"] == champID.to_s #check if the key matches the number
        #p info["id"] # return the name of the chammpion
        return info["id"]
      end
    end
  end
end


def match_history_api1(summonerID,apiKey)
  url = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/'
  url = url + summonerID + '?api_key=' + apiKey
  uri = URI(url)
  rBody = get_resposne(uri)

  rBody['matches'].each_with_index do |match, idx|
    p match
    champID = Integer(match["champion"])
    champStr = get_champion(champID)
    p champStr
    p "=============================================================================="
  end
end

def getRole(stringRole)
  roles = ["DUO_SUPPORT"]
end

class Summoner
  @@no_of_summoner = 1
  def api_path(apiKey)
    summName = 'ikiray'
    #for league, not available for valorant right now ;-;
    base = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'
    #https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/ikiray?api_key=RGAPI-12c10987-8dcf-4558-b36d-aaee3e06a12a
    url = base + summName + '?api_key=' + apiKey
    #get url
    uri = URI(url)
    rBody = get_resposne(uri)

    #setting variables
    @summ_id = rBody['id']
    @summ_accountId = rBody['accountId']
    @summ_puuid = rBody['puuid']
    @summ_name = rBody['name']
    @summ_level = rBody['summonerLevel']
    p @summ_id, @summ_accountId, @summ_name
    match_history_api(@summ_accountId,apiKey)
  end
  # match api
  def match_history_api(summonerID,apiKey)
    url = 'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/'
    url = url + summonerID + '?api_key=' + apiKey
    uri = URI(url)
    rBody = get_resposne(uri)

    rBody['matches'].each_with_index do |match, idx|
      gameID = match["gameId"]
      gameAPI(gameID,apiKey)
      champID = Integer(match["champion"])
      champStr = get_champion(champID)

      if match["lane"] == "NONE"
        role = match["role"]
      else
        role = match["lane"]
      end

      p role
      p champStr
      p "=============================================================================="
      break
    end
  end
  # game api
  def gameAPI(gameID,apiKey)
    url = 'https://na1.api.riotgames.com/lol/match/v4/matches/'
    url = url + gameID.to_s + '?api_key=' + apiKey
    uri = URI(url)

    rBody = get_resposne(uri)
    rBody['participantIdentities'].each_with_index do |player, idx|
      p player['player']['summonerName']
    end
    p "duration: " + seconds_to_hrs(rBody['gameDuration'])
    p rBody['gameMode']
    p rBody['gameType']
  end
end

summ1 = Summoner.new
summ1.api_path(apiKey)


'https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/QuVj_vcJ6JSmx17moVJgTAzkwoHbPFSOSg7rfa-6Q3OExg?api_key=RGAPI-12c10987-8dcf-4558-b36d-aaee3e06a12a'
