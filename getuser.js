const express = require('express');
const app = express();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Assignment");

  app.use(function (req, res, next) {
	    // Website you wish to allow to connect
	    if(req.headers.origin)
	    {
	    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	    res.setHeader('Access-Control-Allow-Credentials', true);
	    }
	    next();
  });
  

  app.get('/', (req, res) => {
	res.send("Hello World!");
  })

  app.get('/users', (req, res) => {
  	console.log("req.query", req.query);
  	console.log("req.body", req.body);


  	dbo.collection("Users").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    console.log(result);
	    var myjson=JSON.stringify(result);
	    res.send(myjson);
	});
  });


app.get('/city', (req, res) => {
  	dbo.collection("City").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    console.log(result);
	    var myjson2=JSON.stringify(result);
	    res.send(myjson2);
	});
  });

app.get('/state', (req, res) => {
  	dbo.collection("State").find({}).toArray(function(err, result) {
	    if (err) throw err;
	    console.log(result);
	    var myjson1=JSON.stringify(result);
	    res.send(myjson1);
	});
  });
app.get('/usercity',(req,res)=>{
	dbo.collection("Users".find().limit(c).toArray(function(err,result){
		if(err) throw err;
		console.log(result);
	});
});




  app.listen(3000, () => console.log('Example app listening on port 3000!'))
});

/*var server = app.listen(3000, function() {}); 
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/name ', (req, res) => res.send('Hello World!'))*/


