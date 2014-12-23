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

var ArduinoFirmata = require('arduino-firmata');
var arduino = new ArduinoFirmata();

var FormData = require('form-data');
var fs = require('fs');
var http = require('http');
var cam = require('foscam')

cam.setup({
  host: 'IP.WEB.CAM',
  port: 80,
  user: 'admin',
  pass: ''
})



var WebSocket = require('ws');
var ws = new WebSocket('ws://WEB.SOCKET.SERVER:PORT');

var relay1 = 4;
var relay2 = 3;
var relay3 = 2;


arduino.connect('/dev/ttyACM0');

arduino.on('connect', function(){

  console.log("board version"+arduino.boardVersion);
  
  //initialize the lights to ON
  arduino.digitalWrite(relay1, true, function callback(){});
  arduino.digitalWrite(relay2, true, function callback(){});
  arduino.digitalWrite(relay3, true, function callback(){});

  //send light status to WebServer for synchronizing all web clients
  ws.send('{"light1":"ON", "light2":"ON", "light3":"ON"}');

  ws.on('open', function open() {
  		//ws.send('something');
      //reset:

  });

  ws.on('message', function(data, flags) {
  	var obj = JSON.parse(data);
  	if(obj.light1 == "ON") {
  		arduino.digitalWrite(relay1, true, function callback(){});
  	}
  	if(obj.light1 == "OFF") {
  		arduino.digitalWrite(relay1, false, function callback(){});
  	}
  	if(obj.light2 == "ON") {
  		arduino.digitalWrite(relay2, true, function callback(){});
  	}
  	if(obj.light2 == "OFF") {
  		arduino.digitalWrite(relay2, false, function callback(){});
  	}
  	if(obj.light3 == "ON") {
  		arduino.digitalWrite(relay3, true, function callback(){});
  	}
  	if(obj.light3 == "OFF") {
  		arduino.digitalWrite(relay3, false, function callback(){});
  	}

    //upload CAM image to webserver
    uploadImage();


  });

});

setInterval(uploadImage, 1000);


function uploadImage() {

  //console.log('capturing');

    //get snapshot from CAM
    cam.snapshot('image.jpg', nothing);


    //upload it to the WebServer using a POST request
    var form = new FormData();
    form.append('photo', fs.createReadStream('image.jpg'));

    var http = require('http');

    var request = http.request({
      method: 'post',
      host: 'mobiledemo.compose-project.eu',
      path: '/xmaslights/imagehandle.php',
      headers: form.getHeaders()
    });

    form.pipe(request);

    request.on('response', function(res) {
      //console.log(res.statusCode);
    });

}


function nothing(data) {

}