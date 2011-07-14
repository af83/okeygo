$(function() {
    $.getJSON('/js/songs.json', function(data) {
        var songs = data['data'];
        var songsList = {};
        
        songsList = _.groupBy(songs, function(s) { return s.artist[0]; });

        var list = '<div id="accordion">\
                      <% _.each(_.keys(songsList).sort(), function(key) { %>\
                        <h3><a href="#"><%= key %></a></h3>\
                          <ul>\
                            <% _.each(songsList[key], function(song) { %>\
                              <li><a href="/sing.html?lyrics=<%= song.lyrics %>&img=<%= song.img %>&url=<%= song.url %>">\
                                <%= song.artist %> - <%= song.song %></a>\
                              </li>\
                            <% }); %>\
                          </ul>\
                      <% }); %>\
                    </div>';
        var result = _.template(list, {songsList: songsList});

        $(result).appendTo('body');

        $( "#accordion" ).accordion({collapsible: true, autoHeight: false});
    });
});
