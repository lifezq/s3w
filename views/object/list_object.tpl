<%= header %>

    <div class="container">

<table class="table table-striped">
            <thead>
              <tr>
                <th>Object Name</th>
                <th>Object Size</th>
                <th>&nbsp;&nbsp;</th>
              </tr>
            </thead>
            <tbody id="list-object">
            </tbody>
          </table>
    </div>

<%= footer %>
<script type="text/javascript">
s3.ListObject('<%= bucket %>', '<%= path %>');
</script>
