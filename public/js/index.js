// Setup the Sencha Touch app.
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function(){

      // Sample player
      // var player = $("#player")[0];

      // Build a sortable song list
      Ext.regModel('Songs', { fields: ['artist', 'name'] });
      var store = new Ext.data.JsonStore({
        model  : 'Songs',
        sorters: 'artist',
        getGroupString : function(record) {
          return record.get('artist')[0];
        },
        data: [
          {artist: "Zed Shaw",    song: "Matz can't patch"},
          {artist: "Celine Dion", song: "I love MeeGo"},
          {artist: "Deep Purple", song: "Smoke on the water"},
          {artist: "Dr Dre",      song: "Lyrical Gang-Bang"}
        ]
      });
      // Song list Ext widget
      var list = new Ext.List({
          fullscreen: true,
          itemTpl : '{artist} - {song}',
          grouped : true,
          indexBar: false,
          store: store
      });
      list.on('selectionchange', function() {
        var nodes = list.getSelectedRecords();
        if ( nodes.length == 0 ) return ;
        //console.log("Selected: " + nodes[0].data.song + ", by " + nodes[0].data.artist);
        countDownPanel.show();
        homePanel.hide();
      });

      // Shows the count down
      var countDownPanel = new Ext.Panel({
        fullscreen: true,
        showAnimation: { type: 'slide', direction: 'right' },
        html: '<div class="countDown"><p id="counter"></p> </div>',
        startCountingAt: 3,
        dockedItems: [
          {
            dock : 'top',
            xtype: 'toolbar',
            title: 'Sing !',
            items: [
              {
                ui: 'back',
                text: 'Back to list',
                handler: function(button) {
                  countDownPanel.backToHomePanel();
                }
              }
            ]
          },
        ],
        // Helper to transition back to home panel
        backToHomePanel: function() {
          countDownPanel.hide();
          homePanel.show();
        },

        // Helper to transition forward to song panel
        toSongPanel: function() {
          countDownPanel.hide();
          songPanel.show();
        },
        interval: null
      });
      countDownPanel.hide();

      // Clear transition count-down when hiding panel
      countDownPanel.on('hide', function(panel) {
        $("#counter").html("");
        clearInterval(panel.interval);
        panel.interval = null;
      });

      // Setup transition count-down when showing panel
      countDownPanel.on('show', function(panel) {
        var start_at = countDownPanel.startCountingAt + 1;

        panel.interval = setInterval(function() {
          if ( start_at-- > 1 )
            return $("#counter").html(start_at);
          if ( panel.interval !== null )
            panel.toSongPanel();
        }, 1000);
      });

      // Shows the currently playing song
      var songPanel = new Ext.Panel({
        fullscreen: true,
        showAnimation: { type: 'slide', direction: 'left' },
        html: '<div id="lyric"></div>\
        <div id="song"><h2><span class="artist"></span> - <span class="title"></span></h2>\
        <div class="meter animate"><span id="progressbar" style="width: 50%"><span></span></span></div>\
        </div>',
        dockedItems: [
          {
            dock : 'top',
            xtype: 'toolbar',
            title: 'Sing !',
            items: [
              { ui: 'back',
                text: 'Back to list',
                handler: function(button) {
                  songPanel.backToHomePanel();
                }
              }
            ]
          },
        ],
        backToHomePanel: function() {
          songPanel.hide();
          homePanel.show();
        },
      });
      songPanel.hide();
      songPanel.on('show', function(panel) {
        console.log("show song panel");
        $('body').addClass('song');
        var url = 'songs/Celine_Dion_-_My_Heart_Will_Go_On.txt';
        var lyrics = new Lyrics(url)
        lyrics.load(function() {
          lyrics.display();
        });
      });
      songPanel.on('hide', function(panel) {
        // Lyrics.stop();
        $('body').removeClass('song');
      });

      // Home interface
      var homePanel = new Ext.Panel({
        fullscreen: true,
        layout: 'card',
        showAnimation: { type: 'slide', direction: 'right' },
        dockedItems: [
          {
            dock : 'top',
            xtype: 'toolbar',
            title: 'Pick a song !'
          },
        ],
        items: [ list ]
      });
      homePanel.show();
    }
});
