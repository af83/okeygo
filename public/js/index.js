// Setup the Sencha Touch app.
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function(){
      var player = $("#player")[0];

      /**
       * --------------------------------------------------------------------------------
       * Count-down Panel
       *
       * Shows the count down between Home panel and Song panel
       */
      var countDownPanel = new Ext.Panel({
        fullscreen: true,
        showAnimation: { type: 'slide', direction: 'right' },
        html: '<div class="countDown"><p id="counter"></p></div>',
        startCountingAt: 4,
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
        // Start loading the song...
        player.src='songs/Celine_Dion_-_My_Heart_Will_Go_On/Celine_Dion_-_My_Heart_Will_Go_On.mp3';
        player.load();

        var start_at = countDownPanel.startCountingAt + 1;

        panel.interval = setInterval(function() {
          if ( start_at-- > 1 ) {
            $("#counter").html(start_at);
            $("#counter").removeClass('count_'+(start_at+1)).addClass('count_'+start_at);
            return;
          }
          if ( panel.interval !== null ) {
            $("#counter").removeClass('count_1');
            panel.toSongPanel();
          }
        }, 1000);
      });


      /**
       * --------------------------------------------------------------------------------
       * Song Panel
       *
       * Shows the currently playing song
       */
      var songPanel = new Ext.Panel({
        fullscreen: true,
        showAnimation: { type: 'slide', direction: 'left' },
        html: '<div id="lyric">&nbsp;</div>\
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
              },
              { ui: 'forward',
                text: 'Replay',
                handler: function(button) {
                  songPanel.backToCountDownPanel();
                }
              }
            ]
          }
        ],
        backToHomePanel: function() {
          songPanel.hide();
          homePanel.show();
        },
        backToCountDownPanel: function() {
          songPanel.hide();
          countDownPanel.show();
        },
      });
      songPanel.hide();
      songPanel.on('show', function(panel) {
        $('body').addClass('song');
        var url = 'songs/Celine_Dion_-_My_Heart_Will_Go_On/Celine_Dion_-_My_Heart_Will_Go_On.txt';
        panel.lyrics = new Lyrics(url)
        panel.lyrics.load(function() {
          player.play();
          panel.lyrics.display();
        });
      });
      songPanel.on('hide', function(panel) {
        if (panel.lyrics) panel.lyrics.stop();
        player.pause();
        $('body').removeClass('song');
      });

      /**
       * --------------------------------------------------------------------------------
       * Home Panel
       */

      // Build a sortable song list show on home
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
        countDownPanel.show();
        homePanel.hide();
        list.deselect(nodes);
      });

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
