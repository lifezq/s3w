<!DOCTYPE html>
<html>
<head>
 <meta charset="utf-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <meta name="viewport" content="width=device-width, initial-scale=1">
<title>S3 Web</title>
<link href="/css/bootstrap.min.css" rel="stylesheet">
<!-- Custom styles for this template -->
    <link href="/css/sticky-footer-navbar.css" rel="stylesheet">
</head>
<body>
<nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">S3W</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

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

<footer class="footer">
      <div class="container">
        <p class="text-muted">Place sticky footer content here.</p>
      </div>
    </footer>

<script src="/js/jquery.min.js"></script>
<script src="/js/bootstrap.min.js"></script>
<script src="/js/s3.js"></script>
<script type="text/javascript">
$(function(){
  s3.BucketList();
});
</script>
</body>
</html>
