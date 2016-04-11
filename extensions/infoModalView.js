Framework.Ext.InfoModalView = Framework.BaseView.extend({
    template : "this is an absract view",
    buttons : '<a id="OKButton" class="waves-effect waves-green btn-flat">ok</a>',
    
    refreshable : false,
    initialize : function(options){
    	if(options.preloadDataAsync){
    		this.preloadDataAsync = options.preloadDataAsync;
    	}
    	if(options.refreshable){
    		this.refreshable = options.refreshable;
    	}

    	Framework.BaseView.prototype.initialize.call(this, options);
    	if(this.refreshable){
    	    this.buttons = this.buttons + '<a id="refreshInfo" class="waves-effect waves-green btn-flat">refresh</a>' ;
    	}
    },

    render : function(){
        if(this.refreshable){
            var $refresh = this.$modalHolder.find('#refreshInfo');
            $refresh.unbind();
            $refresh.on('click', function(){
                this.renderContent();
            }.bind(this));            
        }

    }
});
