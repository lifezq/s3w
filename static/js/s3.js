var s3 = {
    localUrl:"http://127.0.0.1:3000/s3w/",
    baseUrl:"http://127.0.0.1:16000/s3/",
    updating:false,
};

s3.NewBucket = () => {

    var obj = $("#bukModal");
    $.ajax({
        url: s3.baseUrl+"buk/new?client_id="+
             s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
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
        url: s3.baseUrl+"buk/list?client_id="+
             s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
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

                html += '<td><a href="/s3w/list_object?bucket='+rsp.items[i].bucket+
                        '&path=/" class="btn btn-default">file browsing</a>'+
                        ""+"<button class='btn btn-default' data-toggle='modal'"+
                        " data-target='#uploadModal' onClick=\"return s3.UpEvent(\'"+
                         rsp.items[i].bucket+"\', \'\/\');\">Upload</button>"+
                        "<button class='btn btn-default' data-toggle='modal'"+
                        " data-target='#accessModal' onClick=\"return s3.UpEvent(\'"+
                         rsp.items[i].bucket+"\', \'\/\');\">Access Crontol</button>"+
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
        url: s3.baseUrl+"buk/del?bucket="+bucket+"&client_id="+
             s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
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
    $(".input_bucket").val(bucket);
    $(".input_path").val(path);
    s3.updating = false;
    $("#uploadModal .btn-primary").attr("disabled", false);
    return false;
}

s3.PutObject = () => {

    if(s3.updating) return false;
    s3.updating = true;

    var obj = $("#uploadModal");
    obj.find(".modal-title").html("Updating...");
    obj.find(".btn-primary").attr("disabled", true);

    if(typeof FileReader != 'undefined'){

        var file = $("#object_file")[0].files[0];
        var chunkSize = 1024*1024;
        var chunkNum = 8;
        var blockSize = chunkSize*chunkNum;

        if(file.size > chunkSize){

            var bucket = $(".input_bucket").val();
            var path = $(".input_path").val();
            var offset = 0;
            var fileSize = file.size;
            var block = Math.ceil(fileSize/blockSize);
    
            for (var b=0;b<block;b++){
    
                var breaked = false;
                for (var c=0;c<chunkNum;c++){
    
                    offset = blockSize*b+(c*chunkSize);
                    var cutset = offset+chunkSize;
                    if(cutset>=fileSize){
                        cutset = fileSize;
                        breaked = true;
                    }

                    var data = file.slice(offset,cutset);
                    var reader = new FileReader();
                    reader.readAsArrayBuffer(data);

                    reader.b = b;
                    reader.c = c;
                    reader.data = data;
                    reader.onload = function(){
    
                        var formData = new FormData();
                        formData.append("bucket", bucket);
                        formData.append("path", path);
                        formData.append("filename", file.name);
                        formData.append("block", this.b);
                        formData.append("chunk", this.c);
                        formData.append("data", this.data);
                        formData.append("size", fileSize);
                        formData.append("block_ider", block);
                        formData.append("chunk_size", chunkSize);
                        formData.append("meta_size", blockSize >> 0x01 );
    
                        var h = sha256.hmac.create(decodeURIComponent(s3.GetCookie("s3_secret_key")));
                        h.update(bucket);
                        h.update(path);
                        h.update(file.name);
                        h.update(String(this.b));
                        h.update(String(this.c));
                        h.update(this.result);
                        h.update(String(fileSize));
                        h.update(String(block));
                        h.update(String(chunkSize));
    
                        formData.append("sign", h.hex());
   
                        var this_block = this.b;
                        var this_chunk = this.c;
                        $.ajax({
                        url: s3.baseUrl+"buk/multi-put?client_id="+
                            s3.GetCookie("s3_client_id")+
                            "&access_key="+s3.GetCookie("s3_access_key"),
                        type:"post",
                        async:false,
                        processData: false,
                        contentType: false,
                        timeout: 10000,
                        data: formData,
                        success: (rsp) => {

                            if(rsp.kind!="MultiPutObject"){
                                obj.find(".alert-msg").html(rsp.message);
                                obj.find(".form-group").addClass("has-error");
                                obj.find(".alert").removeClass("hidden");
                                return;
                            }

                            if((this_block*blockSize + (this_chunk+1)*chunkSize) > fileSize){
                                obj.find(".alert-msg").html("");
                                obj.find(".form-group").removeClass("has-error");
                                obj.find(".alert").addClass("hidden");
                                obj.modal("hide");

                                s3.updating = false;
                                obj.find(".modal-title").html("Update");
                                obj.find(".btn-primary").attr("disabled", false);
                            }
                        }
                        });
    
                    }
                    if(breaked){
                        break;
                    }
                }
            }

            return false;
        }
    }

    $.ajax({
        url: s3.baseUrl+"buk/put?client_id="+
             s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
        type:"post",
        async:false,
        processData: false,
        contentType: false,
        timeout: 10000,
        data: new FormData(obj.find("form")[0]),
        success: (rsp) => {
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

    s3.updating = false;
    obj.find(".modal-title").html("Update");
    obj.find(".btn-primary").attr("disabled", false);
    return false;
}


s3.ListObject = (bucket, path) => {

    if(path == ""){
        path = "/";
    }

    $.ajax({
        url: s3.baseUrl+"obj/list?bucket="+bucket+"&path="+path+"&client_id="+
             s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
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
                    html += '<td><a href="javascript:void(0);" onClick="s3.GetObject(\''+
                            s3.baseUrl+'obj/get?bucket='+bucket+'&path='+path+"&oid="+
                            rsp.items[i].oid+'\',0)">'+idx+'. '+rsp.items[i].object_name+
                        '</a></td><td>-</td><td>'+rsp.items[i].object_size+'</td><td>';
                    html += '<button type="button" class="btn btn-default" title="Download Object"'+
                            ' data-container="body" data-toggle="" data-placement="top"'+
                            ' data-content="Download object error" onClick="s3.GetObject(\''+
                            s3.baseUrl+'obj/get?bucket='+bucket+'&path='+path+"&oid="+
                            rsp.items[i].oid+'\',1)">Down</button>';

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
                            ' title="Delete Object" data-container="body"'+
                            ' data-toggle="" data-placement="top" data-content="Delete object error"'+
                            ' onClick="return s3.DelObject(this, \''+bucket+'\',\''+path+
                            '\',\''+rsp.items[i].oid+'\');">delete</button></td></tr>';
         
            }

            obj.html(html);
        }
    });
}

s3.DelObject = (obj, bucket, path, oid) => {
    $.ajax({
        url:s3.baseUrl+"obj/del?bucket="+bucket+"&path="+path+"&oid="+oid+
            "&client_id="+s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
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
             path+"&object="+$("#input-new-path").val()+"&client_id="+
             s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
        type:"get",
        dataType:"json",
        success: (rsp) => {
            window.location.reload();
        }
    });
}

s3.AccessControl = () => {

    var obj = $("#accessModal");
    $.ajax({
        url: s3.baseUrl+"buk/ac?client_id="+s3.GetCookie("s3_client_id")+
            "&access_key="+s3.GetCookie("s3_access_key"),
        type:"post",
        dataType:"json",
        processData: false,
        contentType: false,
        timeout: 10000,
        data: new FormData(obj.find("form")[0]),
        success: (rsp) => {
            if(rsp.kind=="AccessControl"){
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

            s3.SetCookie("s3_client_id", rsp.client_id, 3600*1000, "/s3w");
            s3.SetCookie("s3_access_key", rsp.access_key, 3600*1000,"/s3w");
            s3.SetCookie("s3_secret_key", rsp.secret_key, 3600*1000,"/s3w");

            window.location.href=s3.localUrl;
        }
    });

    return false;
}

s3.GetObject = (uri, down) => {

    $("#obj-get-form").attr("action", uri);
    $("#input-obj-down").val(down);
    $("#input-client-id").val(s3.GetCookie("s3_client_id"));
    $("#input-access-key").val(s3.GetCookie("s3_access_key"));

    $("#obj-get-form").submit();
}

s3.SetCookie = (name, value, ttl, path) => {
    var d = new Date();
    d.setTime(d.getTime()+ttl);
    document.cookie = name+"="+encodeURIComponent(value)+";expires="+d.toGMTString()+";path="+path;
}

s3.GetCookie = (name) => {
    var name = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();

        if(c.indexOf(name)==0){
            return c.substring(name.length,c.length);
        }
    }
  return "";
}
