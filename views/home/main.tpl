<%= header %>

    <div class="container">
      <div class="page-header">

<!-- 按钮触发模态框 -->
<button class="btn btn-default" data-toggle="modal" data-target="#bukModal">New Bucket</button>

<!-- New Bucket 模态框（Modal） -->
<div class="modal fade" id="bukModal" tabindex="-1" role="dialog" aria-labelledby="bukModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="bukModalLabel">New Bucket</h4>
            </div>
            <div class="modal-body">
               <form action="#" method="post" class="form-horizontal" role="form">
                <div class="form-group">
                    <label class="sr-only" for="bucket">Bucket Name:</label>
                    <input type="text" class="form-control" id="bucket" name="bucket" value="" placeholder="Please input bucket name"/>
               </div>

               <div class="alert alert-danger hidden">
                    <p class="alert-msg">&nbsp;&nbsp;</p>
               </div>
               </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onClick="return s3.NewBucket();">Commit</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal -->
</div>

<%= uploadModal %>

</div>

</div>

<table class="table table-striped">
            <thead>
              <tr>
                <th>Bucket</th>
                <th>Object Count</th>
                <th>Object Size</th>
                <th>AccessKeys</th>
                <th>&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tbody id="buk-list">
            </tbody>
          </table>
    </div>

<%= footer %>
<script type="text/javascript">
  s3.BucketList();
</script>
