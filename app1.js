var i = 0;
var temp1 = 0;
var temp2 = 0;
var umid1 = 0;
var umid2 = 0;


var http = require('http');
var fs = require('fs');
var index = fs.readFileSync( 'index.html');

var SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
    delimiter: '\r\n'
});

var port = new SerialPort('COM9',{ 
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

var io = require('socket.io').listen(app);

io.on('connection', function(socket) {
    
    console.log('Node is listening to port');
    
});

parser.on('data', function(data) {
    
    //console.log('Received data from port: ' + data);
    

    switch(i) {
        case 0:
            console.log('Temperatura2: ');
            console.log(data);
            temp2 = data;
          break;
        case 1:
            console.log('Umidade2: ');
            console.log(data);
            umid2=data;
          // code block
          break;
        case 2:
            console.log('Temperatura1: ');
            console.log(data);
            temp1 = data;
            // code block
            break;
        case 3:
            console.log('Umidade1: ');
            console.log(data);
            umid1 = data;
            // code block
            io.emit('data', temp2, umid2, temp1, umid1);
            break;
      }
      i=i+1;
      i=i%4;
      //data0 = i;
      //io.emit('data', temp2, umid2, temp1, umid1);
});

app.listen(3000);