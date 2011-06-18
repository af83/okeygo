// Setup the Sencha Touch app.
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function(){

      // Sample player
      var player = $("#player")[0];

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
        console.log("Selected: " + nodes[0].data.song + ", by " + nodes[0].data.artist);
        songPanel.show();
        homePanel.hide();
        songPanel.fireEvent('show');
      });

      // Shows the count down
      var countDownPanel = new Ext.Panel({
        fullscreen: true,
        showAnimation: 'slide',
        html: "Showing countdown here"
      });

      // Shows the currently playing song
      var songPanel = new Ext.Panel({
        fullscreen: true,
        showAnimation: 'slide',
        html: '<p>Shows the currently playing song</p><div id="song"><h2 class="title"></h2><h2 class="artist"></h2><div id="lyric"></div></div>',
        dockedItems: [
            {
                dock : 'top',
                xtype: 'toolbar',
                title: 'Pick a song !'
            },
        ]
      });
      songPanel.on('show', function(panel) {
        console.log("show song panel");
        var url = 'songs/Celine_Dion_-_My_Heart_Will_Go_On.txt';
        Lyrics.load(url, function(song) {
            Lyrics.display(song);
        });
      });

      // Home interface
      var homePanel = new Ext.Panel({
        fullscreen: true,
        layout: 'card',
        showAnimation: 'slide',
        dockedItems: [
            {
                dock : 'top',
                xtype: 'toolbar',
                title: 'Pick a song !'
            },
        ],
        items: [ list ]
      });
    }
});
