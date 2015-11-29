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
    
    getJSONString: function() {
        return JSON.stringify(this.constraints);
    },
    
    setFromJSONString: function(str) {
        this.constraints = JSON.parse(str);
    },
    mergeConstraints: function(result, constraints) {
        for (var prop in constraints) {
            var e = constraints[prop];
            if (typeof e === "number" || typeof e === "string" || typeof e === "boolean") {
                result[prop] = e;
            } else {
                if (e instanceof Array) {
                    if (result[prop]) {
                        result[prop] = result[prop].concat(e);
                    } else {
                        result[prop] = e;
                    }
                } else {
                    if (result[prop]) {
                        result[prop] = _.extend(result[prop], e);
                    } else {
                        result[prop] = e;
                    }
                }
            }
        }
        return result;
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
}
;

/**
* arrays get concat | strings, booleans and numbers get replaced | objects (not arrays) use _.extend
* @export
*/
Framework.AbstractConstraintModel.prototype.union = function(other) {
    var result = new this.constructor();
    result.constraints = this.mergeConstraints(result.constraints, this.constraints);
    result.constraints = this.mergeConstraints(result.constraints, other.constraints);
    return result;
}

/**
* @export
*/
Framework.AbstractConstraintModel.prototype.setField = function(name, value) {
    this.constraints[name] = value;
    if(value === null){
    	delete this.constraints[name];
    }
}

/**
* @export
*/
Framework.AbstractConstraintModel.prototype.getField = function(name) {
    return this.constraints[name];
}

Framework.AbstractConstraintModel.prototype['getUrl'] = function() {
    return "override me, refer to API for more help";
}

Framework.AbstractConstraintModel.prototype['defaultPageNumber'] = 0;
Framework.AbstractConstraintModel.prototype['defaultPageSize'] = 10;
 

Framework.AbstractConstraintModel.prototype['getPageNumber'] = function() {
    var pageNumber = this.getField('pageNumber');
    return (pageNumber === undefined) ? this.defaultPageNumber : pageNumber;
}

Framework.AbstractConstraintModel.prototype['getPageSize'] = function() {
    var pageSize = this.getField('pageSize');
    return (pageSize === undefined) ? this.defaultPageSize : pageSize;
}

Framework.AbstractConstraintModel.prototype['setPageNumber'] = function(pageNumber) {
    this.setField('pageNumber', pageNumber);
}

Framework.AbstractConstraintModel.prototype['setPageSize'] = function(pageSize) {
    this.setField('pageSize', pageSize);
}