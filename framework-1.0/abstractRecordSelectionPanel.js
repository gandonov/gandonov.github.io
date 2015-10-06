Framework.AbstractRecordSelectionPanel = Framework.BaseView.extend({
    events : {
      'click #clear' : 'onClear',
      'click #selectAll' : 'onSelectAll',
      'click #indicator' : 'onIndicator',
      'click #clearOnPage' : 'onClearOnPage',
      'click #clearOnPageAll' : 'onClearOnPage'
    },
    onIndicator : function(){
    	console.log('on indicator');
    },

    onClear : function(){
        this._parent.clearSelection();
    },
    onClearOnPage : function(){
    	this._parent.clearPageSelection();
    },
    onSelectAll : function(){
        this._parent.selectAll();      
    },
    menus : [ ],

    selectedWord : 'selected',
    update : function(){

        this._parent.source.getAll(null, function(data){
			var count = Object.keys(this._parent.markedRecordsMap).length;

			
			this.$('#indicator, #selectAll, #clear, #clearOnPage, #clearOnPageAll, .fw-rsp-at-least-one').hide();
			if(count > 0){
				this.$('#indicator, .fw-rsp-at-least-one').show();
				this.$('#indicator').html(count + ' ' + this.selectedWord);
				this.$('#clear').show();
			}
			var allPresent = true;
			var nonePresent = true;
			for(var i = data.length-1; i>= 0; i--){
				if(!nonePresent && !allPresent)break;
					var e = this._parent.markedRecordsMap[data[i][this._parent.id]];
				if(!e){
					allPresent = false;
				}else {
					nonePresent = false;
				}
			}
			if(data.length > 0){
				if(nonePresent){
					this.$('#selectAll').show();
				}else if(!nonePresent && !allPresent) {
					this.$('#clearOnPage').show();
				}
				if(allPresent){
					this.$('#clearOnPageAll').show();
				}				
			}


			if(this.afterUpdate){
				this.afterUpdate(this._parent.markedRecordsMap, count);
			}   
        }.bind(this));

    },
    initialize : function(options){
        this.options = options ? options : {};  
        this._parent = this.options.parent;

    },

    render : function(){
    	this.callbacks = {};
		this.noClear = {};
		this.$('#indicator, #clear, #clearOnPage, #clearOnPageAll, .fw-rsp-at-least-one').hide();
    	for(var i = 0, l = this.menus.length; i < l; i++){
    		var id = this.menus[i].id;
    		if('#test'.substr(0,1) == '#'){

    		}else {
    			id = '#' + id;
    		}
    		this.callbacks[id] = this.menus[i].callback;
    		this.noClear[id] = this.menus[i].noClear;
    		this.$(id).on('click', function(e){
    			var id = '#' + $(e.currentTarget)[0].id;
    			this.callbacks[id](this._parent.markedRecordsMap, this);
    			if(!this.noClear[id])
    			this.onClear();
    		}.bind(this));
    	}
    }

});