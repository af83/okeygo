var SongPanel = function(data) {
    this.player = new Audio();
    if (data) {
        this.player.src = data.url;
        this.lyrics = data.lyrics;
        this.img = data.img;
        this.title = data.title;
        this.artist = data.artist;
    } else {
        this.player.src = this.getURLParameter('url');
        this.lyrics = this.getURLParameter('lyrics');
        this.img = this.getURLParameter('thumb');
        this.title = decodeURIComponent(this.getURLParameter('title')).replace(/\+/g, ' ');
        this.artist = decodeURIComponent(this.getURLParameter('artist')).replace(/\+/g, ' ');
    }
    this.player.load();
    this.player.preload = 'auto';
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
    return decodeURI((RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
};

SongPanel.prototype.backToCountDownPanel = function() {
    window.location.reload();
};

SongPanel.prototype.html = '<div class="fullscreen">\
			<div class="toolbar">\
				<a href="/" class="button back blue">« Back</a>\
			</div>\
			<div class="countDown"><p id="counter">4</p></div>\
		</div>';

SongPanel.prototype.template = _.template('<div id="lyric">&nbsp;</div>\
            <div id="song"><h2><span class="artist"><%= artist %></span> - <span class="title"><%= title %></span></h2>\
                <div id="cover"><img src="<%= img %>" alt="<%= alt %>" /></div>\
                <div class="buttons">\
                    <button id="replay">Replay</button>\
                    <button id="acappella" class="enabled">A Cappella</button>\
                </div>\
                <div id="progressbar"></div>\
            </div>');

SongPanel.prototype.sing = function() {
    $('#sing').html(this.html);
    
    var self = this;
    // 4,3,2,1 Sing!
    $('#counter').countDown({
        startNumber: 4,
        startFontSize: '500px',
        endFontSize: '500px',
        callBack: function(counter) {
            $(counter).text('Sing!').css('color','#090');
            $(counter).hide();

            $(self.template({
                img: self.img,
                title: self.title,
                artist: self.artist,
                alt: self.title + ' - ' + self.artist
            })).appendTo($('.fullscreen'));
            
            // Start loading the lyrics
            lyrics = new Lyrics(self.lyrics);

            lyrics.load(function() {
                self.player.play();
                lyrics.display();
            });

            $('#acappella').live('click', self.aCappella.bind(self));
            $('#replay').live('click', self.backToCountDownPanel);
        }
    });
};
