DynamoDbConstraintModel = Framework.AbstractConstraintModel.extend({
    /*

     expected backend example (with vogles), query=lastKey:

     var r = DailyPuzzle.scan().limit(15);
     if(query){
     if(query.lastkey){
     r = r.startKey(query.lastkey);
     }
     }

     r.exec(callback);

     */

    getUrl: function () {
        var url = "";
        var lastkey = this.getField('lastkey');
        var prev = false;
        if (lastkey) {
            url += "lastkey=" + lastkey;
        }
        ;
        if(this.constraints){
            url += (prev ? "&" : "") +  "query=" + encodeURIComponent(JSON.stringify(this.constraints));
        }

        return url;
    }
});



DynamoDbSource = Framework.RestSource.extend({

    ConstraintModelPrototype: DynamoDbConstraintModel,

    initialize: function (options) {
        if(!options.url){
            throw "must provide url to the DynamoDbSource instance"
        }
        this.url = options.url;
        Framework.RestSource.prototype.initialize.call(this, options);
    }
});

DynamoDbViewer = Framework.Viewer.extend({

    template: null,

    snippets: {
        'viewerChunk': null,
        'chunkLoader': null
    },

    loadingTemplate: null,

    events: function () {
        return _.extend({}, Framework.Viewer.prototype.events, {
            'click #chunkLoader': 'onChunkLoader'
        });
    },

    initialize: function (options) {
        Framework.Viewer.prototype.initialize.call(this, options);
        this._timer = setInterval(this._onVisible.bind(this), 500);
    },

    _onVisible: function () {
        if (this.$('#loading').length > 0 && this._checkVisible(this.$('#loading')) && !this._requesting) {
            this.onChunkLoader();

        }
    },

    _checkVisible: function (elm) {
        var vpH = $(window).height()

            , // Viewport Height
            st = $(window).scrollTop()

            , // Scroll Top
            y = $(elm).offset().top

            , elementHeight = $(elm).height();
        //y = y * .8;
        return ( (y < (vpH + st) * 1.2) && (y > (st - elementHeight)));
    },
    onChunkLoader: function (e) {

        var lastkey = this.$('#chunkLoader').data('lastkey');
        if (lastkey) {
            this._requesting = true;
            var cm = this.source.getConstraintModel();
            cm.setField('lastkey', lastkey);
            this.getJSON(this.source.url + '?' + cm.getUrl(), function (data) {
                this._requesting = false;
                var chunk = this.snippet('viewerChunk', {
                    data: data.Items,
                    markedRecordsMap: this.markedRecordsMap,
                    idField: this.id
                });

                this.$('#chunkLoader').before(chunk);
                if (data.LastEvaluatedKey) {
                    this.$('#chunkLoader').data('lastkey', data.LastEvaluatedKey.id);
                } else {
                    this.$('#chunkLoader').remove();
                    this.$('#loading').remove();
                }
                this.afterChunk();
            }
                .bind(this));
        }

    },
    afterChunk: function () {
    }
});