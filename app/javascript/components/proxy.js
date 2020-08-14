const proxy = require("http-proxy-middleware")

module.exports = function(app){
  app.use(
    proxy("/lol/summoner/v4/summoners/by-name/ikiray?api_key=RGAPI-980f99ea-422b-4144-a4b4-b198c1ffa4e6",{
      target: "https://https://na1.api.riotgames.com/",
      changeOrigin: true
    })
  )
};
