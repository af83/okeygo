window.Lyrics = {};

Lyrics.load = function(url, callback) {
    var song = { lyrics: [] };

    $.get(url, function(resp) {
        var sentence = [];
        var lines = resp.split('\r\n');
        lines.forEach(function(line) {
            var row = [];
            var words = {};
            if (line[0] == '#') {
                row = line.slice(1).split(':');
                song[row[0]] = row[1];
            } else if (line[0] == ':') {
                row = line.slice(2).split(' ');
                word = {
                    start:    row[0],
                    duration: row[1],
                    note:     row[2],
                    text:     row.slice(3).join(" ")
                };
                sentence.push(word);
            } else if (line[0] == '-') {
                word = { sleep: line.slice(2) };
                sentence.push(word);
                song.lyrics.push(sentence);
                sentence = [];
            } else if (line[0] == 'E') {
                song.lyrics.push(sentence);
                sentence = [];
                callback(song);
            }
        });
    });
};

Lyrics.display = function(song) {
    $('#song .title').html(song['TITLE']);
    $('#song .artist').html(song['ARTIST']);
    var timing = 0;
    var lyrics = song.lyrics;
    Lyrics.timer(lyrics, timing);
    setInterval(function() {
        Lyrics.timer(lyrics, ++timing);
    }, 100);
};

Lyrics.counter = 0;

Lyrics.timer = function(lyrics, timing) {
    if (timing != lyrics[0][0].start) return ;
    $("#lyric").html('');
    var sentence = lyrics.shift();
    sentence.forEach(function(word) {
        if (word.text) {
            var id = 'word-' + Lyrics.counter++;
            $('#lyric').append('<span class="word" id="' + id + '">' + word.text + '</span>');
            if (word.start == timing) {
                Lyrics.choose(id, word);
            } else {
                setTimeout(function() {
                    Lyrics.choose(id, word);
                }, (word.start - timing) * 100);
            }
        }
    });
};

Lyrics.choose = function(id, word) {
    id = '#' + id;
    $(id).addClass('current');
    setTimeout(function() {
        $(id).removeClass('current');
    }, word.duration * 100);
};
