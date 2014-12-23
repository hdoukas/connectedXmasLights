connectedXmasLights
===================

Implement controllable Xmas lights over the Web using WebSockets, an Arduino and a RaspberryPi.

Read about it [here].

List of provided files:

 - imagehandle.php Handles the upload of the WebCam image through a POST request
 - rpi_light_controller.js The Node.JS scrip that runs on the Pi and a) controls the lights via the Arduino, b) grabs a WebCam frame and uploades it to the WebServer
 - ws_server.js A WebSockets server implementation based on Node.JS
 - index.html A sample html client for controlling the lights through web switches (checkbox elements) and displaying the WebCam frames



[here]:http://blog.buildinginternetofthings.com/2014/12/23/a-connected-christmas-tree-using-an-arduino-a-rapsberrypi-and-websockets/