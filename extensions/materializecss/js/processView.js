ProcessView = Framework.BaseView.extend({
    template: Framework.Ext.TemplatePath + 'templates/ProcessView.html',
    
    initialize: function(options) {
        Framework.BaseView.prototype.initialize.call(this, options);
        if (options.process) {
            this.process = options.process;
        }
    },
    
    process: function(callback, error) {
        setTimeout(function() {
            var info = {
                message: "done lol"
            };
            callback(info);
        }
        .bind(this), 1000)
    }
});

ProcessModal = MaterializeModal.extend({
    in_duration: 0,
    out_duration: 0,
    dismissible : false,
    success: function(data) {
        console.log(data);
    },
    
    error: function(data) {
        console.log('do nothing on error');
    },

    onError : function(data){
        this.close();
        this.error(data);
    },

    onSuccess : function(data){
        this.close();
        this.success(data);
    },
    
    initialize: function(options) {
        options = options ? options : {};
        options.ContentView = ProcessView;
        options.contentOptions = {};
        options.contentOptions.process = options.process;
        if (options.success) {
            this.success = options.success;
        }
        if (options.error) {
            this.error = options.error;
        }
        MaterializeModal.prototype.initialize.call(this, options);
    },
    render: function() {
        MaterializeModal.prototype.render.call(this, function(){
             this.contentView.process(this.onSuccess.bind(this), this.onError.bind(this));
        }.bind(this));
    }
});
