var fs = require('fs');
var _ = require('lodash');
var Twit = require('twit');

var config = require('./config.js')

var T = new Twit(config);

var max_id = null;

var allTweets = [];

function getPage(max_id, page){
    console.log("getPage called for page: ", page);
    console.log("max_id", max_id);
    if(page >= 20)
    {
        return finish();
    }

    var opts = { q: 'srccon', count: 100};
    if(max_id)
    {
        opts.max_id = max_id;
    }

    T.get('search/tweets', opts, function(err, data, response) {
        if(err)
        {
            console.log('err', err);
            console.log('data', data);
            return;
        }
        _.forEach(data.statuses, function (tweet){
            max_id = tweet.id;
            allTweets.push(tweet);
        });

        setTimeout(function(){
            getPage(max_id, page + 1);
        }, 500);
        console.log(data.statuses.length);
    });
}

function finish(){
    var json = JSON.stringify(allTweets, null, 4);

    fs.writeFile("./srccon-tweets.json", json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
}

getPage(null, 0);