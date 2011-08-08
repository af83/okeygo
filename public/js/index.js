$(document).ready(function () {

    $('#loading').hide().ajaxStart(function() {
        $(this).css("position", "absolute");
        $(this).css("top", ($(window).height() - $(this).height())/ 2 + $(window).scrollTop() + "px");
        $(this).css("left", ($(window).width() - $(this).width()) / 2 + $(window).scrollLeft() + "px");
        $(this).show();
    }).ajaxStop(function() {
        $(this).hide();
    });

    $( "#dialog" ).dialog({
        autoOpen: false,
        width: 450,
        position:[($(window).width() - 550), 'center']
    });

    window.Song = Backbone.Model.extend({
        name: function() {
            return this.get('artist') + ' - ' + this.get('title');
        },
        key: function() {
            return this.get('artist')[0].toLocaleUpperCase();
        }
    });

    window.PlayList = Backbone.Collection.extend({
        model: Song,
        url: '/js/songs.json',
        alpha: function() {
            return this.sortBy(function(song) {
                return song.name().toLowerCase();
            });
        },
        sortKeys: function() {
            return _.uniq(_.map(this.alpha(), function(s) { return s.key(); }), true);
        }
    });

    window.SongView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#song-template').html()),
        events: {
            'click a.play': 'play',
            'mouseenter img.cover': 'showPreview',
            'mouseleave img.cover': 'closePreview'
        },

        render: function() {
            $(this.el).html(this.template(this.model.toJSON()));
            return this;
        },

        play: function(e) {
            e.preventDefault();
            $('#songs').hide();
            $(window).sausage("block");
            this.closePreview();
            var songPanel = new SongPanel(this.model.toJSON());
            songPanel.sing();
        },

        showPreview: function(e) {
            var self = this;
            $('#dialog').empty();
            $('#dialog').dialog( "option", "title", this.model.name());
            // Start loading the lyrics
            lyrics = new Lyrics(this.model.get('lyrics'));
            lyrics.load(function() {
                $('#dialog').append('<img src="'+ self.model.get('thumb') +'" alt="'+ self.model.name() +'" />');
                _.each(lyrics.lyrics.slice(0, 5), function(l) {
                    $('#dialog').append('<p>' + _.reduce(l, function(memo, obj) {
                        return memo + obj.text;
                    }, "") + '</p>');
                });
                $( "#dialog" ).dialog( "open" );
            });
        },

        closePreview: function() {
            $( "#dialog" ).dialog( "close" );
        }
    });

    window.SongsView = Backbone.View.extend({
        el: '#songs',

        template: _.template($('#songs-template').html()),

        initialize: function(songs) {
            this.Songs = new PlayList(songs);
            this.render();
            this.addAll();
        },

        render: function() {
            $(this.el).html(this.template({keys: this.Songs.sortKeys()}));
        },

        addOne: function(song) {
            var view = new SongView({model: song});
            this.$('#' + song.key()).append(view.render().el);
        },
        addAll: function() {
            _.each(this.Songs.alpha(), this.addOne);
        }
    });

    $.getJSON('/js/songs.json', function(data) {
        var view = new SongsView(data);

        $(window).sausage({
            page: 'ul',
            content: function (i, $page) {
                return '<div class="sausage-span">' + $page.data('key-name') + '</div>';
            }
        });
    });
});
