
K6SortByConstraintPanel = Framework.AbstractConstraintPanel.extend({

    events : {
        'click #close' : 'remove',
        'click #sortBtn' : 'onSortBtn',
    },
    onSortBtn : function(){
      this.update(this.column);  
    },
    remove : function(){
        this.update(null);
    },
    update : function(column){
      if(this.column && this.column == column){
          if(this.sort == null){
              this.sort = 'asc';
          } else if(this.sort == 'asc'){
              this.sort = 'desc';
          }else if(this.sort = 'desc'){
              this.sort = null;
              this.column = null;
          }
      }else {
          this.sort = 'asc';
          this.column = column;
      }
      this.onConstraintChange();
    },
  
    getConstraintModel : function(){

    },        
});



GPOConstraintModel = Framework.AbstractConstraintModel.extend({


    initialize : function(options) {
        Framework.AbstractConstraintModel.prototype.initialize.call(this, options);
        this.constraints = {};
        this.pageSize = 10;
        this.pageNumber = 0;
    },
    getUrl : function(){
        //http://10.1.2.38/fw-server/rest/product/pageable/list?filterscount=0&groupscount=0&sortdatafield=libraryName&sortorder=asc&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10
        var str = "page=" + (this.getPageNumber()) + "&size=" + this.getPageSize();
        if(this.constraints && !$.isEmptyObject(this.constraints)){
            str += "&constraints=" + JSON.stringify(this.constraints);           
        }

        if(this.sort){
            str += "&sort=" + this.sort.field + ',' + this.sort.direction;
        }
        return str;
    },
    setSort : function(sort){
        this.sort = sort;
    },
    getSort : function(){
        return this.sort;
    },
    setPageSize : function(pageSize){
        this.pageSize = pageSize;
        this._psdirty = true;
    },
    setPageNumber : function(pageNumber){
        this.pageNumber = pageNumber;
        this._pndirty = true;
    },
    getPageSize : function(){
        return this.pageSize;
    },
    getPageNumber : function(pageNumber){
        return this.pageNumber;
    },


    intersection : function(other){
        var result = new GPOConstraintModel();
        if(this.getSort()){
            result.setSort(this.getSort());
        }
        if(this._psdirty){
            result.setPageSize(this.getPageSize());
        }
        if(this._pndirty){
            result.setPageNumber(this.getPageNumber());
        }            
        if(other._psdirty){
            result.setPageSize(other.getPageSize());
        }
        if(other._pndirty){
            result.setPageNumber(other.getPageNumber());
        }
        if(other.getSort()){
            result.setSort(other.getSort());
        }
        for(var prop in this.constraints){
            result.constraints[prop] = this.constraints[prop];
        }
        for(var prop in other.constraints){
            result.constraints[prop] = other.constraints[prop];
        }
        return result;
    }   
});    

K6Viewer = Framework.AbstractViewer.extend({
    template : Framework.Ext.TemplatePath + 'templates/viewers/K6Viewer.html',
    name : 'k6viewer',

    events: _.extend({
        'click .demo-column-header': 'onColumnClick',
        'click .k6-action' : 'onAction',

    }, Framework.AbstractViewer.prototype.events),

    previous : function(e){
        var $row = this.$('.fw-row-selected');
        $row.prev().trigger('mousedown');
    },
    next : function(e){
        var $row = this.$('.fw-row-selected');
        $row.next().trigger('mousedown');
    },
    onAction : function(e){
        var action = e.currentTarget.id;
        var id = $(e.currentTarget).data('id');
        var record = this._getRecordById(id);
        this._parent.trigger('action:' + action, record);
    },
    updateSort : function(column){
      if(this.column && this.column == column){
          if(this.sort == null){
              this.sort = 'asc';
          } else if(this.sort == 'asc'){
              this.sort = 'desc';
          }else if(this.sort = 'desc'){
              this.sort = null;
              this.column = null;
          }
      }else {
          this.sort = 'asc';
          this.column = column;
      }
      this.onConstraintChange();
    },

    getConstraintModel : function(){
        if(this._parent._firstcolumn){
            this.column = this._parent._firstcolumn;
            this.sort = this._parent._firstsort;
            this._parent._firstcolumn = null;
            this._parent._firstsort = null;                
        }
        var constraintModel = new this.parent.source.ConstraintModelPrototype();
        if(this.sort){
          var field = this.column;
          constraintModel.setSort({ field: field, direction : this.sort});              
        }
        return constraintModel;             
    },
    onColumnClick : function(e){
        var $td = $(e.currentTarget);
        var column = $td.data('column');
        // to save tutorial time let's call sortByConstraintPanel directly
        this.updateSort(column);

    },

    show : function(data){
        var temp = this.template;
        if((!data || data.length == 0) && this._parent.emptyTemplate){
            this.template = this._parent.emptyTemplate;
        }
        this.renderView(this._afterShow.bind(this), {
            markedRecordsMap : this.parent.markedRecordsMap,
            data: data, 
            selectSingle : this.parent.selectSingle,
            id : this.parent.id,
            columns : this.parent.columns,
            columnHeaders : this.parent.columnHeaders,
            selected : this.parent._selected,
            actions : this.parent.actions,
            tableClass : this.parent.tableClass,
            wrapperClass : this.parent.wrapperClass,
            selectionMethod : this.parent.selectionMethod
        });    
        this.template = temp;  
    },        
    _afterShow : function(){
        Framework.AbstractViewer.prototype._afterShow.call(this);

        var constraintModel = this.parent.source.constraintModel;
        var sort = constraintModel.getSort();
        if(sort){
           var $array = this.$('.demo-column-header');

            for(var i = 0, l = $array.length; i < l; i++){
                var $el = $($array[i]);
                var column = $el.data('column');
                if(column == sort.field){
                    var $si = $('<i class="tiny material-icons">');
                    $si.html(sort.direction == 'desc' ? 'arrow_drop_down' : 'arrow_drop_up');
                    $el.prepend($si);
                    break;
                }
            }
        }
        if(this.parent.noHeader){
            this.$('.fw-column-header-row').remove();
        }
        if(this.parent._selectFirst){
            this.parent._selectFirst = false;
            $(this.$('.fw-record')[0]).trigger('mousedown');
        }
    }
});
K6ViewerList = K6Viewer.extend({
    template : Framework.Ext.TemplatePath + 'templates/viewers/K6ViewerList.html',
    name : 'k6viewerList',   
});

K6SourceView = Framework.SourceView.extend({
    initialView : 'k6viewer',
    actions : [],
    wrapperClass : '', //card k6-table-card
    tableClass : 'compact',
    id : 'id',
    events : {
        'keydown #viewer_holder' : 'onKeyup'
    },
    onKeyup : function(e){
        if(this._selectSingleSelection){
            if(e.keyCode == 40){
              this.viewer.next();
            }else if(e.keyCode == 38) {
              this.viewer.previous();
            }                
        }
    },    
    columns : ['id'],
    columnHeaders : {},

    K6Source : Framework.RestSource.extend({
        ConstraintModelPrototype : GPOConstraintModel,
        constraintType : 'GET',
        parseAsync : function(data, callback){
            if(data && data.page){
                this.count = data.page.totalElements;
            } else {
                this.count = data.length;
            }
            if(data.content){
                callback(data.content);
            } else {
                callback(data);
            }

        },
        initialize : function(options){
            this.url = options.url;
            this.rootStructure = {
                'root' : this.url
            };
            Framework.RestSource.prototype.initialize.call(this, options);
            //this.noCache = true;
        }
    }),
    PaginationPanel : Framework.PaginationPanel.extend({
            DEFAULT_ITEMS_PER_PAGE : 10,
            template : Framework.Ext.TemplatePath + 'templates/PaginationPanel.html'
    }),
    pageSize : 10,

    initialize : function(options){
        this.url = options.url;
        this.noPagination = options.noPagination;
        if(options.PaginationPanel){
            this.PaginationPanel = options.PaginationPanel
        }
        if(options.tableClass){
            this.tableClass = options.tableClass;
        }
        if(options.wrapperClass){
            this.wrapperClass = options.wrapperClass;
        }
        if(options.actions){
            this.actions = options.actions;
        }
        if(options.selectionMethod){
            this.selectionMethod = options.selectionMethod;
        }
        if(options.id){
            this.id = options.id;
        }
        if(options.columnHeaders){
            this.columnHeaders = options.columnHeaders;
        }

        if(options.pageSize){
            this.pageSize = options.pageSize;
        }
        if(options.selectFirst){
            this._selectFirst = true;
        }
        if(options.noHeader){
            this.noHeader = options.noHeader;
        }
        if(options.recordSelectionPanelEl){
            this.recordSelectionPanelEl = options.recordSelectionPanelEl;
        }
        if(options.recordSelectionPanelPrototype){
            this.recordSelectionPanelPrototype = options.recordSelectionPanelPrototype;
        }
        if(options.selectSingle){
            this.selectSingle = options.selectSingle;
        }
        if(options.emptyTemplate){
            this.emptyTemplate = options.emptyTemplate;
        }
        var newOptions = {};
        newOptions.initialView = options.initialView;
        newOptions.columns = this.columns;
        if(!options.source){
            this.source = new this.K6Source({url : this.url});           
        }else {
            this.source = options.source;
        }

        if(options.parseAsync){
            this.source.parseAsync = options.parseAsync;
        }
         if(options.startSort){
            this._firstsort = options.startSort.direction;
            this._firstcolumn = options.startSort.column;
        }
        newOptions.source = this.source;
        if(options.columns){
            newOptions.columns = options.columns;
        }

        this.viewers = [K6Viewer, K6ViewerList];
        

        if(!this.noPagination){
            this.paginationPanel =  new this.PaginationPanel({ source : this.source, items_per_page : this.pageSize});           
        }

        Framework.SourceView.prototype.initialize.call(this, newOptions);
    },
    render : function(){

        Framework.SourceView.prototype.render.call(this);
        if(!this.noPagination){
            var $paginationPanel = $('<div class="col s12">');
            this.$el.append($paginationPanel);
            this.paginationPanel.setElement($paginationPanel).renderView();            
        }

        this.source.refresh();
    }

});