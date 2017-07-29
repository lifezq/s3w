
<!-- Setting 模态框（Modal） -->
<div class="modal fade" id="settingModal" tabindex="-1" role="dialog" aria-labelledby="settingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="settingModalLabel">Setting</h4>
            </div>
            <div class="modal-body">
               <form action="#" method="post" class="form-horizontal" role="form">
               <div class="form-group">
                     <label class="col-sm-2">图片尺寸:</label>
                     <div class="col-sm-10">
                         <input type="text" name="img-w" size="4" id="input-img-w" placeholder="400"> x
                         <input type="text" name="img-h" size="4" id="input-img-h" placeholder="400">
                         <span class="help-block">如果长宽均为空，则上传原图。</span>
                     </div>
               </div>
                <div class="form-group">
                    <label for="input_wl" class="col-sm-4">White List:</label>
                    <div class="col-sm-10">
                    <textarea class="form-control" name="wl" id="input_wl"></textarea>
                    <span class="help-block">eg:this,http://domain. separated by line breaks</span>
                    <input type="hidden" name="bucket" class="input_bucket"/>
                    <input type="hidden" name="path" class="input_path"/>
                    </div>
               </div>

               <div class="alert alert-danger hidden">
                    <p class="alert-msg">&nbsp;&nbsp;</p>
               </div>
               </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onClick="return s3.Setting();">Commit</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>
