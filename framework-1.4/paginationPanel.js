/**
 * @extends {Framework.AbstractConstraintPanel}
 * @constructor
 * @export
 */

Framework.PaginationPanel = Framework.AbstractConstraintPanel.extend({
    
    middleEntries: 4,
    edgeEntries: 2,
    
    events: {
        'click .fw-pagination-btn': 'onPaginationBtn'
    },

    initialize : function(options){
        Framework.AbstractConstraintPanel.prototype.initialize.call(this, options);
    },
    
    getInterval: function(current_page, np) {
        var ne_half = Math.ceil(this.middleEntries / 2);
        var upper_limit = np - this.middleEntries;
        var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
        var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(this.middleEntries, np);
        return [start, end];
    },
    
    onPaginationBtn: function(e) {
        var $el = $(e.currentTarget);
        var page = $el.data('page');
        var constraintModel = new this.source.ConstraintModelPrototype();
        constraintModel.setPageNumber(page);
        this.trigger('constraint:append', constraintModel);
    },
    
    reset: function() {}

})

Framework.PaginationPanel.prototype['preloadDataAsync'] = function(callback) {

//left, middle, right, selected, hasNext, hasPrevious, beginStr, endStr, count
//markup:  fw-pagination-btn  attr: data-page
    
    this.source.get(function() {      

        var constraintModel = this.source.getConstraintModel();       
        var data = {};
        
        data.pageSize = constraintModel.getPageSize();
        data.pageNumber = constraintModel.getPageNumber();
        data.count = this.source.count;
        data.totalPages = Math.ceil(data.count / data.pageSize);
        
        var interval = this.getInterval(data.pageNumber, data.totalPages);
        var noMiddle = false;       
        var left = [];      
        var lend = this.edgeEntries;
        if(this.edgeEntries >= interval[0]){
            noMiddle = true;
            lend = interval[1];
        }
        for (var i = 0, l = lend; i < l; i++) {
            left.push(i);
        }
        var right = [];
        var rightEdgeBegin = data.totalPages-this.edgeEntries;
        var rbegin = rightEdgeBegin;
        if(rightEdgeBegin <= interval[1]){
            noMiddle = true;
            rbegin = interval[0];
        }
        for (var i = rbegin, l = data.totalPages; i < l; i++) {
            right.push(i);
        }
        var middle = [];
        if(left[left.length-1] >= right[0]){
            left = [];
            right = [];
            for(var i = 0, l = data.totalPages; i < l; i++){
                middle.push(i);
            }
        }else if(!noMiddle){
            for(var i = interval[0], l = interval[1]; i < l; i++){
                middle.push(i);
            }
        }
        data.left = left;
        data.right = right;
        data.middle = middle;
        data.hasNext = data.pageNumber < data.totalPages-1;
        data.next = data.pageNumber + 1;
        data.hasPrevious = data.pageNumber > 0;
        if(!data.hasNext && !data.hasPrevious){
            data.left = data.right = data.middle = [];
        }
        data.previous = data.pageNumber -1;
        data.beginStr = (data.pageNumber * data.pageSize + 1);
        data.endStr = data.beginStr + data.pageSize -1;
        data.endStr = data.endStr > data.count ? data.count : data.endStr;
        callback(data);
    }.bind(this));
}

Framework.ScrollPaginationPanel = Framework.PaginationPanel.extend({});