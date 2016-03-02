Framework.Ext.UploadsEntryView = Framework.BaseView.extend({
    
    field: 'file',
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        this.beginUpload();
    },
    
    onDone: function() {
        this.$('#uploadProgress').html('done.');
    },
    onError: function() {
        this.$('#uploadProgress').html('error.');
    },
    onprogress: function(e) {
        console.log(e);
    },
    
    beginUpload: function() {
        var url = this._options.url;
        var file = this._options.file;
        var formData = new FormData();
        
        formData.append(this.field, file, file.name);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.onload = function(data) {
            var response = data.target.response;
            var status = data.target.status;
            if (status == 200) {
                this.onDone();
                this.trigger('done', response);
            } else {
                this.onError();
                this.trigger('error', response);
            }
        }
        .bind(this);
        xhr.onprogress = this.onprogress.bind(this);
        xhr.send(formData);
    },
    
    
    preloadDataAsync: function(callback) {
        callback({
            file: this._options.file
        });
    }

}),


Framework.Ext.UploadsView = Framework.BaseView.extend({
    events : {
        'click #collapse' : 'onCollapse'
    },

    onCollapse : function(){
        this.$('.uploader-body').addClass('hide');
    },
    onEntryDone: function(response, entry) {
        this.$('.uploader-body').removeClass('hide');
        this.trigger('done', response);

    },
    onEntryError: function(response, entry) {
        this.$('.uploader-body').removeClass('hide');
        this.trigger('error', response);

    },
    UploadsEntryViewConstructor: Framework.Ext.UploadsEntryView,
    
    addUpload: function(file, url) {
        this.$('.uploader-body').removeClass('hide');
        var entry = this.instantiate(this.UploadsEntryViewConstructor, {
            file: file,
            url: url
        });
        entry.renderView(function() {
            this.$('#entryContainer').append(entry.$el);
        }
        .bind(this));
        this.listenTo(entry, 'done', function(response){
            this.onEntryDone(response, entry);
        }.bind(this));
        this.listenTo(entry, 'error', function(response){
            this.onEntryError(response, entry);
        }.bind(this));    
    }
});
