
<!-- Upload 模态框（Modal） -->
<div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-labelledby="uploadModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="uploadModalLabel">Upload</h4>
            </div>
            <div class="modal-body">
               <form action="#" method="post" class="form-horizontal" role="form" enctype="multipart/form-data">
                <div class="form-group">
                    <label class="sr-only" for="object_file">Object file:</label>
                    <input type="file" class="form-control" id="object_file" name="object_file" value=""/>
                    <input type="hidden" name="bucket" id="input_bucket"/>
                    <input type="hidden" name="path" id="input_path"/>
               </div>

               <div class="alert alert-danger hidden">
                    <p class="alert-msg">&nbsp;&nbsp;</p>
               </div>
               </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onClick="return s3.PutObject();">Commit</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->

