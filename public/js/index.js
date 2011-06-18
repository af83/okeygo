// Setup the Sencha Touch app.
Ext.setup({
    icon: 'icon.png',
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    glossOnIcon: false,
    onReady: function(){

      var player = $("#player")[0];

      $("#play").bind('click', function(event) {
        console.log( $("#url").val() );

        event.preventDefault();
        $( player ).attr('src', $("#url").val());
        player.play();
      });

    }
});

