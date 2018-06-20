var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var dbConn = mongodb.MongoClient.connect('mongodb://localhost:27017/Assignment');

var app = express();
console.log("Connection established");

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.static(path.resolve(__dirname, '/Users/nayanakamerkar/assignment/mongodb/form')));

app.post('/post-data', function (req, res) {
    dbConn.then(function(db) {
        console.log("Post Req");
       // delete req.body._id; // for safety reasons
        db.collection('Users').insert(req.body);
    });    
    res.send('Data received:\n' + JSON.stringify(req.body));
});

// app.get('/view-data',  function(req, res) {
//     dbConn.then(function(db) {
//         db.collection('Users').find({}).toArray().then(function(Users) {
//             res.status(200).json(Users);
//         });
//     });
// });

// app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0' );
app.listen(3000);