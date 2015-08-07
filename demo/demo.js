$( document ).ready(function() {
    
    // This is a demo project/tutorial:

    // Step one: define your constraintModel
    // What kind of constraints does your rest source accept?
    // It could accept a POST request or a GET request
    // It must define some mandatory functions in order 
    // for framework to work properly
    // Here is an example of minimalistic constraintModel:
    
    DemoConstraintModel = AWFramework.AbstractConstraintModel.extend({
        
        // MUST override getUrl() even if constraintType is POST. 
        // this method should produce URL that adequately describes search constraint.
        getUrl : function(){
            var str = "fn=" + this.field1 + "&ln=" + this.field2 + "&ps=" + this.pageSize + "&p=" + this.pageNumber;
            if(this.sort){
                str += "&sf=" + this.sort.field;
                str += "&sd=" + this.sort.direction;
            }
            return str;
        },

        // the implementation and fields below are just an example,
        // as long as getUrl() and intersection() method are consistent
        // fields and their book keeping can be implemented any way desired
        setField1 : function(field1){
            this.field1 = field1;
            this._f1dirty = true;
        },
        setField2 : function(field2){
            this.field2 = field2;
            this._f2dirty = true;
        },
        setSort : function(sort){
            this.sort = sort;
        },
        getSort : function(){
            return this.sort;
        },
        // since we want to use pagination, we must define functions below
        setPageSize : function(pageSize){
            this.pageSize = pageSize;
            this._psdirty = true;
        },
        setPageNumber : function(pageNumber){
            this.pageNumber = pageNumber;
            this._pndirty = true;
        },
        getPageSize : function(pageSize){
            return this.pageSize;
        },
        getPageNumber : function(pageNumber){
            return this.pageNumber;
        },

        // technicall
        initialize : function(options) {
            // I recommend adding default values if any here
            this.field1 = "";
            this.field2 = "";
            this.pageSize = 100;
            this.pageNumber = 0;

            AWFramework.AbstractConstraintModel.prototype.initialize.call(this, options);
        },

        // This Method MUST not modify 'this' and return new constraintModel that would be intersection of 'this' and 'other'
        // Intersection can be implemented anyway desired as long as it is consistent
        intersection : function(other){
            var result = new DemoConstraintModel();
            // for this crude example we simply override previous constraintModel values if it is not default ""
            
            if(this.getSort()){
                result.setSort(this.getSort());
            }
            if(this._f1dirty){
                result.setField1(this.field1);
            }
            if(other._f1dirty){
                result.setField1(other.field1);
            }
            if(this._f2dirty){
                result.setField2(this.field2);
            }
            if(other._f2dirty){
                result.setField2(other.field2);
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
            return result;
        }        
    });

    //Step two: Setup your source

    DataSource = AWFramework.RestSource.extend({
        constraintType : "GET", 

        ConstraintModelPrototype : DemoConstraintModel, // important to provide proper ConstraintModelPrototype
        
        rootStructure : {
             "root" : 'data.json' //this is for the sake of the demo, in the real site this would point to your rest source.
        },
        // since we are implementing pagination, we must implement get count
        setCount : function(data){
            this.count = this._filter(this.constraintModel,data).length;
        },
        getCount : function(){
            return this.count;
        },
        // our server-side imitator
        _filter : function(constraintModel, data){
            var f1 = "";
            var f2 = "";
            if(constraintModel){
                f1 = constraintModel.field1;
                f2 = constraintModel.field2;
            }
            var filtered = data;
            if(f1 != ""){
                filtered = _.filter(filtered, function(obj) {
                    return obj['First Name'].toLowerCase().indexOf(f1.toLowerCase()) != -1;
                });               
            }
            if(f2 != ""){
                filtered = _.filter(filtered, function(obj) {
                    return obj['Last Name'].toLowerCase().indexOf(f2.toLowerCase()) != -1;
                });               
            }
            var sort = constraintModel.getSort();
            if(sort){
                filtered = _.sortBy(filtered, function(o) { return o[sort.field] });
                if(sort.direction == "desc"){
                    filtered = filtered.reverse();
                }
            }
            return filtered;
        },

        // Use the method
        parseAsync : function(data, callback){
            // do some stuff here to parse data;

            // since we don't really call the rest source to filter our results, let's imitate it here:
            var filtered = this._filter(this.constraintModel, data);

            // if you want to use pagination panel, you must provide total count variable this.count
            // and update it on every change of this.contraintModel; 
            this.count = filtered.length;

            // and to finish up, let's emulate server-side paging here
            if(this.constraintModel){
                var p = this.constraintModel.pageNumber;
                var ps = this.constraintModel.pageSize;
                filtered = filtered.slice(p*ps, (p+1)*ps);                
            }else {
                filtered = filtered.slice(0, 100);
            }

            // invoke callback with parsed data in the end;
            callback(filtered);
        }

    });
    dataSource = new DataSource();

    var favorites = {};
    DataSource2 = DataSource.extend({
        initialize : function(options){
            DataSource.prototype.initialize.call(this, options);
            this.noCache = true;
        },
        // we want all the functionality, but separate record stash
        parseAsync : function(data, callback){
            var favoritesArr = [];
            for(var prop in favorites){
                favoritesArr.push(favorites[prop]);
            }
            DataSource.prototype.parseAsync.call(this,favoritesArr,callback);
        }
    });

    dataSource2 = new DataSource2();
    //Step three: Let's add some constraintPanels:

    Field1ConstraintPanel = AWFramework.AbstractConstraintPanel.extend({

        // backbone events:
        events : {
		  'keyup input' : 'onInputKeyup',
        },
        onInputKeyup : function(e){
          this._startTimer();  
        },
        _startTimer : function(){
            clearTimeout(this._timer);
            this._timer = setTimeout( function(){
               this.onConstraintChange();
            }.bind(this),1000);
        },

        // every constraintPanel MUST implement getConstraintModel()
        // must return this.source.ConstraintModelPrototype
        getConstraintModel : function(){
            var constraintModel = new this.source.ConstraintModelPrototype();
            constraintModel.setField1(this.$('input').val());
            return constraintModel; 
        },
        // What to render on the screen
        render : function(){
            //this.$el.html('<label for="ci">First Name: <input for="ci">');
        }
    });
    Field2ConstraintPanel = Field1ConstraintPanel.extend({
        // we don't have to provide a template,
        // backbone allows us to point $el to an existing element tree
        // we will exploit this here

        getConstraintModel : function(){
            var constraintModel = new this.source.ConstraintModelPrototype();
            constraintModel.setField2(this.$('input').val());
            return constraintModel; 
        },
        // What to render on the screen
        render : function(){
            //this.$el.html('<label for="ci"> Last  Name:  <input for="ci">');
        }
    });

    SortByConstraintPanel = AWFramework.AbstractConstraintPanel.extend({
        
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
              var $sort = this.$('#sort');
              var html = $sort.html();
              if(html == 'arrow_drop_up sort'){
                  $sort.html('arrow_drop_down sort');
              }else {
                  $sort.html('arrow_drop_up sort');
              }
          }
          this.column = column;
          this.$('label').html('sorted by ' + this.column);
          if(!column){

              this.$el.addClass('hide');
          }else {
              this.$
              this.$el.removeClass('hide');
          }
          this.onConstraintChange();
        },
        getConstraintModel : function(){
            var constraintModel = new this.source.ConstraintModelPrototype();
            if(!this.$el.hasClass('hide')){
              var $sort = this.$('#sort');
              var html = $sort.html(); 
              var direction = (html == 'arrow_drop_down sort') ? 'desc' : 'asc';
              var field = this.column;
              constraintModel.setSort({ field: field, direction : direction});              
            }
            return constraintModel; 
        },        
    });

    // let's add another constraintPanel -- pagination
    DemoPaginationPanel = AWFramework.PaginationPanel.extend({
        DEFAULT_ITEMS_PER_PAGE : 10,
        template : 'templates/PaginationPanel.html',
        initialize : function(options){
            AWFramework.PaginationPanel.prototype.initialize.call(this, options);	    
        }
    });


    var field1ConstraintPanel = new Field1ConstraintPanel({ source : dataSource}); // any constraintPanel should be attached to it's source
    var field2ConstraintPanel = new Field2ConstraintPanel({ source : dataSource});
    var sortByConstraintPanel = new SortByConstraintPanel({ source : dataSource});
    var demoPaginationPanel = new DemoPaginationPanel({ source : dataSource});
    //var demoPaginationPanel2 = new DemoPaginationPanel({ source : dataSource2});

    // since all the views in framework extend from Backbone Views. let's use Backbone's setElement() to render contents of our ConstraintPaenl into $el
    // to actually render please use renderView(), it is specific to framework and does some stuff behind the scene, such as lazily fetching and rendering
    // underscore template if there is any

    field1ConstraintPanel.setElement($('#fname')).renderView();
    field2ConstraintPanel.setElement($('#lname')).renderView();
    sortByConstraintPanel.setElement($('#sortConstraint')).renderView();
    demoPaginationPanel.setElement($('#ePagination')).renderView();
    //demoPaginationPanel2.setElement($('#fPagination')).renderView();
    // Step four: Let's actually display our data!
    
    // Framework allows to view your data using "viewers", these are the views that display data the way you like and you can switch between them

    // let's create couple simple viewers:

    DemoColumnView = AWFramework.AbstractViewer.extend({
        
        // leveraging underscore template to seprate html and javascript
        template: 'templates/Column.html',
        
        events: _.extend({
            'click .demo-column-header': 'onColumnClick',
        }, AWFramework.AbstractViewer.prototype.events), 

        onColumnClick : function(e){
            var $td = $(e.currentTarget);
            var column = $td.data('column');
            // to save tutorial time let's call sortByConstraintPanel directly
            sortByConstraintPanel.update(column);

        },      
        _afterShow : function(){
            AWFramework.AbstractViewer.prototype._afterShow.call(this);
            
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
            
        },
        // this defines how you would like the viewer button to look like if indicator field is present it would show html, otherwise just <li>this.name</li>
        indicator : ' <a><i class="material-icons">view_list</i></a>',
        
        // come up with a name for this viewer, MUST be provided
        name : 'column',

        // anytime dataSource changes, show(data) method will be envoked


    });
    DemoListView = AWFramework.AbstractViewer.extend({
        indicator : ' <a><i class="material-icons">view_module</i></a>',
        template: 'templates/List.html',
        name : 'list',

    });
    DemoImagesView = AWFramework.AbstractViewer.extend({
        template: 'templates/Images.html',
        name : 'images'
    });
    var $actionMenu = $('#message');
    //$('body').prepend($actionMenu);

    // Let's create simple record selection panel prototype:
    DemoRecordSelectionPanel = AWFramework.AbstractRecordSelectionPanel.extend({
        template: 'templates/RecordSelectionPanel.html',        

        menus : [        
            { 
                id : '#a', 
                // sample callback action, m is the map of records that are currently checked.
                callback : function(m){ 
                    for(var prop in m){ 
                        favorites[prop] = m[prop];
                    } 
                    
                    dataSource2.refresh();               
                }
            },
            { id : '#b', callback : function(m){ $actionMenu.html('b called');console.log(m); } },
            { id : '#c', callback : function(m){ $actionMenu.html('c called');console.log(m); } },
            { id : '#d', callback : function(m){ $actionMenu.html('d called');console.log(m); } },
        ],
        // for demonstrative purposes let's hide menu c and d if record count > 1
        afterUpdate : function(m, count){
            if(count > 1){
                this.$('#c,#d').hide();
            }else {
                this.$('#c,#d').show();
            }
        } 

    });
    DemoRecordSelectionPanel2 = DemoRecordSelectionPanel.extend({
       template: 'templates/FavoritesRecordSelectionPanel.html',  
        menus : [        
            { 
                id : '#a', 
                // sample callback action, m is the map of records that are currently checked.
                callback : function(m){ 
                    for(var prop in m){
                        delete favorites[prop];
                    } 
                    dataSource2.refresh();             
                }
            }
        ],
    });

    // now let's create our Viewer Holder, aka SourceView:
    DemoSourceView = AWFramework.SourceView.extend({
	    recordSelectionPanelEl : "#recordSelectionPanelEl",
        viewSelectionPanelEl : '#viewSelectionPanelEl',
        checkboxSelection : true,
        recordSelectionPanelPrototype : DemoRecordSelectionPanel, // We define here what recordSelectionPanel to use with this sourceView
        id : 'id', // important : id is the id field for the records that come in from dataSource
        initialView : 'column', // name of the viewer that you would like to use by default
        viewers : [DemoColumnView,DemoListView],
        // by default these functions do only this.trigger('click', record) and this.trigger('dblclick', record)
        // let's override those for demo purposes:

        handleDblclick : function(record){
            $actionMenu.html('dblclick: ' + record['First Name'] + '[' + record.id + ']'); 
        },
        handleClick : function(record){
            $actionMenu.html('click: ' + record['First Name'] + '[' + record.id + ']'); 	
        },

        handleMouseover : function(record){
            $actionMenu.html('mouseover: ' + record['First Name'] + '[' + record.id + ']'); 
            this._lastId = record.id;
            this._startTimer();
        },
        handleMouseleave : function(record){
            this._lastId = null;
            $actionMenu.html('mouseleave: ' + record['First Name'] + '[' + record.id + ']'); 
        },
        _startTimer : function(){
            clearTimeout(this._timer);
        },


    });

    DemoSourceView2 = DemoSourceView.extend({
        recordSelectionPanelEl : "#favoriteRecordSelectionPanelEl",
        checkboxSelection : true,
        recordSelectionPanelPrototype : DemoRecordSelectionPanel2,
        initialView : 'images',
        viewers : [DemoImagesView],
    });
    
    // let's instantiate:
    demoSourceView = new DemoSourceView({source : dataSource}); // and let's point it to our dataSource

    $('#changeSelectionMethod').on('change', function(e){
       demoSourceView.checkboxSelection = $(this).prop('checked');
       dataSource.refresh();
    });
    demoSourceView2 = new DemoSourceView2({source : dataSource2}); // and let's point it to our dataSource

    // to avoid the selection confusion, let's disallow simultaneous selection on two views:
    demoSourceView.listenTo(demoSourceView, 'selectionChanged', function(){
       demoSourceView2.clearSelection();
    });
    demoSourceView2.listenTo(demoSourceView2, 'selectionChanged', function(){
       demoSourceView.clearSelection();
    });


    demoSourceView.setElement($('#everything')).renderView(function(){
        demoSourceView2.setElement($('#favorites')).renderView(function(){
            //once all rendering is done
            //shake up our dataSource to force our sourceView to show records
            demoPaginationPanel.onConstraintChange();
            dataSource2.refresh();
        });
    });


    // This concludes part one of the tutorial

});