var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {
	res.send('Hello World');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'this_is_a_sample_token') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

var token = "EAAWiPbHonE8BABa1u7ozx5lZB1MZC8c6ZBYmwYeOrg04ZC0QqKkkiWAOyZCMigxZAmLZABOnJgi3ZC9NSSVZA1MZCrZCfuOwWD55dXAhIy28FTahAMZCXhtw0rwtcOFAWnrRKANiPa9vSmy41TCbMpsAuALJjxWG7CMPgH2aZBlA3jSEDZCQZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    console.log(sender);
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text);
      sendTextMessage(sender, "Echoing text: "+ text);
    }
  }
  res.sendStatus(200);
});



app.listen(app.get('port'), function(){
	console.log('Example app listening on port 3000!');
});