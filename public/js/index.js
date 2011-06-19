var nowPlaying= null;

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
        player.src = nowPlaying.url;
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
        <div class="buttons"><button id="replay">Replay</button><button id="acappella">A Cappella</button></div>\
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
          }
        ],
        aCappella: function() {
          if (player.volume) {
            $('#acappella').addClass('disabled');
            player.volume = 0;
          } else {
            $('#acappella').removeClass('disabled');
            player.volume = 1;
          }
        },
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
        var url = nowPlaying.lyrics;
        panel.lyrics = new Lyrics(url)
        panel.lyrics.load(function() {
          player.play();
          panel.lyrics.display();
        });
        $('#acappella').bind('click', songPanel.aCappella);
        $('#replay').bind('click', songPanel.backToCountDownPanel);
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
        autoload: true,
        url: 'js/songs.json',
        root: 'data',
        fields: ['artist', 'songs'],
        model  : 'Songs',
        sorters: 'artist',
        getGroupString : function(record) {
          return record.get('artist')[0];
        },
        data: [
          {artist: "Europe",
           song:   "The final countdown",
           lyrics: "songs/Europe_-_The_final_countdown/Europe_-_The_Final_Countdown.txt",
           url:    "songs/Europe_-_The_final_countdown/Europe_-_The_Final_Countdown.mp3",
          },
          {artist: "Metallica",
           song:   "Nothing else matters",
           lyrics: "songs/Metallica_-_Nothing_Else_Matters/Metallica_-_Nothing_Else_Matters.txt",
           url:    "songs/Metallica_-_Nothing_Else_Matters/Metallica_-_Nothing_Else_Matters.mp3",
          },
          {artist: "Metallica",
           song:   "The Unforgiven",
           lyrics: "songs/Metallica_-_The_Unforgiven_I/Metallica_-_The_Unforgiven_I.txt",
           url:    "songs/Metallica_-_The_Unforgiven_I/Metallica_-_The_Unforgiven_I.mp3",
          },
          {artist: "Opus",
           song:   "Life is Life",
           lyrics: "songs/Opus_-_Life_is_Life/Opus_-_Live_Is_Life.txt",
           url:    "songs/Opus_-_Life_is_Life/Opus_-_Live_Is_Life.mp3",
          },
          {artist: "Pink Floyd",
           song:   "Another Brick In The Wall",
           lyrics: "songs/Pink_Floid_-_Another_Brick_In_The_Wall/Pink_Floid_-_Another_Brick_In_The_Wall.txt",
           url:    "songs/Pink_Floid_-_Another_Brick_In_The_Wall/Pink_Floid_-_Another_Brick_In_The_Wall.mp3",
          },
          {artist: "Rednex",
           song:   "Cotton Eye Joe",
           lyrics: "songs/Rednex_-_Cotton_Eye_Joe/Rednex_-_Cotton_Eye_Joe.txt",
           url:    "songs/Rednex_-_Cotton_Eye_Joe/Rednex_-_Cotton_Eye_Joe.mp3",
          },
          {artist: "Hare Hare Yukai",
           song:   "The Melancholy of Harui Syzumiya",
           lyrics: "songs/The_Melancholy_of_Haruhi_Suzumiya_-_Hare_Hare_Yukai/The_Melancholy_of_Haruhi_Suzumiya_-_Hare_Hare_Yukai.txt",
           url:    "songs/The_Melancholy_of_Haruhi_Suzumiya_-_Hare_Hare_Yukai/The_Melancholy_of_Haruhi_Suzumiya_-_Hare_Hare_Yukai.mp3",
          },
          {artist: "The Village people",
           song:   "YMCA",
           lyrics: "songs/The_Village_People_-_YMCA/The_Village_People_-_YMCA.txt",
           url:    "songs/The_Village_People_-_YMCA/The_Village_People_-_YMCA.mp3"
          },
          {artist: "Celine Dion",
           song:   "My heart will go on",
           lyrics: "songs/Celine_Dion_-_My_Heart_Will_Go_On/Celine_Dion_-_My_Heart_Will_Go_On.txt",
           url:    "songs/Celine_Dion_-_My_Heart_Will_Go_On/Celine_Dion_-_My_Heart_Will_Go_On.mp3"
          },
          {artist: "Deep Purple",
           song:   "Smoke on the water",
           lyrics: "songs/Deep_Purple_-_Smoke_On_The_Water/Deep_Purple_-_Smoke_On_The_Water.txt",
           url:    "songs/Deep_Purple_-_Smoke_On_The_Water/Deep_Purple_-_Smoke_On_The_Water.mp3"
          }
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
        nowPlaying = nodes[0].data;
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
