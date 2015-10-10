InfoPanel = Framework.BaseView.extend({ 
    template : TemplatePaths.common + 'templates/InfoPanel.html',
    contentTemplate : TemplatePaths.common + 'templates/InfoPanelDefault.html',
    choiceDelay : 300,
    onSelecting : function(){
       this.$('#loaded').addClass('hide');
       this.$('#loading').removeClass('hide');
    },
    onSelected : function(record){
        this.lastSelected = record;
       if(record == null){
           this.$('#loaded').removeClass('hide');
           this.$('#loading').addClass('hide');          
       }else {
           this.loadAsync(record, function(data){
               this.$('#loaded').removeClass('hide');
               this.$('#loading').addClass('hide');              
               this.renderContent(data, this.$('#loadedContent'),record);
           }.bind(this), function(data){
               this.$('#loaded').removeClass('hide');
               this.$('#loading').addClass('hide');              
               this.renderError(data, this.$('#loadedContent'),record);           
           }.bind(this));
       }
    },
    
    loadAsync : function(record, callback){
        callback(record);
    },

    renderError : function(data, $el,record){
        $el.html('error occured.');  
    },
    afterRenderContent : function(data, record){

    },

    renderContent : function(data, $el,record){
        if(!this.contentTemplateView){
            this.instantiateView('contentTemplateView', Framework.BaseView, {});
            this.contentTemplateView.template = this.contentTemplate;
        }
        this.contentTemplateView.setElement($el).renderView( function(){
            this.afterRenderContent(data, record);
        }.bind(this),{
            data : data,
            record : record
        });
    },

    _startTimer : function(){
        if(!this._selecting){
            this.onSelecting();
            this._selecting = true;
        }
        clearTimeout(this._timer);
        this._timer = setTimeout( function(){
            this._selecting = false;
            this.onSelected(this._lastId);               
        }.bind(this),this.choiceDelay);
    },
    refresh : function(){
        this._startTimer();  
    },
    handleMouseover : function(record){
        //$actionMenu.html('mouseover: ' + record['libraryName'] + '[' + record.uuid + ']'); 
        this._lastId = record;
        this._startTimer();
    },
    handleMouseleave : function(record){

        this._lastId = null;
        //$actionMenu.html('mouseleave: ' + record['libraryName'] + '[' + record.uuid + ']'); 
    }, 
    handleUnselected : function(){
        this._lastId = null;
        this._killChildren();
        
        if(this.contentTemplateView){
            this.contentTemplateView.destroy();
            this.contentTemplateView = null;
        }
       this.$('#loaded').addClass('hide');
       this.$('#loading').addClass('hide');     
    },

    initialize : function(options){       
        Framework.BaseView.prototype.initialize.call(this,options);
        this.sourceView = options.sourceView;
        this.instantiateView('contentTemplateView', Framework.BaseView, {});
        this.contentTemplateView.template = this.contentTemplate;

        if(this.sourceView.selectSingle){
            this.listenTo(this.sourceView, 'selected',this.handleMouseover.bind(this));
            this.listenTo(this.sourceView, 'unselected',this.handleUnselected.bind(this));
        }else {
            this.listenTo(this.sourceView, 'mouseover',this.handleMouseover.bind(this));
            this.listenTo(this.sourceView, 'mouseleave',this.handleMouseleave.bind(this));            
        }

    }
});