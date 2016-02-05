MassActionSelectionPanel = Framework.ViewerActionPanel.extend({
    
    events: {
        'click .fw-mass-action': 'onMassAction'
    },
    type : "POST",
    
    onMassAction: function(e) {
        var $el = $(e.currentTarget);
        var url = $el.data('fwurl');
        var fwaname = $el.data('fwaname');
        var ids = this._preloadData.ids;
        this.postJSON(url, 
        function(response) {
            this.onMassActionSucces({
                response: response,
                url: url,
                actionName: fwaname,
                ids: ids
            });
        }
        .bind(this), function(response) {
            this.onMassActionError({
                response: response,
                url: url,
                actionName: fwaname,
                ids: ids
            });
        }
        .bind(this), ids, this.type);
    
    },
    
    onMassActionSucces: function(data) {
        Materialize.toast('Performed "' + data.actionName + '" on ' + data.ids.length + ' records successfully.', 4000);
    },
    
    onMassActionError: function(data) {
        Materialize.toast('Error while performing "' + data.actionName + '" on ' + data.ids.length + ' records.', 4000);
    }
});
