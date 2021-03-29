const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');



const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
  const first = req.body.firstName;
  const second = req.body.secondName;
  const ema = req.body.ema;

  const data = {
    members: [{
      email_address: ema,
      status: 'subscribed',
      merge_fields: {
        FNAME: first,
        LNAME: second
      }
    }]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us1.api.mailchimp.com/3.0/lists/7e7a350ee1";
  const options = {
    method: 'POST',
    auth: 'nikh:c893584f04f028bf933aac2fb6ef3bcb-us1'
  }
  const request = https.request(url, options, function(respo) {
    if (respo.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
    respo.on('data', function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
app.post('/failure', function(req, res) {
  res.redirect('/');
});
app.listen(process.env.PORT || 3000, function() {
  console.log('server is running on 3000');
});
//
// ab2c10993b6e92d95f4630b337002a7f-us1
//list id 7e7a350ee1
