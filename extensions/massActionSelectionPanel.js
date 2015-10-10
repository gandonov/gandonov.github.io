MassActionSelectionPanel = Framework.AbstractRecordSelectionPanel.extend({ 
    massActionType : "POST",
    massActionUrl : '/fr-server/rest/product/action/mass/',   
    massAction : function(action, m, callback){
        var url = this.massActionUrl + action;
        var list = [];
        for(var i in m){
            list.push(i);
        }
		$.ajax({
			type : this.massActionType,
			url : url, 
			dataType: 'json',
			processData : false,
			contentType : "application/json",
			data : JSON.stringify(list),			
			success : function(data){	
			     			
                 Materialize.toast('Performed "' + action + '" on ' + list.length + ' records successfully.', 4000);
			     if(callback){
			         callback();
			     }
			},
			error : function(data){
				Materialize.toast('Error performing "' + action + '" on ' + list.length + ' records.', 4000);
			}
		});
    },
    render : function(){
         Framework.AbstractRecordSelectionPanel.prototype.render.call(this);
         this.$(".dropdown-button").dropdown();
    }
});