var s3 = {};

s3.NewBucket = function(){
    var obj = $(".modal-body form"); 
    $.ajax({
        url: obj.attr("action"),
        type:"post",
        data: obj.serialize(),
        success:function(rsp){

            if(rsp.kind=="NewBucket"){
                $('#myModal').modal('hide');
                return;
            }

            $("#alert-msg").html(rsp.message);
            $(".modal-body .alert").removeClass("hidden");
        }
    });

    return false;
}

