var W3CWebSocket = require('websocket').w3cwebsocket;
var fs = require('fs')
var userid = []
var ntw = []
var givup = []
var prev = 0
var datast = [0,0,0,0,0,0,0,0,0,0,0]
var wssdata = ' '
var client = new W3CWebSocket( wssdata , 'echo-protocol');

client.onerror = function() {
    console.log('Connection Error');
};
const date = new Date()
const eat = date.toLocaleString()
const st = eat.split(' ')
const st1 = st[1].split(':')
const st3 = st1[2].split(' ') 

const st2 = st1[0]+'-'+st1[1]+'-'+st1[2].slice(0,2)+st1[2].slice(3,6) 
console.log(st2)
client.onopen = function() {
    console.log('WebSocket Client Connected');
    fs.appendFile('./rec/'+st2+'.txt','CrashOdd,TotalPlayer,TotalMony,MinGiveUp,MaxGiveUp,LunchTime,CrashState'+'\n',function(err){})
   // fs.appendFile('2hn.txt','111.111'+'\n',function(err){})
  };

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};
const key = ['game:bets', 'game:state','game:users', ]
var bb = 0
var tmonw = 0
var tmon = 0
client.onmessage = async function(e) {
      let uintArray = new Uint8Array(e.data);
      const jsonString = Buffer.from(e.data).toString('utf8')
const parsedData = await JSON.parse(jsonString)

if(parsedData[0]=='game:bets')
{
const c = parsedData[1][Object.keys(parsedData[1])[0]]
   
if(c){

const d = Object.keys(c)
if (d.length == 12){
    bb = bb+1
    tmon = tmon+c['amount']
    userid.push(c['user_id'])
    
}else if (d.length == 20){
    tmonw = tmonw+c['amount']
    if (typeof(c['cashout_odd']) == 'number'){
        givup.push(c['cashout_odd'])
    }else{
        givup.push(0)
    }
    
}
}

}else if (parsedData[1]['is_crashed'] == true){
  if (prev == 0) {
    prev = parsedData[1]['crash_value']
  }else{

  datast[0] = parseFloat(parsedData[1]['crash_value'])
  datast[1] = bb
  datast[2] = tmon
  datast[3] = givup[0]
  datast[4] = givup[givup.length-1]
  datast[5] = tmonw
  if (tmonw == 0) {
  datast[3] = 0
  datast[4] = 0  }
  datast[6] = parsedData[1]['launch_time']
  if (parseFloat(prev) > parseFloat(parsedData[1]['crash_value'])) {
    datast[7] = 0
  }else{
    datast[7] = 1
  }
  fs.appendFile('./rec/'+st2+'.csv',`${datast[0]},${datast[1]},${datast[2]},${datast[3]},${datast[4]},${datast[5]},${datast[6]},${datast[7]}`+'\n',function(err){})
  prev = parsedData[1]['crash_value']
}
  console.log(datast)
  userid = []
  givup = []
  tmonw=0
  bb = 0
  tmon=0

}
};
