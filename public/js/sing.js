var SongPanel = function() {
};

SongPanel.prototype.aCappella = function() {
    if ($('#jplayer').hasClass('muted')) {
        $('#acappella').removeClass('disabled');
        $('#jplayer').removeClass("muted");
        $('#jplayer').jPlayer("unmute");
    } else {
        $('#acappella').addClass('disabled');
        $('#jplayer').addClass("muted");
        $('#jplayer').jPlayer("mute");
    }
};

SongPanel.prototype.getURLParameter = function(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

$(function() {
    var songPanel = new SongPanel();

    var nowPlaying = {};
    nowPlaying.url = songPanel.getURLParameter('url');
    nowPlaying.lyrics = songPanel.getURLParameter('lyrics');
    nowPlaying.img = songPanel.getURLParameter('img');

    // Start loading the lyrics
    lyrics = new Lyrics(nowPlaying.lyrics, nowPlaying.img);
    lyrics.load(function() {
        $('#jplayer').jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: nowPlaying.url
                }).jPlayer("play");;
            },
            swfPath: "/"
        });
        lyrics.display();
    });

    $('#acappella').bind('click', songPanel.aCappella);
    //$('#replay').bind('click', songPanel.backToCountDownPanel);
});
