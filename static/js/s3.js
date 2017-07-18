var s3 = {
    localUrl:"http://127.0.0.1:3000/",
    baseUrl:"http://127.0.0.1:16000/s3/"
};

s3.NewBucket = () => {

    var obj = $("#bukModal");
    $.ajax({
        url: s3.baseUrl+"buk/new",
        type:"post",
        data: obj.find("form").serialize(),
        success:(rsp) => {

            if(rsp.kind=="NewBucket"){
                obj.find(".alert-msg").html(rsp.message);
                obj.find(".form-group").removeClass("has-error");
                obj.find(".alert").addClass("hidden");
                obj.modal('hide');

                s3.BucketList();
                return;
            }

            obj.find(".alert-msg").html(rsp.message);
            obj.find(".form-group").addClass("has-error");
            obj.find(".alert").removeClass("hidden");
        }
    });

    return false;
}

s3.BucketList = () => {
    $.ajax({
        url: s3.baseUrl+"buk/list",
        type:"get",
        dataType:"json",
        success:(rsp) => {

            var obj = $("#buk-list");
            if(rsp.kind!="ListBucket"){
                obj.html("<tr><td collapse='4'>"+rsp.message+"</td></tr>");
                return;
            }
            
            var html = "";
            for(var i=0;i<rsp.items.length;i++){
               html += "<tr><td>"+rsp.items[i].bucket+"</td>"; 
               html += "<td>"+rsp.items[i].object_count+"</td>"; 
               html += "<td>"+rsp.items[i].object_size+" KB</td>"; 

               html += "<td>"; 
                var access_keys = "";
                for(var access in rsp.items[i].access_keys){
                    access_keys += rsp.items[i].access_keys[0].access_key + ",";
                }
               html += access_keys.substr(0,access_keys.length-1);
               html += "</td>"; 

                html += '<td><a href="/list_object?bucket='+rsp.items[i].bucket+
                        '&path=/" class="btn btn-default">file browsing</a>'+
                        ""+"<button class='btn btn-default' data-toggle='modal'"+
                        " data-target='#uploadModal' onClick=\"return s3.UpEvent(\'"+
                         rsp.items[i].bucket+"\', \'\/\');\">Upload</button>"+
                        '<button type="button" class="btn btn-default" title="Delete Bucket"'+
                        ""+' data-container="body" data-toggle="" data-placement="top" '+
                        ""+' data-content="Can not delete this bucket" '+
                        ""+' onClick="return s3.DelBucket(this,\''+rsp.items[i].bucket+
                        '\', '+rsp.items[i].object_count+')">Delete</button>';
                html += "</td>";
            }

            obj.html(html);
        }
    });
}

s3.DelBucket = (obj, bucket ,object_count) => {

    if(object_count>0){
        $(obj).popover('show');
        setTimeout(() => {
            $(obj).popover("hide");
        }, 2000);
        return false;
    }

    $.ajax({
        url: s3.baseUrl+"buk/del?bucket="+bucket,
        type:"get",
        dataType:"json",
        success: (rsp) => {
            if(rsp.kind!="DelBucket"){
                $(obj).attr("data-content",rsp.message); 
                $(obj).popover('show');
                setTimeout(() => {
                    $(obj).popover("hide");
                }, 2000);
                return false;
            }

            s3.BucketList();
        }
    });

    return true;
}

s3.UpEvent = (bucket, path) => {
    $("#input_bucket").val(bucket);
    $("#input_path").val(path);
    return false;
}

s3.PutObject = () => {
    $.ajax({
        url: s3.baseUrl+"buk/put",
        type:"post",
        processData: false,
        contentType: false,
        timeout: 60000,
        data: new FormData($("#uploadModal form")[0]),
        success: (rsp) => {
            var obj = $("#uploadModal");
            if(rsp.kind=="PutObject"){
                obj.find(".alert-msg").html("");
                obj.find(".form-group").removeClass("has-error");
                obj.find(".alert").addClass("hidden");
                obj.modal("hide");
                return;
            }

            obj.find(".alert-msg").html(rsp.message);
            obj.find(".form-group").addClass("has-error");
            obj.find(".alert").removeClass("hidden");
        }
    });

    return false;
}

s3.ListObject = (bucket, path) => {

    if(path == ""){
        path = "/";
    }

    $.ajax({
        url: s3.baseUrl+"obj/list?bucket="+bucket+"&path="+path,
        type:"get",
        dataType:"json",
        success: (rsp) => {
            var obj = $("#list-object");
            if(rsp.kind!="ListObject"){
                obj.html('<tr><td collapse="3">'+rsp.message+'</td></tr>');
                return;
            }else if(!rsp.items){
                obj.html('<tr><td collapse="3">No Object</td></tr>');
                return;
            }


            var html = "";
            var idx = 0;
            for(var i in rsp.items){
                html += '<tr id="obj-item-'+rsp.items[i].oid+'">';
                if(rsp.items[i].attr & 0x01 == 0x01){
                    idx++;
                    html += '<td><a href="'+s3.baseUrl+'obj/get?bucket='+
                        bucket+'&path='+path+"&oid="+
                        rsp.items[i].oid+'">'+idx+'. '+rsp.items[i].object_name+
                        '</a></td><td>-</td><td>'+rsp.items[i].object_size+'</td><td>';
                }else{
                    
                    var p = path + "/";
                    if(path == "/"){
                        p = path;
                    }

                    html += '<td><a class="btn btn-default" href="'+
                            s3.localUrl+'list_object?bucket='+
                            bucket+'&path='+p+rsp.items[i].object_name+'">'+
                            rsp.items[i].object_name+'</a></td>';

                    var c = 0;
                    if(rsp.items[i].object_count){
                        c = rsp.items[i].object_count;
                    }
                    html += '<td>'+c+'</td><td>'+rsp.items[i].object_size+'</td><td>'+
                        '<button class="btn btn-default" data-toggle="modal"'+
                        ' data-target="#uploadModal" onclick="return '+
                        ' s3.UpEvent(\''+bucket+'\', \''+p+rsp.items[i].object_name+'\');">Upload</button>';
                }

                      html +=  '<button type="button" class="btn btn-default"'+
                        ""+' title="Delete Object" data-container="body"'+
                        ""+' data-toggle="" data-placement="top" data-content="Delete object error"'+
                        ""+' onClick="return s3.DelObject(this, \''+bucket+'\',\''+path+
                        '\',\''+rsp.items[i].oid+'\');">delete</button></td></tr>';
         
            }

            obj.html(html);
        }
    });
}

s3.DelObject = (obj, bucket, path, oid) => {
    $.ajax({
        url:s3.baseUrl+"obj/del?bucket="+bucket+"&path="+path+"&oid="+oid,
        type:"get",
        dataType:"json",
        success: (rsp) => {
            if(rsp.kind!="DelObject"){
                $(obj).attr("data-content",rsp.message); 
                $(obj).popover('show');
                setTimeout(() => {
                    $(obj).popover("hide");
                }, 2000);
                return;
            }

            $("#obj-item-"+oid).remove();
        }
    });
}

s3.NewPath = (bucket, path) => {
    $.ajax({
        url: s3.baseUrl+"obj/new-path?bucket="+bucket+"&path="+
             path+"&object="+$("#input-new-path").val(),
        type:"get",
        dataType:"json",
        success: (rsp) => {
            window.location.reload();
        }
    });
}

s3.Login = () => {
    $.ajax({
        url: s3.localUrl+"login",
        type:"post",
        data: $(".form-signin").serialize(),
        dataType:"json",
        success: (rsp) => {

            var obj = $(".alert-danger");
            if(rsp.kind!="Login"){
                obj.removeClass("hidden");
                obj.find(".alert-msg").html(rsp.message);
                return;
            }
            
            obj.addClass("hidden");

            s3.SetCookie("s3_adm_session", $("#inputEmail").val(), 3600*1000);
            window.location.href="/";
        }
    });

    return false;
}

s3.SetCookie = (name, value, ttl) => {
    var d = new Date();
    d.setTime(d.getTime()+ttl);
   document.cookie = name+"="+escape(value)+";expires="+d.toGMTString();
}
