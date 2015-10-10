
AWLocalSourceConstraintModel = Framework.AbstractConstraintModel.extend({
    initialize : function(options) {
        Framework.AbstractConstraintModel.prototype.initialize.call(this, options);
        this.constraints = {};
        this.pageSize = 200;
        this.pageNumber = 0;
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
        var result = new K6ConstraintModel();
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

AWLocalSource = Framework.RestSource.extend({
    ConstraintModelPrototype : AWLocalSourceConstraintModel,   
    initialize : function(options){
        options = options ? options : {};
        Framework.RestSource.prototype.initialize.call(this, options);
        if(options.parseAsync){
            this.parseAsync = options.parseAsync;
        }
        this.data = options.data;
    },
    parseAsync : function(data, callback){
      callback(data);  
    },
    _localFilter : function(data, callback){
            var filtered = data;
            var constraintModel = this.constraintModel;

            var sort = constraintModel.getSort();
            if(sort){
                filtered = _.sortBy(filtered, function(o) { return o[sort.field] });
                if(sort.direction == "desc"){
                    filtered = filtered.reverse();
                }
            } 
            var p = this.constraintModel.pageNumber;
            var ps = this.constraintModel.pageSize;
            filtered = filtered.slice(p*ps, (p+1)*ps);                      
            callback(filtered);
    },
    getAll : function(path, callback, errorcallback, arg1, arg2, arg3, arg4, arg5, arg6){
        this.parseAsync(this.data, function(data){
            this._localFilter(data, callback);
        }.bind(this));
    }

});