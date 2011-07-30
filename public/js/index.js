$(document).ready(function () {

    $('#loading').hide().ajaxStart(function() {
        $(this).css("position", "absolute");
        $(this).css("top", ($(window).height() - $(this).height())/ 2 + $(window).scrollTop() + "px");
        $(this).css("left", ($(window).width() - $(this).width()) / 2 + $(window).scrollLeft() + "px");
        $(this).show();
    }).ajaxStop(function() {
        $(this).hide();
    });

    $.getJSON('/js/songs.json', function(data) {
        var songs = data['data'];
        var songsList = {};

        songsList = _.groupBy(songs, function(s) { return s.artist[0]; });

        var list = '<% _.each(_.keys(songsList).sort(), function(key) { %>\
                      <h3><a href="#<%= key %>" name="<%= key %>"><%= key %></a></h3>\
                        <ul data-name="<%= key %>">\
                          <% _.each(songsList[key], function(song) { %>\
                            <li class="item">\
                              <a href="/sing.html?<%= $.param(song) %>"\
                                class="play"\>\
                                <%= song.artist %> - <%= song.title %> <img class="cover" src="<%= song.thumb || song.img %>" alt="<%= song.artist %> - <%= song.title %>" />\
                              </a>\
                            </li>\
                          <% }); %>\
                        </ul>\
                    <% }); %>';
        var result = _.template(list, {songsList: songsList});

        $(result).appendTo('#songs');

    }).complete(function() {
        $(window).sausage({
            page: 'ul',
            content: function (i, $page) {
                return '<div class="sausage-span">' + $page.data('name') + '</div>';
            }
        });
    });

});
