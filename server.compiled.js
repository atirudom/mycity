// Include the cluster module
var cluster = require('cluster');

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

  var ddbTable = process.env.STARTUP_SIGNUP_TABLE;
  var snsTopic = process.env.NEW_SIGNUP_TOPIC;
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('/api/customers', (req, res) => {
    const customers = [{ id: 1, firstName: 'John', lastName: 'Doe' }, { id: 2, firstName: 'Brad', lastName: 'Traversy' }, { id: 3, firstName: 'Mary', lastName: 'Swanson' }];

    res.json(customers);
  });

  app.post('/signup', function (req, res) {
    var item = {
      'email': { 'S': req.body.email },
      'name': { 'S': req.body.name },
      'preview': { 'S': req.body.previewAccess },
      'theme': { 'S': req.body.theme }
    };

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
