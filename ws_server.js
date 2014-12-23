/*
Copyright 2014 Charalampos Doukas - @buildingiot
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

"use strict";

console.log('server starting...');


var light1, light2, light3;
var ws_serverclient;

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});
wss.on('connection', function(ws) {
  ws_serverclient = ws;

  //update new client with light status:
  ws.send('{"light1":"'+light1+'", "light2":"'+light2+'", "light3":"'+light3+'"}');

  ws.pingssent = 0;

    var id = setInterval(function() {

    if (ws.pingssent >= 5)   // how many missed pings you will tolerate before assuming connection broken.
        {
            ws.close();
        }
    else
        {
          try {
                 ws.ping();
          }
          catch (e) {
            console.log('ws.ping failed');
            ws.close();
          }
           
            ws.pingssent++;
        }
    }, 30 * 1000);   //  30 seconds between pings

     ws.on("pong", function() {    // we received a pong from the client.
        ws.pingssent = 0;    // reset ping counter.
    });

    ws.on('message', function(message) {
      

  		var data = JSON.parse(message);
  		light1 = data.light1;
  		light2 = data.light2;
  		light3 = data.light3;

  		if(light1!=null && light2!=null && light3!= null) {

	  		for(var i in wss.clients) {
	    		wss.clients[i].send(message);
	  		}
  		}
        
    });
});