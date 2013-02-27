//
// Playcraft Engine Simpler Server
// This is a simple example server to run games locally, it's not intended for production use
//

var requirejs = require('requirejs');
var express = require('express');
var app = express(2020);
var util = require("util");
var io = require("socket.io");
var Player = require("./Player").Player;

var socket;
var players;

// Configuration
app.configure(function()
{
    app.use(express.logger());
    app.set('view engine', 'jade');
    app.set('view options', { doctype:'html', pretty:true, layout:false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static('../'));

    // if you want to make your own projects appear using different directories, add a static line here, e.g.
    //app.use(express.static('/myprojects/mygame/'));

    app.use(express.static('static'));
    app.engine('html', require('ejs').renderFile);

});


app.configure('development', function()
{
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function()
{
    app.use(express.logger());
    app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res)
{
    app.set('views', './');
    res.render('index.html');
});

/**
 * Note the trailing slash in the routes here. Without it the /js/demoname.js will be included in
 * the route wildcard, which will send over the index.html again (instead of the js)
 */
app.get('/demos/:demoName/', function (req, res)
{
    app.set('views', '../demos/' + req.params.demoName);
    res.render('index.html');
});

app.get('/projects/:projectName/', function (req, res)
{
    app.set('views', '../projects/' + req.params.projectName);
    res.render('index.html');
});


// -- file watcher for the monitor system, not yet implemented fully
/*
watch.createMonitor('../', function (monitor)
{
//    monitor.files['../../'];
    monitor.on("created", function (f, stat)
    {
        // Handle file changes
        console.log('created '+f);
    });
    monitor.on("changed", function (f, curr, prev)
    {
        // Handle new files
        console.log('changed ' + f);
    });
    monitor.on("removed", function (f, stat)
    {
        // Handle removed files
        console.log('removed ' + f);
    });
});
*/

//////////////////////////////////////////////////////////////////////////////
//
// Fire it all up!
//
//////////////////////////////////////////////////////////////////////////////


// Start the app server
app.listen(2020, function ()
{
    players = [];
    
    // Setup our socket
    socket = io.listen(8000);
    
    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });
    
    setEventHandlers();
    
    // All done
    console.log("Playcraft Engine is running");
    console.log("Connect using http://localhost:2020");
});

var setEventHandlers = function() {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: "+client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
};

function onNewPlayer(data) {
    // Receive new player, broadcast to existing players
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
    
    // Pass existing player list to new player
    var existingPlayer;
    for (var i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    };
    
    // Store new player in list of players
    players.push(newPlayer);
};

function onMovePlayer(data) {

};
