AWFramework.AbstractConstraintModel = Backbone.View.extend({


    intersection : function(){
        throw "ConstraintModel must implement intersection";
    },
    isEmpty : function() {
        throw "ConstraintModel must implement isEmpty";
    },

    setAttribute: function(name, value){
    	throw "ConstraintModel must implement setAttribute";
    },

    setSort: function(name, order){
    	throw "ConstraintModel must implement setSort";
    },

    setPageNumber : function(page){
        this.pageNumber = page + 1;
    },

    getPageNumber : function(){
        return this.pageNumber;  
    },

    setPageSize : function(page){
        this.pageSize = page;
    },
    
    getPageSize : function(){
        return this.pageSize;
    },

    getRecordOffset : function(){
        return ((this.pageNumber -1) * this.pageSize) + 1;
    },
    
});

