// Setup the Sencha Touch app.
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function(){

      // Sample player
      var player = $("#player")[0];
      $("#play").bind('click', function(event) {
        event.preventDefault();
        player.attr('src', $("#url").val());
        player.play();
      });

      var panel = new Ext.Panel({
        fullscreen: true,

        dockedItems: [
            {
                dock : 'top',
                xtype: 'toolbar',
                title: 'af83 tunes'
            },
            {
                dock : 'top',
                xtype: 'toolbar',
                ui   : 'light',
                items: [
                    {
                        text: 'Youpi!',
                        handler: function() { player.play(); }
                    }
                ]
            }
        ],

        html: 'Basic interface'
      });
    }
});

