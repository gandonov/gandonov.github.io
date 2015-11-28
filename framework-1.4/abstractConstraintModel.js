 /**
 * This class encapsulates changes caused by ConstraintPanels to RestSource. 
 * Any Constraint Panel must implement function called getConstraintModel which would return this object. At any momemnt in time, RestSource could collect 
 * constraint models from Constraint Panels subscribed to it and build the final ConstraintModel via intersection calls.
 * @example
MySource = new Framework.RestSource.extend({
	url : '/search'
	constraintType : "GET",
	ConstraintModelPrototype : MyConstraintModel // see AbstractConstraintModel for details
});

var source = new MySource();
source.get(function(data){
	console.log(data);
});

 * @constructor
 * @export
 */
Framework.AbstractConstraintModel = Backbone.View.extend({
    type: "GET",
    
    initialize: function() {
        this.constraints = {};

    },
    
    setSort: function(name, order) {
        if (!this.sort) {
            this.sort = {};
        }
        this.sort.name = name;
        this.sort.order = order;
    },
    getSort: function() {
        return this.sort;
    }
});
/**
* @constructor
* @export
*/
Framework.PostConstraintModel = Framework.AbstractConstraintModel.extend({
    type: 'POST'
});

/**
* @export
*/
Framework.PostConstraintModel.prototype.getBody = function() {
    throw "must override getBody";
};

/**
* @export
*/
Framework.AbstractConstraintModel.prototype.intersection = function(other) {
    var result = new this.constructor();
    if (this.getSort()) {
        result.setSort(this.getSort().name, this.getSort().order);
    }
    if (other.getSort()) {
        result.setSort(other.getSort().name, other.getSort().order);
    }
    if (this._psdirty) {
        result.setPageSize(this['getPageSize']());
    }
    if (this._pndirty) {
        result.setPageNumber(this['getPageNumber']());
    }
    if (other._psdirty) {
        result.setPageSize(other['getPageSize']());
    }
    if (other._pndirty) {
        result.setPageNumber(other['getPageNumber']());
    }
    if (other.getSort()) {
        result.setSort(other.getSort());
    }
    for (var prop in this.constraints) {
        result.constraints[prop] = this.constraints[prop];
    }
    for (var prop in other.constraints) {
        result.constraints[prop] = other.constraints[prop];
    }
    return result;
}

/**
* @export
*/
Framework.AbstractConstraintModel.prototype.setField = function(name, value) {
    this.constraints[name] = value;
};

/**
* @export
*/
Framework.AbstractConstraintModel.prototype.getField = function(name) {
    return this.constraints[name];
};

Framework.AbstractConstraintModel.prototype['getUrl'] = function() {
    return "override me";
}

Framework.AbstractConstraintModel.prototype['getPageNumber'] = function() {
    return this.pageNumber;
};

Framework.AbstractConstraintModel.prototype['getPageSize'] = function() {
    return this.pageSize;
};

Framework.AbstractConstraintModel.prototype['setPageNumber'] = function(page) {
    this.pageNumber = page;
    this._pndirty = true;
};

Framework.AbstractConstraintModel.prototype['setPageSize'] = function(page) {
    this.pageSize = page;
    this._psdirty = true;
};

/**
* @export
*/
Framework.AbstractConstraintModel.prototype._pndirty = false;
/**
* @export
*/
Framework.AbstractConstraintModel.prototype._psdirty = false;
