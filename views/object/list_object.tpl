<%= header %>

    <div class="container">

      <div class="page-header" style="margin-top:0px">
           <p><a href="javascript:void(0);" onClick="var path='<%= path %>';
               if(path == '/'){ window.location.href='/';}else{ 
               path=path.substr(0, path.lastIndexOf('/'));
               if(!path){ path='/'; } window.location.href=
                   '/list_object?bucket=<%= bucket %>&path='+path;
               }"><b>. .</b></a></p>
           <div>
           <a href="#"><%= path %></a>
           <input type="text" id="input-new-path" size="5"/>
           <button type="button" class="btn btn-default" onClick="return
                  s3.NewPath('<%= bucket %>','<%= path %>');">New</button>
           </div>
      </div>
<table class="table table-striped">
            <thead>
              <tr>
                <th>Object Name</th>
                <th>Object Count</th>
                <th>Object Size</th>
                <th>&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tbody id="list-object">
            </tbody>
          </table>
    </div>

    <%= uploadModal %>
<%= footer %>
<script type="text/javascript">
s3.ListObject('<%= bucket %>', '<%= path %>');
</script>
