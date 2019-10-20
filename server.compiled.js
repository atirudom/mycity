// Include the cluster module
var cluster = require('cluster');

// Include random function for ID
const uuidv4 = require('uuid/v4');

// Code to run if we're in the master process
if (cluster.isMaster) {

  // Count the machine's CPUs
  var cpuCount = require('os').cpus().length;

  // Create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  // Listen for terminating workers
  cluster.on('exit', function (worker) {

    // Replace the terminated workers
    console.log('Worker ' + worker.id + ' died :(');
    cluster.fork();
  });

  // Code to run if we're in a worker process
} else {
  var AWS = require('aws-sdk');
  var express = require('express');
  var bodyParser = require('body-parser');

  AWS.config.region = process.env.REGION;

  var sns = new AWS.SNS();
  var ddb = new AWS.DynamoDB();
  var docClient = new AWS.DynamoDB.DocumentClient();

  var ddbTable = process.env.NEWS_TABLE;
  var snsTopic = process.env.NEW_SIGNUP_TOPIC;
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(require("body-parser").json());
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
  });

  app.get('/api/news', (req, res) => {
    docClient.scan({
      'TableName': ddbTable
    }, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.Items);
        data.Items.forEach(function (element, index, array) {
          console.log(element);
        });
        res.json(data.Items);
      }
    });

    var params = {
      Destination: { /* required */
        ToAddresses: ['atirach.intaraudom@gmail.com']
      },
      Message: { /* required */
        Body: { /* required */
          Html: {
            Charset: "UTF-8",
            Data: "HTML_FORMAT_BODY"
          },
          Text: {
            Charset: "UTF-8",
            Data: "TEXT_FORMAT_BODY"
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email'
        }
      },
      Source: 'atirach.int@gmail.com' /* required */
    };

    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    sendPromise.then(function (data) {
      console.log(data.MessageId);
    }).catch(function (err) {
      console.error(err, err.stack);
    });
    // snippet-end:[ses.JavaScript.email.sendEmail]
  });

  app.post('/api/addnews', (req, res) => {
    console.log(process.env.NEWS_TABLE + " " + process.env.STARTUP_SIGNUP_TABLE);
    console.log('ADDING MARKERS');
    console.log(req.body);

    const id = uuidv4();

    var item = {
      'id': { 'S': id },
      'city': { 'S': req.body.city },
      'type': { 'S': req.body.type },
      'fromtime': { 'S': req.body.time[0] },
      'totime': { 'S': req.body.time[1] },
      'topic': { 'S': req.body.topic },
      'description': { 'S': req.body.description },
      'address': { 'S': req.body.address },
      'locationLat': { 'S': req.body.location.lat.toString() },
      'locationLng': { 'S': req.body.location.lng.toString() }
    };

    console.log("NAME: ", item.topic);

    ddb.putItem({
      'TableName': ddbTable,
      'Item': item,
      'Expected': { email: { Exists: false } }
    }, function (err, data) {
      if (err) {
        var returnStatus = 500;

        if (err.code === 'ConditionalCheckFailedException') {
          returnStatus = 409;
        }

        res.status(returnStatus).end();
        console.log('DDB Error: ' + err);
      } else {
        sns.publish({
          'Message': 'Name: ' + req.body.topic + "\r\nAddress: " + req.body.address + "\r\nPreview: " + req.body.description,
          'Subject': 'Recent News Created !! - MyCity Assignment2',
          'TopicArn': snsTopic
        }, function (err, data) {
          if (err) {
            res.status(500).end();
            console.log('SNS Error: ' + err);
          } else {
            res.status(201).end();
          }
        });
      }
    });
  });

  app.get('/api/test', (req, res) => {
    const customers = [{ id: 1, firstName: 'John', lastName: 'Doe' }, { id: 2, firstName: 'Brad', lastName: 'Traversy' }, { id: 3, firstName: 'Mary', lastName: 'SwansonLocalServer' }];

    res.json(customers);
  });

  app.post('/signup', function (req, res) {
    console.log(req.body);
    var item = {
      'email': { 'S': req.body.email },
      'name': { 'S': req.body.name },
      'preview': { 'S': req.body.previewAccess },
      'theme': { 'S': req.body.theme }
    };

    console.log("NAME: ", item.name);

    ddb.putItem({
      'TableName': ddbTable,
      'Item': item,
      'Expected': { email: { Exists: false } }
    }, function (err, data) {
      if (err) {
        var returnStatus = 500;

        if (err.code === 'ConditionalCheckFailedException') {
          returnStatus = 409;
        }

        res.status(returnStatus).end();
        console.log('DDB Error: ' + err);
      } else {
        sns.publish({
          'Message': 'Name: ' + req.body.name + "\r\nEmail: " + req.body.email + "\r\nPreviewAccess: " + req.body.previewAccess + "\r\nTheme: " + req.body.theme,
          'Subject': 'New user sign up!!!',
          'TopicArn': snsTopic
        }, function (err, data) {
          if (err) {
            res.status(500).end();
            console.log('SNS Error: ' + err);
          } else {
            res.status(201).end();
          }
        });
      }
    });
  });

  const port = 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
