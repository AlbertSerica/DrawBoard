var settings = {
    "shape":"pen",
    "lineWidth":3,
    "edgeNum":3,
    "strokeFillStyle":"strokeFill",
    "strokeColor":"#000",
    "fillColor":"#fff", 
    "customizeCanvas":false,
    "customizeCanvasWidth":0,
    "customizeCanvasHeight":0,
    "image":null,
}

$(function(){
    //Initialize modals
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        }
    );
    //Initialize the App: Canvas & Settings
    var history = [];
    var canvas=document.getElementById("canvas");
    var context = canvas.getContext("2d");

    function setCanvas(width,height){
        canvas.width=width;
        canvas.height=height;
    }
   

    setCanvas(document.documentElement.clientWidth,document.documentElement.clientHeight-$("#draw-board").offset().top-20);
    
    $(window).resize(function(){ 
        if(!settings.customizeCanvas){
            setCanvas(document.documentElement.clientWidth,document.documentElement.clientHeight-$("#draw-board").offset().top-20);
        }
        if (history.length != 0) { 
            context.putImageData(history[history.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);//显示最后一次保存的快照
        }
    });
    

   
    //Poly Control
    $("#poly").click(function(e){
        $("#edge").show();
    });
    $("#edge").mouseleave(function(){
        $("#edge").hide();
    });

    //Style Toggle
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
    $("#new-trigger").click(function(){
        $("#customize-canvas-width").val(document.documentElement.clientWidth);
        $("#customize-canvas-height").val(document.documentElement.clientHeight-$("#draw-board").offset().top-20);
        $("#canvas").removeClass("fluent");
        settings.customizeCanvas=true;
        settings.customizeCanvasWidth= $("#customize-canvas-width").val();
        settings.customizeCanvasHeight=$("#customize-canvas-height").val();
    })
    //Setting Listeners
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
    $("#customize-canvas-height").change(function(){
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
    $("#open-image").change(function(){
        if(this.files.length){
            let file=this.files[0];
            let reader=new FileReader();
            if(!/image\/\w+/.test(file.type)){
                $("#open-message").text("请确保文件为图像类型");
                return false;
            }
            // onload是异步操作
            reader.onload = function(){
                settings.image=new Image();
                settings.image.src=reader.result;
                
                $("#open-message").html('<img src="'+reader.result+'" id="image-to-edit">');
            }
            reader.readAsDataURL(file);
        }
    });
   
    //Confirm Canvas Size Settings
    $("#customize-confirm").click(function(e){
        if((settings.customizeCanvasWidth>0)&&(settings.customizeCanvasHeight>0)){
            settings.customizeCanvas=true;
            setCanvas(settings.customizeCanvasWidth,settings.customizeCanvasHeight);
        }
        else{
            e.preventDefault();
            settings.customizeCanvasWidth=0;
            settings.customizeCanvasHeight=0;
        }
        if(settings.image.src){
        let imgWidth=settings.image.width;
        let imgHeight=settings.image.height;
        let whratio=imgWidth/imgHeight;
        let hwratio=imgHeight/imgWidth;
        if(imgHeight>canvas.height){
            imgHeight=canvas.height;
            imgWidth=imgHeight*whratio;
            if(imgWidth>canvas.width){
                imgWidth=canvas.width;
                imgHeight=imgWidth*hwratio;
            }
        }
        else if(imgWidth>canvas.width){
            imgWidth=canvas.width;
            imgHeight=imgWidth*hwratio;
        }
        context.drawImage(settings.image,0,0,imgWidth,imgHeight);
        history.push(context.getImageData(0, 0, canvas.width, canvas.height));
        }
    });

    //Customize Canvas
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
    //Validator
    $("#customize-canvas-width").change(function(){
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

    //Tool Bar Events
    $("#revoke").click(function(){
        history.pop();
        context.clearRect(0,0,canvas.width,canvas.height);
        if(history.length>0){
            context.putImageData(history[history.length-1],0,0,0,0,canvas.width,canvas.height);
        }
    })
    $("#save").click(function(){
        var reg=canvas.toDataURL("image/png");
        //var reg=canvas.toDataURL("image/png").replace("image/png","image/octet-stream");//直接自动保存下载
        location.href=reg;
    })
    $("#clear").click(function(){
        history=[];
        context.clearRect(0,0,canvas.width,canvas.height);
    })

    var startX, startY, currentX, currentY;
    var lx, ly, lw, lh;
    canvas.onmousedown = function (e) {//按下鼠标
        startX = e.offsetX;//按下鼠标时的位置
        startY = e.offsetY;
        if (settings.shape == "pen") {
            context.beginPath();
            context.moveTo(startX, startY);//按下鼠标时的位置 设置为起点
        }
        if (settings.shape == "eraser") {
            context.clearRect(startX - 5, startY - 5, 10, 10);
        }
        // if (cutflag && settings.shaple == "cut") {
        //     if (history.length != 0) {
        //         history.splice(-1, 1);
        //     }
        // }
        var draw = new Draw(context, { 
            strokeFillStyle: settings.strokeFillStyle, 
            strokeColor: settings.strokeColor, 
            fillColor:settings.fillColor,
            width: settings.lineWidth 
        });//实例化构造函数
        canvas.onmousemove = function (e) {
            currentX = e.offsetX;//移动中的位置
            currentY = e.offsetY;
            if (settings.shape != "eraser") {
                context.clearRect(0, 0, canvas.width,canvas.height);//清屏，实现动态绘制
                if (history.length != 0) {
                    context.putImageData(history[history.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);//显示最后一次保存的快照
                }
            }
            // if (cutflag && settings.shape == "cut") {
            //     if (iscut) {
            //         context.clearRect(lx, ly, lw - lx, lh - ly);
            //     }
            //     var nx = lx + (currentX - startX);
            //     var ny = ly + (currentY - startY);
            //     context.putImageData(cutdata, nx, ny);
            // } else 
            if (settings.shape == "poly") {
                draw[settings.shape](startX, startY, currentX, currentY, settings.edgeNum);
            } else {
                draw[settings.shape](startX, startY, currentX, currentY);
            }
        }
        document.onmouseup = function () {
            canvas.onmousemove = null;
            document.onmouseup = null;
            // if (settings.shape == "cut") {
            //     if (!cutflag) {
            //         cutflag = true;
            //         cutdata = context.getImageData(startX + 1, startY + 1, currentX - startX - 2, currentY - startY - 2);
            //         lx = startX; ly = startY; lw = currentX; lh = currentY;
            //         container.css({ display: "none" });
            //     } else {
            //         cutflag = false;
            //         container.css({ display: "block" });
            //     }
            // }
            history.push(context.getImageData(0, 0, canvas.width, canvas.height));
        }
    }
})