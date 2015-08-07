AWFramework.AbstractRecordSelectionPanel = AWFramework.BaseView.extend({
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
        this.parent.clearSelection();
    },
    onClearOnPage : function(){
    	this.parent.clearPageSelection();
    },
    onSelectAll : function(){
        this.parent.selectAll();      
    },
    menus : [ ],

    selectedWord : 'selected',
    update : function(){

        this.parent.source.getAll(null, function(data){
			var count = Object.keys(this.parent.markedRecordsMap).length;
			this.$('#indicator, #selectAll, #clear, #clearOnPage, #clearOnPageAll, #menu').hide();
			if(count > 0){
				this.$('#indicator, #menu').show();
				this.$('#indicator').html(count + ' ' + this.selectedWord);
				this.$('#clear').show();
			}
			var allPresent = true;
			var nonePresent = true;
			for(var i = data.length-1; i>= 0; i--){
				if(!nonePresent && !allPresent)break;
					var e = this.parent.markedRecordsMap[data[i][this.parent.id]];
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
				this.afterUpdate(this.parent.markedRecordsMap, count);
			}   
        }.bind(this));

    },
    initialize : function(options){
        this.options = options ? options : {};  
        this.parent = this.options.parent;

    },

    render : function(){
    	this.callbacks = {};

    	for(var i = 0, l = this.menus.length; i < l; i++){
    		var id = this.menus[i].id;
    		if('#test'.substr(0,1) == '#'){

    		}else {
    			id = '#' + id;
    		}
    		this.callbacks[id] = this.menus[i].callback;
    		this.$(id).on('click', function(e){
    			var id = '#' + $(e.currentTarget)[0].id;
    			this.callbacks[id](this.parent.markedRecordsMap);
    			this.onClear();
    		}.bind(this));
    	}
    }

});