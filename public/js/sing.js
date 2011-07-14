var SongPanel = function() {
    this.player = $("#player")[0];
};

SongPanel.prototype.aCappella = function() {
    if (player.volume) {
        $('#acappella').addClass('disabled');
        player.volume = 0;
    } else {
        $('#acappella').removeClass('disabled');
        player.volume = 1;
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

    // Start loading the song...
    songPanel.player.src = nowPlaying.url;
    songPanel.player.load();
    songPanel.player.volume = 1;

    // Start loading the lyrics
    lyrics = new Lyrics(nowPlaying.lyrics, nowPlaying.img);
    lyrics.load(function() {
        songPanel.player.play();
        lyrics.display();
    });

    $('#acappella').bind('click', songPanel.aCappella);
    //$('#replay').bind('click', songPanel.backToCountDownPanel);
});
