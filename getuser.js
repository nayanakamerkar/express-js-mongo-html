const express = require('express');
const app = express();
var mongodb=require('mongodb');
var bodyParser = require('body-parser');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) 
{
  if (err) throw err;
    var dbo = db.db("Assignment");

  app.use(bodyParser.json());
  //app.use(bodyParser.urlencoded({ extended: false }));

  app.use(function (req, res, next)
   {
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

  app.get('/', (req, res) => 
  {
  	res.send("Hello World!");
  });

  app.get('/users', (req, res) => {
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

  app.get('/states', (req, res) => {
    	dbo.collection("State").find({}).toArray(function(err, result) {
  	    if (err) throw err;
  	    console.log(result);
  	    var myjson1=JSON.stringify(result);
  	    res.send(myjson1);
  	});
  });

  app.get('/count', (req, res) => {
  	//console.log("req.query", req);

    	console.log("req.body", res);
    dbo.collection("Users").find().limit(1).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      var myjson3=JSON.stringify(result);
  	    res.send(myjson3);
    });
  });

  app.post('/cityselect',(req,res)=> {
      var body = req.body;

      console.log("body =", body);
      if(!body.cname){
        res.send(JSON.stringify({ mess: "cname parameter missing"}));
      }
      else{
        dbo.collection("Users").find({city: body.cname }).toArray(function(err,result){
          if(err) throw err;
          console.log(result);
          var myjson4=JSON.stringify(result);
            res.send(myjson4);
        });
      }
    });
  // app.post('/citydata',function(req,res){
  //   var body3=req.body;
  //   console.log("body=",body3);
  //   if(!body3._id)
  //   {
  //     res.send(JSON.stringify({message:"parameter missing"}));
  //   }
  //   else
  //   {
  //     dbo.collection("City").find({sid: new mongodb.ObjectID(body3._id)}).toArray(function(err,result)
  //     {
  //         if(err) throw err;
  //         console.log(result);
  //         var json6=JSON.stringify(result);
  //         console.log(json6);
  //         res.send(json6);

  //     });
  //   }
  // });

  app.post('/citydata', function (req, res)
 {
  var body1 = req.body;
  console.log(body1._id);
  if(!body1._id)
  {
      res.send(JSON.stringify({ mess: " parameter missing"}));
    }
    else
    {
      dbo.collection("City").find({sid: new mongodb.ObjectID(body1._id)}).toArray(function(err,result)
      {
        if(err) throw err;
        var myjson4=JSON.stringify(result);
        console.log(myjson4);
        res.send(myjson4);
     
       });

    }

});


  app.post('/insert', function (req, res) {
    var body1 = req.body;
      // for safety reasons
      console.log("body =", body1);
      if(!body1.name|| !body1.mobile || !body1.address || !body1.city || !body1.state || !body1.gender){
        res.send(JSON.stringify({ mess: " parameter missing"}));
      }   
      else{
        dbo.collection("Users").insertOne(body1,function(err,result){
          if(err) throw err;
          console.log(result);
          var myjson4=JSON.stringify(result.insertedId);
            res.send(myjson4);
        });
       }
    });

  app.post('/delete', function (req, res) {
    var body2 = req.body;
      // for safety reasons
      console.log("body =", body2);
      if(!body2._id){
        res.send(JSON.stringify({ mess: " parameter missing"}));
      }   
      else{
        console.log("body =", body2._id);
        dbo.collection("Users").deleteOne({_id: new mongodb.ObjectID(body2._id)},function(err,result){
          if(err) throw err;
          console.log("document deleted");
        });
       }
    });

  app.post('/update', function (req, res) {
    var body1 = req.body;    
    var body2 = body1._id;
    console.log(body2);
    delete body1._id;
    newquery = { $set: body1 }
    console.log(new mongodb.ObjectID(body2));
    dbo.collection('Users').updateOne({ _id: new mongodb.ObjectID(body2)},newquery,function(err,result){
      if(err) throw err;
      console.log("document updated");
      var json5=JSON.stringify(result);
      console.log(json5);
      });
  });



    app.listen(3000, () => console.log('Example app listening on port 3000!'))
  });

  