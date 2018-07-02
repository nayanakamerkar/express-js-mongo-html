function onreset()
{
	document.getElementById("name").value="";
	document.getElementById("mobile").value="";
	document.getElementById("address").value="";
	document.getElementById("state").value="-1";
	document.getElementById("city-data").style.visibility="hidden";
	document.getElementById("save").style.visibility="hidden";
	document.getElementById("submit").style.visibility="visible";
}
function onselectstate()											//to show cities according to selected state
{
	document.getElementById("city-data").style.visibility="visible";
  var myData1={};
  var option = document.getElementById("state");
  var my = option.options[option.selectedIndex];
  console.log(my);
  myData1._id = my.getAttribute("oid");
  //myData1 =  document.getElementById("state").value;
  console.log(myData1._id);
  postRequest("http://localhost:3000/citydata",myData1,function(status,responseText){
    if(status == 200){
      try{
        //console.log("response");
        console.log(JSON.stringify(myData1));
        var respObj2 = JSON.parse(responseText);
         var list2="<select class=\"col-sm-10 form-control\" name=\"city\"  id=\"city\">";
         list2+="<option value=\"-1\">Select city</option>";
         for(var i = 0; i < respObj2.length; i++)
          {
           list2+="<option oid=\""+respObj2[i]._id+"\" value=\""+respObj2[i].name+"\">"+respObj2[i].name+"</option>";  
          }
         list2+="</select>";
         document.getElementById("city-data").innerHTML = list2;
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }
  });
}
  
function onDeleteClick(self)							//to delete data 				
{
	//console.log("onDeleteClick this", this);
	var myData1={};
  var row=document.getElementById("table");
	 myData1._id=self.getAttribute("oid");
   console.log("myData1",myData1);
   
  //row.deleteRow(self.parentNode.parentNode.rowIndex);
  postRequest("http://localhost:3000/delete",myData1,function(status,responseText){
    if(status == 200){
      try{
        
        row.deleteRow(self.parentNode.parentNode.rowIndex);
        console.log("deleted");
        console.log(JSON.stringify(myData1));
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }
  });
	
}

function formValidation(){
  console.log("Form validation");
  var name = document.getElementById('name').value;
  var mobile = document.getElementById('mobile').value;
  var address = document.getElementById('address').value;
  var state = document.getElementById("state").value;
  var city = document.getElementById("city") ? document.getElementById("city").value : -1;
  var myData = {};
  if(inputAlphabet(name)){
    myData.name = name;
  }else{
    document.getElementById('p3').innerText = "* For your name please use alphabets only *";
    return false;
  }

  if(inputNumber(mobile)){
    myData.mobile = mobile;
  }else{
    document.getElementById('p3').innerText = "*Invalid mobile number*";
    return false;
  }

  if(inputAddress(address)){
    myData.address = address;
  }else{
    document.getElementById('p3').innerText = "* Please enter Address *";
    return false;
  }

  //console.log("state",state);
  if(inputSelect(state)){
    myData.state = state;
  }else{
    document.getElementById('p3').innerText = "* Please select state *";
    return false;
  }
  //console.log(city);
  if(inputSelect(city)){
    myData.city = city;
  }else{
    document.getElementById('p3').innerText = "* Please select city *";
    return false;
    //return myData;
  }

  if(document.getElementById("female").checked) myData.gender = document.getElementById("female").value;
  else myData.gender = document.getElementById("male").value;

  return myData;
}

function insert(){
  var myData=formValidation();
  if(myData){
    postRequest("http://localhost:3000/insert", myData, function(status,responseText){
    if(status == 200){
      try{
        data = JSON.parse(responseText);
        console.log("responseText ",responseText, data);
        document.getElementById('p3').innerText = "";
        addRowToTable(myData,data);
        //onreset();

      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }
    });

  }
}
 

function addRowToTable(myData,data){
  var tabb = document.getElementById("table");
  var len = (tabb.rows.length);
  var row = tabb.insertRow(len).outerHTML='<tr>\
  <td><button oid="'+ data.id +'" type="button" class="delete-btn" >Delete</td>\
  <td><button oid="'+ data.id + '"type="button" class="update-btn">Update</td>\
  <td>'+myData.name+'</td>\
  <td>'+myData.mobile+'</td>\
  <td>'+myData.address+'</td>\
  <td>'+myData.state+'</td>\
  <td>'+myData.city+'</td>\
  <td>'+myData.gender+'</td>\
  <tr>';
  console.log("Inserted");
  var newElements=document.querySelectorAll("[oid=\""+data.id+"\"]");
  $('.delete-btn').click(function() {
    onDeleteClick(this);
  });

  $('.update-btn').click(function() {
    onUpdateClick(this);
  });
  //document.getElementById("city-data").style.visibility="hidden";
  onreset();
  document.getElementById("state").value="-1";
}

function displayState(){
  getRequest("http://localhost:3000/states",function(status,responseText){
    if(status == 200){
      try{
       var respObj = JSON.parse(responseText);
       // console.log("respObj",respObj);
       //var id1={};
       var list="<select class=\"col-sm-10 form-control\" name=\"state\" id=\"state\">";
       list+="<option value='-1'>Select state</option>";
       for(var i=0;i<respObj.length;i++)
       {
          list+="<option oid=\""+respObj[i]._id+"\" value=\""+respObj[i].name+"\">"+respObj[i].name+"</option>";
       }
       list+="</select>";
       document.getElementById("state-data").innerHTML=list;
       for(var i=0;i<respObj.length;i++)
       {
          document.getElementById("state").onchange=onselectstate;
       }  
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p1').innerText = "Something went wrong please try again later";
    }
  });
}

function createTable(){
  getRequest("http://localhost:3000/users",function(status,responseText){
    if(status == 200){
      try{
        var respObj = JSON.parse(responseText);
       var table = "<table class=\"table table-striped \" id=\"table\" style=\" border:2px solid black;\"> \
        <tr> \
        <th >Delete</th>\
        <th>Update</th>\
           <th>Name</th> \
           <th>Mobile</th> \
           <th>Address</th> \
           <th>State</th> \
           <th>City</th> \
           <th>Gender</th> \
        </tr>";

        for(var i = 0; i < respObj.length; i++)
        {
          table += "<tr> \
             <td> <button oid=\"" + respObj[i]._id + "\" class=\"delete-btn btn-default\" type=\"button\">Delete</button></td>\
             <td> <button oid=\"" + respObj[i]._id + "\" class=\"update-btn btn-default\" type=\"button\">Update</button></td>\
             <td>"+ respObj[i].name +"</td> \
             <td>"+ respObj[i].mobile +"</td> \
             <td>"+ respObj[i].address +"</td> \
             <td>"+ respObj[i].state +"</td>\
             <td>"+ respObj[i].city +"</td> \
             <td>"+ respObj[i].gender +"</td> \
           </tr>";
        }
        table += "</table>";
        document.getElementById("user-data").innerHTML = table;
        $('.delete-btn').click(function() {
          onDeleteClick(this);
        });

        $('.update-btn').click(function() {
          onUpdateClick(this);
        });
      }
      catch(e){
        document.getElementById('p3').innerText = e;
      }
    }else{
      document.getElementById('p3').innerText = "Something went wrong please try again later";
    }
  });
}



function onUpdateClick(self)                                           //Update Function
{
  document.getElementById("submit").style.visibility="hidden";
  document.getElementById("save").style.visibility="visible";
  document.getElementById("city-data").style.visibility="visible";
  //var ids=self.getAttribute("oid");
  var table=document.getElementById("table"); 
  var id = self.getAttribute("oid"); 
  var row=self.parentElement.parentElement;                  
  //console.log(this.rowIndex);         
  document.getElementById("name").value=row.cells[2].innerText;
  document.getElementById("mobile").value=row.cells[3].innerText;
  document.getElementById("address").value=row.cells[4].innerText;
  document.getElementById("state").value=row.cells[5].innerText;
  if((row.cells[5].innerText)=="Maharashtra")                         //for showing cities of state
  {
    var list2="<select class=\"col-sm-10 form-control\" name=\"city\"  id=\"city\">\
      <option value=\"dombivali\">Dombivli</option>\
      <option value=\"Bhandup\">Bhandup</option>\
      <option value=\"Uran\">Uran</option>\
      <option value=\"Navi Mumbai\">Navi Mumbai</option>\
    </select>";
    document.getElementById("city-data").style.visibility = "visible";
    document.getElementById("city-data").innerHTML = list2;
    document.getElementById("city").value=row.cells[6].innerText;
  }
  else if((row.cells[5].innerText)=="Goa")
  {

    var list2="<select class=\"col-sm-10 form-control\" name=\"city\"  id=\"city\">\
        <option value=\"Panjim\">Panjim</option>\
        <option value=\"Vasco da Gama\">Vasco da Gama</option>\
        <option value=\"Margao\">Margao</option>\
      </select>";
      document.getElementById("city-data").style.visibility = "visible";
      document.getElementById("city-data").innerHTML = list2;
      document.getElementById("city").value=row.cells[6].innerText;
  }else if((row.cells[5].innerText)=="Kerala")
  {
    var list2="<select class=\"col-sm-10 form-control\" name=\"city\"  id=\"city\">\
        <option value=\"Kochi\">Kochi</option>\
        <option value=\"Munnar\">Munnar</option>\
        <option value=\"Kunar\">Kunar</option>\
      </select>";
      document.getElementById("city-data").style.visibility = "visible";
      document.getElementById("city-data").innerHTML = list2;
      document.getElementById("city").value=row.cells[6].innerText;
  }
  else
  {
    var list2="<select class=\"col-sm-10 form-control\" name=\"city\"  id=\"city\">\
        <option value=\"Siliguri\">Siliguri</option>\
        <option value=\"Durgapur\">Durgapur</option>\
      </select>";
      document.getElementById("city-data").style.visibility = "visible";
      document.getElementById("city-data").innerHTML = list2;
      document.getElementById("city").value=row.cells[6].innerText;
  }
  document.getElementById("city").value=row.cells[6].innerText;
  if(row.cells[7].innerText=="Female")
  {
    document.getElementById("female").checked=true;
    document.getElementById("male").checked=false;
  }
  else
  {
    document.getElementById("male").checked=true;
    document.getElementById("female").checked=false;
  }
  document.getElementById("save").onclick = function()         //to save the changes made 
  {
    console.log(myData);
    var myData=formValidation();
    console.log(myData);
    myData._id = id;
    if(myData){
      postRequest("http://localhost:3000/update",myData,function(status,responseText){
        if(status == 200){
          try{
            row.cells[2].innerText=myData.name;
            row.cells[3].innerText=myData.mobile;         //to reflect changes in table
            row.cells[4].innerText=myData.address;
            row.cells[5].innerText=myData.state;
            row.cells[6].innerText=myData.city;
            row.cells[7].innerText=myData.gender;
            console.log("Updated");
            document.getElementById('p3').innerText = "";
            // document.getElementById("city-data").style.visibility="hidden";
            // document.getElementById("save").style.visibility="visible";
            // document.getElementById("submit").style.visibility="hidden";
            onreset();
            document.getElementById("state").value="-1";
          }
          catch(e){
            document.getElementById('p3').innerText = e;
          }
        }else{
          document.getElementById('p3').innerText = "Something went wrong please try again later";
        }
      });
    }
    
  }
}
      