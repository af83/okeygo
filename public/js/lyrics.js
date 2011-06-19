Lyrics = function(url) {
  this.url      = url;
  this.init();
};

Lyrics.prototype.init = function() {
  this.intval   = null;
  this.timeouts = [];
  this.lyrics   = [];
  this.note_min = -1;
  this.note_max = -1;
  this.duration = -1;
  this.waited   = false;
};

Lyrics.counter = 0;

Lyrics.prototype.load = function(callback) {
  var song = this;

  $.get(this.url, function(resp) {
    var sentence = [];
    var lines = resp.split('\r\n');
    lines.forEach(function(line) {
      var row = [];
      var words = {};
      if (line[0] == '#') {
        row = line.slice(1).split(':');
        song[row[0].toLowerCase()] = row[1];
      } else if (line[0] == ':') {
        row = line.slice(2).split(' ');
        word = {
          start:    row[0],
          duration: row[1],
          note:     parseInt(row[2], 10),
          text:     row.slice(3).join(" ")
        };
        if (word.note < song.note_min || song.note_min == -1) {
          song.note_min = word.note;
        } else if (word.note > song.note_max || song.note_max == -1) {
          song.note_max = word.note;
        }
        sentence.push(word);
      } else if (line[0] == '-') {
        song.lyrics.push(sentence);
        sentence = [];
      } else if (line[0] == 'E') {
        song.lyrics.push(sentence);
        song.step = 0.25 * 60 / song.bpm * 1000;
        word = sentence[sentence.length - 1];
        song.duration = parseInt(word.start, 10) + parseInt(word.duration, 10);
        sentence = [];
        callback();
      }
    });
  });
};

Lyrics.prototype.display = function() {
  var song = this;
  $('#song .title').html(this.title);
  $('#song .artist').html(this.artist);
  $('#progressbar').attr('data-duration', song.duration);
  if ($('#progressbar')) $('#progressbar').attr('style', 'width:0%');

  if ( song.gap && !this.waited ) {
    var self = this;
    setTimeout(function() {
      self.waited = true;
      self.display();
    }, song.gap);
    return ;
  }

  var timing = 0;
  song.timer(timing);
  song.intval = setInterval(function() {
    song.timer(++timing);
    var currentPercent = (timing / song.duration) * 100;
    if ($('#progressbar')) $('#progressbar').attr('style', 'width:' + currentPercent + '%');
    if (timing == song.duration) {
      clearInterval(song.intval);
      song.intval = null;
    }
  }, song.step);
};

Lyrics.prototype.timer = function(timing) {
  var song = this;
  var lyrics = song.lyrics;
  if (!lyrics.length || timing != lyrics[0][0].start) return ;
  $("#lyric").html('');
  var sentence = lyrics.shift();
  sentence.forEach(function(word) {
    var id = 'word-' + Lyrics.counter++;
    $('#lyric').append('<span id="' + id + '">' + word.text + '</span>');
    $('#' + id).addClass('word');
    $('#' + id).addClass(song.midinote(word.note, song.note_min, song.note_max));
    if (word.start == timing) {
      song.choose(id, word.duration);
    } else {
      var t = setTimeout(function() {
        song.choose(id, word.duration);
      }, (word.start - timing) * song.step);
      song.timeouts.push(t);
    }
  });
};

Lyrics.prototype.choose = function(id, duration) {
  id = '#' + id;
  $(id).addClass('current');
  var t = setTimeout(function() {
    $(id).removeClass('current');
  }, duration * this.step);
  this.timeouts.push(t);
};

Lyrics.prototype.stop = function() {
  $("#lyric").html('');
  $('#progressbar').attr('style', 'width: 0%');
  this.timeouts.forEach(clearTimeout);
  this.timeouts = [];
  if (this.intval) {
    clearInterval(this.intval);
  }
  this.init();
}

/*
* Return the CSS class 'low', 'medium' and 'high'
* @params {Integer} begin
* @params {Integer} end
* @return {Object} Object of Array
*/
Lyrics.prototype.range = function(begin, end) {
  var range = {low: [], medium: [], high: []};
  var low = [];
  var medium = [];
  var high = [];
  var size = end - begin;
  for (var i = begin; i <= end; i++) {
    if (i < (size / 3) + begin)
      low.push(i);
    else if (i < (size / 3) * 2 + begin)
      medium.push(i);
    else
      high.push(i);
  }
  range.low = low;
  range.medium = medium;
  range.high = high;
  return range;
};

/*
* Return the CSS class 'low', 'medium' and 'high'
* @params {Integer} note
* @return {String} the CSS class
*/
Lyrics.prototype.midinote = function(note, min, max) {
  var midirange = this.range(min, max);
  for (var i in midirange) {
    if (midirange[i].indexOf(note) >= 0)
      return i;
  }
  return '';
};
