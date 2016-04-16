/*

Example Template:

<div class='col s12'>
    <ul class='tabs'>
        <li  class="tab col s6"><a data-viewconstructor='IngestLogsView' id='ingestLogsView' class='fw-tab-toggle fw-tab-default'>Ingest</a></li>
        <li  class="tab col s6"><a data-viewconstructor='ImportLogsView' id='importLogsView' class='fw-tab-toggle'>Import</a></li>
        <li  class="tab col s6"><a data-viewconstructor='ExportLogsView' id='exportLogsView' class='fw-tab-toggle'>Export</a></li>
        <li  class="tab col s6"><a data-viewconstructor='AuditLogsView' id='auditLogsView' class='fw-tab-toggle'>Audit</a></li>
    </ul>
</div>


<div class='fw-tab-content tab-panel' data-id='ingestLogsView'></div>
<div class='fw-tab-content tab-panel' data-id='importLogsView'></div>
<div class='fw-tab-content tab-panel' data-id='exportLogsView'></div>
<div class='fw-tab-content tab-panel' data-id='auditLogsView'></div>

*/

Framework.Ext.Materialize.TabView = Framework.TabView.extend({
    render : function(callback){
        this.$('ul.tabs').tabs();
        Framework.TabView.prototype.render.call(this, callback);
    } 
});