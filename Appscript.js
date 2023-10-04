var ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1Y5hh_5tv5Q1Ud-pOQCbzl0va2vt7ptilu93xY2TB-Es/edit#gid=1140746110'); 
var sheet = SpreadsheetApp.getActiveSheet();
var sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config');
  // Google sheets 
var data = sheet2.getDataRange().getValues();
var api = data[0][1];
console.log(api);
var urlLineNotify = 'https://notify-api.line.me/api/notify';
var tokenLineNotify = data[0][3];
var imageUrl = data[0][5];
var tokenFirebasestore = data[0][7];
var recordMss = data[0][9];
var lastid = data[2][1];
var lastdate = data[2][2];
 
//console.log(lastid+" "+lastdate);
var st =  UrlFetchApp.fetch(api);

var content = st.getContentText();
var json = (JSON.parse(content)).feeds[0];
 var entry_id = json["entry_id"];
var name = (JSON.parse(content)).channel["name"];
 var timestamp = json["created_at"];
  var field1 = json["field1"];
  var field2  = json["field2"];
  var field3 = json["field3"];
  var field4 = json["field4"];
  var field5 = json["field5"];
 var field6 = json["field6"];
  var field7 = json["field7"];
  var field8 = json["field8"];

function initsetup(){
   
 SpreadsheetApp.setActiveSpreadsheet(ss);
  SpreadsheetApp.setActiveSheet(ss.getSheetByName("ข้อมูลทั้งหมด"));
  activeSheet=ss.getActiveSheet();
  activeSheet.appendRow([entry_id, timestamp,field1,field2,field3,field4,field5,field6,field7,field8]);
}

function myFunction() {
  if(lastid == null){
     initsetup();
  }else{

//API
  console.log(api+"  "+lastid);
  // data API ST  
  console.log(json);
   
    if(entry_id != lastid){

  //รายงานทุกชั่วโมงใน Line
  // console.log("Timestamp="+timestamp);
  if(timestamp != null){
   var lastTime = ConvertTimeStamp(timestamp);
  }
  // console.log("lastdate ="+lastdate);
  if(timestamp != lastdate){
   var inputlastTime = ConvertTimeStamp(lastdate);
  }
  console.log(lastTime.getHours() +" "+ inputlastTime.getHours());
  if(lastTime.getHours() != inputlastTime.getHours()){
   // if(1==1){//test
    var arrlastdata = ReadLastData();
    recordMss+= "\nเวลา "+ConvertTimeStamp(lastdate);
    messages = {
        "message": recordMss
      };
      console.log(messages);
      sendLineNotify(messages);
      // sendImageFromURLToLineNotify();
  }
  // เลือกหน้า ข้อมูลทั้งหมด
  SpreadsheetApp.setActiveSpreadsheet(ss);
  SpreadsheetApp.setActiveSheet(ss.getSheetByName("ข้อมูลทั้งหมด"));
  activeSheet=ss.getActiveSheet();
  activeSheet.appendRow([entry_id, timestamp,field1,field2,field3,field4,field5,field6,field7,field8]);

    }
}
}

function ReadLastData(){
  SpreadsheetApp.setActiveSpreadsheet(ss);
  var lastsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ข้อมูลล่าสุด');
  var lastdata = lastsheet.getDataRange().getValues();
  console.log(lastdata);
  var d = 123.234;
  console.log(parseFloat(d).toFixed(2));
  return lastdata[1];
}

function CalculateVal(val1,val2){
  var floatVal1 = parseFloat(String(val1));
  var floatVal2 = parseFloat(String(val2));
  let total = 0;
  if(floatVal1 > floatVal2){
    total = floatVal1 - floatVal2;
  }else{
    total = floatVal2 - floatVal1;
  }
  return total;
}

function ConvertTimeStamp(timestamp){
    let arrTimeStamp = timestamp.split('-');
    let _year = parseInt(arrTimeStamp[0]);
    let _month = parseInt(arrTimeStamp[1]);
    arrTimeStamp = arrTimeStamp[2].split('T');
    let _day = parseInt(arrTimeStamp[0]);
    arrTimeStamp = arrTimeStamp[1].split(':');
    let _hour = parseInt(arrTimeStamp[0]);
    let _minut = parseInt(arrTimeStamp[1]);
    let _sec =  parseInt(arrTimeStamp[2].substr(0, arrTimeStamp[2].length-1));
    var lastTime = new Date(_year,_month-1,_day,_hour+7,_minut,_sec);
    return lastTime;
}

function AlertConnection(){
  var ms = "";
   console.log(new Date+" "+timestamp);
  if(entry_id == lastid){
    let _now = new Date;
    var lastTime = ConvertTimeStamp(timestamp);
    console.log(_now+" "+lastTime);
    

var diffMs = (_now - lastTime); // milliseconds between now & last
var diffDays = Math.floor(diffMs / 86400000); // days
var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
if(diffDays > 0){
  ms += diffDays + " วัน ";
}
if(diffHrs > 0){
  ms += diffHrs + " ชั่วโมง ";
}
if(diffMins > 0){
  ms += diffMins + " นาที ";
}

     messages = {
        "message": "แจ้งเตือนความผิดปรกติขณะนี้ \""+name+"\"ขาดการเชื่อมต่อไป "+ms+"เวลาเชื่อมต่อล่าสุด คือ "+lastTime,
        "stickerPackageId": "6359",
        "stickerId": "11069851"
      };
      if(diffDays > 0 ||diffHrs > 0||diffMins > 10){
      sendLineNotify(messages);
      }
    console.log(messages);
  }
}

// 1hguuh4Zx72XVC1Zldm_vTtcUUKUA6iBUOoGnJUWLfqDWx5WlOJHqYkrt
//Key Firebase Library

function firebaseConnection(){
  eval(UrlFetchApp.fetch('https://www.gstatic.com/firebasejs/7.21.1/firebase-app.js').getContentText()); 
  eval(UrlFetchApp.fetch('https://www.gstatic.com/firebasejs/7.21.1/firebase-database.js').getContentText()); 

var firebaseConfig = {
    apiKey: "sdypZIPQwEWfwNzyGdxfexuxfaP20wfFwfvZyNX8",
    databaseURL: "https://chamber-plants-default-rtdb.asia-southeast1.firebasedatabase.app/",
    };

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
console.log(database);
}

function ReadToFirebase() {
var firebaseUrl ="https://chamber-plants-default-rtdb.asia-southeast1.firebasedatabase.app/";
var secret = "sdypZIPQwEWfwNzyGdxfexuxfaP20wfFwfvZyNX8";
var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, secret);

  let dataSet = [base.getData()][0]['img']['ChamberPlantsV1']['data'];
var img = "";
for(let i=0;i<10;i++){
   img += dataSet['img'+i];
}
  var imageBlob = Utilities.newBlob(img, 'image/png');
  sendImgLineNotify(imageBlob);
}




function sendImageFromURLToLineNotify() {
  
  var imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
  var response = UrlFetchApp.fetch("https://notify-api.line.me/api/notify", {
    method: "post",
    payload: {
      message: "รายงานประจำชั่วโมง",
      imageFile: imageBlob
    },
    headers: {
      "Authorization": "Bearer " + tokenLineNotify
    },
    muteHttpExceptions: true
  });
  return response.getContentText();
}

function sendLineNotify(messages) {
  
  //  messages = {
  //       "message": recordMss,
  //       "stickerPackageId": "1",
  //       "stickerId": "14"
  //     };
  
  
  var options = {
      "method": "post",
      "payload": messages,
      "headers": {
        "Authorization": "Bearer " + tokenLineNotify
       }
  };
  console.log(options);
  UrlFetchApp.fetch(urlLineNotify, options);
}


function test(){
showURL("http://www.google.com")
}
//
function showURL(href){
  var app = UiApp.createApplication().setHeight(50).setWidth(200);
  app.setTitle("Show URL");
  var link = app.createAnchor('open ', href).setId("link");
  app.add(link);  
  var doc = SpreadsheetApp.getActive();
  doc.show(app);
  }

