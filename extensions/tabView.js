
TabView = Framework.BaseView.extend({
	initialize : function(options){
	    Framework.BaseView.prototype.initialize.call(this, options);
	    this._tabMap = {};
	},

    events : {
    	'click .fw-tab-toggle' : 'tabChange'
    },

    tabChange : function(e){
    	var $el = $(e.currentTarget);
        var id = $el[0].id;
        if(this.persistBy){
        	this.setParameter(this.persistBy, id);
        }
        var constructor = $el.data('viewconstructor');
        var $div = this.$('.fw-tab-content[data-id="' + id+ '"]');
        var $for = this.$('.fw-tab-content[data-for="' + id+ '"]');
        if($div.length == 0){
        	throw "corresponding div does not exist";
        }
        this.$('.fw-tab-toggle').removeClass('active');
        $el.addClass('active');
        this.$('.fw-tab-content').hide();
        $div.show();
        $for.show();
        if(!this._tabMap[id]){
        	this._tabMap[id] = true;
			var Constructor = null; 
			if(constructor && window[constructor]){
				Constructor = window[constructor];
			}else {
				throw "constructor " + constructor + " does not exist";
			}
        	this.instantiateView('content_' + id, Constructor, {});
         	this['content_' + id].setElement($div).renderView();
        }
        this.trigger('tab:' + id);
    },

    setTabByIndex : function(index){
    	this.$(this.$('.fw-tab-toggle')[index]).click();
    },

    setTabById : function(id){
    	this.$('.fw-tab-toggle#' + id).click();
    },

	render : function(){
		this.$('.fw-tab-content').hide();
		if(this.persistBy && this.getParameter(this.persistBy)){
			this.setTabById(this.getParameter(this.persistBy));
		}else {
			this.$('.fw-tab-toggle.active').click();
			if(this._options.openTab){
				this.setTabById(this._options.openTab);
			}			
		}

	}
});

TabSampleView = TabView.extend({
	template : TemplatePaths.common + 'templates/TabSampleView.html',
	initialize : function(options){
		// this is a shortcut for demonstration only, do not declare your classes in here.
		window["sampleClassA"] = Framework.BaseView.extend({ render : function(){ this.$el.html("rendered content of A")}});
		window["sampleClassB"] = Framework.BaseView.extend({ render : function(){ this.$el.html("rendered content of B")}});
		window["sampleClassC"] = Framework.BaseView.extend({ render : function(){ this.$el.html("rendered content of C")}});
		TabView.prototype.initialize.call(this, options);
	}
});