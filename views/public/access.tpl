
<!-- Access Control 模态框（Modal） -->
<div class="modal fade" id="accessModal" tabindex="-1" role="dialog" aria-labelledby="accessModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="accessModalLabel">Access Control</h4>
            </div>
            <div class="modal-body">
               <form action="#" method="post" class="form-horizontal" role="form">
                <div class="form-group">
                    <label for="input_wl">White List:</label>
                    <textarea class="form-control" name="wl" id="input_wl"></textarea>
                    <span class="help-block">eg:this,http://domain. separated by line breaks</span>
                    <input type="hidden" name="bucket" class="input_bucket"/>
                    <input type="hidden" name="path" class="input_path"/>
               </div>

               <div class="alert alert-danger hidden">
                    <p class="alert-msg">&nbsp;&nbsp;</p>
               </div>
               </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onClick="return s3.WhiteList();">Commit</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>
