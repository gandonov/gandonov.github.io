InfoModal = ModalView.extend({
    template : TemplatePaths.common + 'templates/InfoModal.html',
    buttons : '<a id="OKButton" class="waves-effect waves-green btn-flat">ok</a>',
    
    refreshable : false,
    initialize : function(options){
    	if(options.preloadDataAsync){
    		this.preloadDataAsync = options.preloadDataAsync;
    	}
    	if(options.refreshable){
    		this.refreshable = options.refreshable;
    	}
//     	if(options.refresh){
//     	    this.buttons = '<a id="OKButton" class="waves-effect waves-green btn-flat">ok</a><a id="refresh" class="waves-effect waves-green btn-flat">refresh</a>';
//     	}
    	ModalView.prototype.initialize.call(this, options);
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
        
//         $refresh.on('click', function(){
//             this.renderView();
//         }.bind(this));
    }
});
