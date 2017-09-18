exports.listen = function (settings) {
    //Watchers
    $("#stroke-color").change(function(){
        settings.strokeColor=$(this).val();
    });
    $("#fill-color").change(function(){ 
        settings.fillColor=$(this).val(); 
    });
    $("#line-width").change(function(){
        settings.lineWidth=$(this).val();
    });
    $("#edge-num").change(function(){
        settings.edgeNum=$(this).val();
    });

    $("#stroke-fill-style-picker").change(function(){
        if($("#enable-border").is(":checked")){
            if($("#enable-fill").is(":checked")){
                $("#enable-border").removeAttr("disabled");
                $("#enable-fill").removeAttr("disabled");
                settings.strokeFillStyle="strokeFill";
                return;
            }
            else{
                $("#enable-fill").removeAttr("disabled");
                $("#enable-border").attr("disabled","disabled");
                settings.strokeFillStyle="stroke";
                return;
            }
        }
        else if($("#enable-fill").is(":checked")){
            if($("#enable-border").is(":checked")){
                $("#enable-border").removeAttr("disabled");
                $("#enable-fill").removeAttr("disabled");
                settings.strokeFillStyle="strokeFill";
                return;
            }
            else{
                $("#enable-border").removeAttr("disabled");
                $("#enable-fill").attr("disabled","disabled");
                settings.strokeFillStyle="fill";
                return;
            }
        }
    });
    $("#shape-type button").each(function(index,ele){
        $(ele).click(function(){
            $("#shape-type button").removeClass("teal").addClass("blue");
            $(this).removeClass("blue").addClass("teal");
            settings.shape=$(this).attr("data-shape");
            if(settings.shape!="poly"){
                $("#edge").hide();
            }
        })
    });
    
    //customize canvas size validators
    $("#customize-canvas-height").change(function () {
        //remove active card style
        $("#presets .card-panel").each(function(index,ele){
            $("#presets .card-panel").removeClass("teal").addClass("grey");
        });
        settings.customizeCanvasHeight=$(this).val();
        if((settings.customizeCanvasWidth>0)&&(settings.customizeCanvasHeight>0)){
            $("#customize-confirm").removeAttr("disabled");
        }
        else{
            $("#customize-confirm").attr("disabled","disabled");
        }
    });
        
    $("#customize-canvas-width").change(function () {
        //remove active card style
        $("#presets .card-panel").each(function(index,ele){
            $("#presets .card-panel").removeClass("teal").addClass("grey");
        });
        settings.customizeCanvasWidth=$(this).val();
        if((settings.customizeCanvasWidth>0)&&(settings.customizeCanvasHeight>0)){
            $("#customize-confirm").removeAttr("disabled");
        }
        else{
            $("#customize-confirm").attr("disabled","disabled");
        }
    });

    

    //Presets
    $("#presets .card-panel").each(function(index,ele){
        $(ele).click(function(){
            $("#presets .card-panel").removeClass("teal").addClass("grey");
            $(this).removeClass("grey").addClass("teal");
            settings.customizeCanvasWidth=$(this).attr("data-width");
            settings.customizeCanvasHeight=$(this).attr("data-height");
            $("#customize-canvas-width").val(settings.customizeCanvasWidth);
            $("#customize-canvas-height").val(settings.customizeCanvasHeight);
            $("#customize-confirm").removeAttr("disabled");
        })
    });
    
    //Style Toggle
    $("#poly").click(function(e){
        $("#edge").show();
    });
    $("#edge").mouseleave(function(){
        $("#edge").hide();
    });


}