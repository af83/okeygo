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
                          <% _.each(_.sortBy(songsList[key], function(i){ return i.artist }), function(song) { %>\
                            <li class="item">\
                              <a href="/sing.html?<%= $.param(song) %>"\
                                data-song=\'{"lyrics":"<%= escape(song.lyrics) %>"}\'\
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

    $( "#dialog" ).dialog({
        autoOpen: false,
        width: 450,
        position:[($(window).width() - 550), 'center']
    });

    $( "img.cover" ).live('mouseenter', function(e) {
        var target = $(this).closest('a');
        $('#dialog').html('&nbsp;');
        $('#dialog').dialog( "option", "title", target.text());
        // Start loading the lyrics
        lyrics = new Lyrics(target.data('song').lyrics);
        lyrics.load(function() {
            $('#dialog').append(target.find('img').clone());
            _.each(lyrics.lyrics.slice(0, 5), function(l) {
                $('#dialog').append('<p>' + _.reduce(l, function(memo, obj) {
                    return memo + obj.text;
                }, "") + '</p>');
            });
            $( "#dialog" ).dialog( "open" );
        });
        return false;
    }).live('mouseleave', function() {
        $( "#dialog" ).dialog( "close" );
        return false;
    });
});
