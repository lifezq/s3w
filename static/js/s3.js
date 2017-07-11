var s3 = {
    baseUrl:"http://127.0.0.1:16000/"
};

s3.NewBucket = function(){

    var obj = $("#bukModal");
    $.ajax({
        url: s3.baseUrl+"s3/buk/new",
        type:"post",
        data: obj.find("form").serialize(),
        success:function(rsp){

            if(rsp.kind=="NewBucket"){
                $("#alert-msg").html(rsp.message);
                obj.find(".form-group").removeClass("has-error");
                obj.find(".alert").addClass("hidden");
                obj.modal('hide');

                s3.BucketList();
                return;
            }

            $("#alert-msg").html(rsp.message);
            obj.find(".form-group").addClass("has-error");
            obj.find(".alert").removeClass("hidden");
        }
    });

    return false;
}

s3.BucketList = function(){
    $.ajax({
        url: s3.baseUrl+"s3/buk/list",
        type:"get",
        dataType:"json",
        success:function(rsp){

            var obj = $("#buk-list");
            if(rsp.kind!="ListBucket"){
                obj.html("<tr><td collapse='4'>"+rsp.message+"</td></tr>");
                return;
            }
            
            var html = "";
            for(var i=0;i<rsp.items.length;i++){
               html += "<tr><td>"+rsp.items[i].bucket+"</td>"; 
               html += "<td>"+rsp.items[i].object_count+"</td>"; 
               html += "<td>"+rsp.items[i].object_size+"</td>"; 

               html += "<td>"; 
                var access_keys = "";
                for(var access in rsp.items[i].access_keys){
                    access_keys += rsp.items[i].access_keys[0].access_key + ",";
                }
               html += access_keys.substr(0,access_keys.length-1);
               html += "</td>"; 

                html += "<td><button class='btn btn-default' data-toggle='modal' data-target='#uploadModal'>Upload</button>";
                html += '<button type="button" class="btn btn-default" title="Delete Bucket" data-container="body" data-toggle="" data-placement="top" data-content="Can not delete this bucket" onClick="return s3.DelBucket(this,\''+rsp.items[i].bucket+'\', '+rsp.items[i].object_count+')">Delete</button>'
                html += "</td>";
            }

            obj.html(html);
            //$("[data-toggle='popover']").popover();
        }
    })
}

s3.DelBucket = function(obj, bucket_name ,object_count){

    if(object_count>0){
        $(obj).popover('show');
        setTimeout(function(){
            $(obj).popover("hide");
        }, 2000);
        return false;
    }

    $.ajax({
        url: s3.baseUrl+"s3/buk/del?bucket_name="+bucket_name,
        type:"get",
        dataType:"json",
        success:function(rsp){
            if(rsp.kind!="DelBucket"){
                $(obj).attr("data-content",rsp.message); 
                $(obj).popover('show');
                setTimeout(function(){
                    $(obj).popover("hide");
                }, 2000);
                return false;
            }

            s3.BucketList();
        }
    });

    return true;
}
