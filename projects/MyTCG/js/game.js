/**
 * A sample game.js for you to work from
 */

var util = require("util");
var io = require("socket.io");

TheGame = pc.Game.extend('TheGame',
    { },
    {
        dataUrl:'http://local.mytcg',
        gameScene:null,
        menuScene:null,
        socket:null,
        players:null,

        onReady:function ()
        {
            this._super();

            // disable caching when developing
            // if (pc.device.devMode)
            //    pc.device.loader.setDisableCache();

            // no resources are loaded in this template, so this is all commented out
            // pc.device.loader.add(new pc.Image('an id', 'images/an image.png'));

            //if (pc.device.soundEnabled)
            //   pc.device.loader.add(new pc.Sound('fire', 'sounds/fire', ['ogg', 'mp3'], 15));
            
            // Load decks
            pc.device.loader.add(new pc.DataResource('decks', this.dataUrl + '?q=decks'));

            // fire up the loader
            pc.device.loader.start(this.onLoading.bind(this), this.onLoaded.bind(this));
        },

        onLoading:function (percentageComplete)
        {
            // draw title screen -- with loading bar
            //alert(percentageComplete);
            console.log('p comp: ' + percentageComplete);
        },
        
        onDecksDataLoaded:function(decksData)
        {
            console.log(decksData);
        },

        onLoaded:function ()
        {
            // create the game scene (notice we do it here AFTER the resources are loaded)
            this.gameScene = new GameScene();
            this.addScene(this.gameScene);

            // create the menu scene (but don't make it active)
            this.menuScene = new MenuScene();
            this.addScene(this.menuScene, false);

            // resources are all ready, start the main game scene
            // (or a menu if you have one of those)
            this.activateScene(this.menuScene);
            
            // List decks
            var decksData = pc.device.loader.get('decks').resource.data;
            console.log(decksData);
        },

        activateMenu:function()
        {
            this.deactivateScene(this.gameScene);
            this.activateScene(this.menuScene);
        },

        deactivateMenu:function()
        {
            this.deactivateScene(this.menuScene);
            this.activateScene(this.gameScene);
        }
    });


