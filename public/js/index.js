$(document).ready(function () {
    $('#loading').hide()
    .ajaxStart(function() {
        $(this).css("position", "absolute");
        $(this).css("top", ($(window).height() - $(this).height())/ 2 + $(window).scrollTop() + "px");
        $(this).css("left", ($(window).width() - $(this).width()) / 2 + $(window).scrollLeft() + "px");
        $(this).show();
    })
    .ajaxStop(function() {
        $(this).hide();
    });

    $.getJSON('/js/songs.json', function(data) {
        var songs = data['data'];
        var songsList = {};

        songsList = _.groupBy(songs, function(s) { return s.artist[0]; });

        var list = '<div id="accordion">\
                      <% _.each(_.keys(songsList).sort(), function(key) { %>\
                        <h3><a href="#"><%= key %></a></h3>\
                          <ul>\
                            <% _.each(songsList[key], function(song) { %>\
                              <li class="item">\
                                <a href="/sing.html?lyrics=<%= song.lyrics %>&img=<%= song.thumb %>&url=<%= song.url %>">\
                                  <%= song.artist %> - <%= song.title %> <img src="<%= song.thumb || song.img %>" alt="<%= song.artist %> - <%= song.title %>" />\
                                </a>\
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
