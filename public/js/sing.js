var SongPanel = function() {
    this.player = new Audio();
    this.player.load();
    this.player.src = this.getURLParameter('url');
    this.player.volume = 1;
};

SongPanel.prototype.aCappella = function() {
    if (this.player.volume) {
        $('#acappella').addClass('disabled');
        this.player.volume = 0;
    } else {
        $('#acappella').removeClass('disabled');
        this.player.volume = 1;
    }
};

SongPanel.prototype.getURLParameter = function(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

SongPanel.prototype.backToCountDownPanel = function() {
    window.location.reload();
}

$(function() {
    var songPanel = new SongPanel();

    // Start loading the lyrics
    lyrics = new Lyrics(songPanel.getURLParameter('lyrics'), songPanel.getURLParameter('img'));
    lyrics.load(function() {
        songPanel.player.play();
        lyrics.display();
    });

    $('#acappella').click(songPanel.aCappella.bind(songPanel));
    $('#replay').click(songPanel.backToCountDownPanel);
});
