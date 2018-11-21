const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const pipelineHandler = require('./pipelinehandler');

app.use(bodyParser.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.post('/', (req, res) => {
  io.emit('log', 'HELLO WORLD');
  res.send('HELLO WORLD');
});

app.post('/runPipeline', async (req, res) => {
  res.send('LAUNCHED');
  io.emit('log', `--> STARTED PIPELINE <--`);
  const result = await pipelineHandler.execute(req.body.pipeline, io);
  io.emit('log', `RESULT --> ${result}`);

});

io.on('connection', function(socket){
  io.emit('log', `VM --> USER CONNECTION HANDSHAKE <--`);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
  io.emit('log', `VM STARTED !!`);
});
