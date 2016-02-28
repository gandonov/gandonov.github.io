Framework.Ext.UploadsView = Framework.BaseView.extend({
    field : 'file',
    url : null,

    initialize : function(options){
        Framework.BaseView.prototype.initialize.call(this, options);

        this.beginUpload(this._options.files);
    },
    
    onprogress : function(e){
        console.log(e);
    },

    beginUpload : function(files){
        var file = files[0];
        var formData = new FormData();
        formData.append(this.field, file, file.name);
        var xhr = new XMLHttpRequest();
        var url = this._options.url;
        this.setOverlay();
        xhr.open('POST', url, true);
        xhr.onload = function(data) {
            var response = data.target.response;
            this.trigger('uploaded');
        }.bind(this);
        xhr.onprogress = this.onprogress.bind(this);
        xhr.send(formData);
    },

    preloadDataAsync: function(callback) {
        callback({
            files: this._options.files
        });
    }
});
