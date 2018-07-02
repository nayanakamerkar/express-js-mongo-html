function postRequest(url,data,cb){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    // console.log("new http request");
    if(this.readyState == 4){
      cb(this.status,xmlhttp.responseText);
      // return data;
    }
  }
  xmlhttp.open("POST", url);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(JSON.stringify(data));
}



function getRequest(url,cb){
  console.log("getRequest",url);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function(){
    // console.log("new http request");
    if(this.readyState == 4){
      // console.log(this.status,xmlhttp.responseText);
      cb(this.status,xmlhttp.responseText);
      // return data;
    }
  }
  xmlhttp.open("GET", url);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send();
}