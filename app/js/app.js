//注意这里的都是相对项目的根目录（即index.js所在位置）的路径
const Draw = nodeRequire('./app/js/draw');
const setCanvas = nodeRequire('./app/js/file-events').setCanvas;
const revoke = nodeRequire('./app/js/file-events').revoke;
const autoSave = nodeRequire('./app/js/file-events').autoSave;
const refreshClient = nodeRequire('./app/js/file-events').refreshClient;
const clearClient = nodeRequire('./app/js/file-events').clearClient;
const listen = nodeRequire('./app/js/listeners').listen;
const ipc = nodeRequire('electron').ipcRenderer;
const nativeImage = nodeRequire('electron').nativeImage;
const fs = nodeRequire('fs');

var settings = {
    "shape":"pen",
    "lineWidth":3,
    "edgeNum":3,
    "strokeFillStyle":"strokeFill",
    "strokeColor":"#000",
    "fillColor": "#fff", 
    "customizeCanvas":false,
    "customizeCanvasWidth":0,
    "customizeCanvasHeight":0,
    "image": null,
    "urlImageToSave":null
}


$(function () {
    
    //Listeners
    listen(settings);
    ipc.on('saved-image', function (event, path) {
        if (!path) {
            alert("请选择正确的路径！");
            return;
        }
        else {
            var image = nativeImage.createFromDataURL(settings.urlImageToSave);
            fs.writeFile(path, image.toPNG(), function (err) {
                if (err)
                    console.log(err);
            });
        }
        console.log(path);
    })
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

    setCanvas(canvas,context,document.documentElement.clientWidth,document.documentElement.clientHeight-$("#draw-board").offset().top-20);
    autoSave(canvas, context, history); 
    $(window).resize(function(){ 
        if(!settings.customizeCanvas){
            setCanvas(canvas,context,document.documentElement.clientWidth, document.documentElement.clientHeight - $("#draw-board").offset().top - 20);
            refreshClient(canvas, context, history); 
            revoke(context,history, false);
            autoSave(canvas, context, history);
        }
    });
     
    
    $("#new-trigger").click(function () {
        //创建画布时，默认为当前屏幕大小
        $("#customize-canvas-width").val(document.documentElement.clientWidth);
        $("#customize-canvas-height").val(document.documentElement.clientHeight-$("#draw-board").offset().top-20);
        $("#canvas").removeClass("fluent");
        settings.customizeCanvas=true;
        settings.customizeCanvasWidth= $("#customize-canvas-width").val();
        settings.customizeCanvasHeight = $("#customize-canvas-height").val();
        
    })
    
     //Confirm Canvas Size Settings (The sizes were validated by listeners)
     $("#customize-confirm").click(function(e){
        if((settings.customizeCanvasWidth>0)&&(settings.customizeCanvasHeight>0)){
            settings.customizeCanvas=true;
            setCanvas(canvas,context,settings.customizeCanvasWidth, settings.customizeCanvasHeight);
            //Remove active card style
            $("#presets .card-panel").each(function (index, ele) {
                $("#presets .card-panel").removeClass("teal").addClass("grey");
            });
            clearClient();
            history = [];
        }
        else{
            e.preventDefault();
            settings.customizeCanvasWidth=0;
            settings.customizeCanvasHeight=0;
        }
        if (settings.image.src) {
            
            context.drawImage(settings.image,0,0,settings.customizeCanvasWidth,settings.customizeCanvasHeight);
            autoSave(canvas, context, history);
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
                $("#open-message").html('<img src="' + reader.result + '">');             
            }
            reader.onloadend = function () {
                settings.customizeCanvasWidth = settings.image.width;
                settings.customizeCanvasHeight = settings.image.height;
                setCanvas(canvas,context,settings.customizeCanvasWidth, settings.customizeCanvasHeight);
                $("#customize-canvas-width").val(settings.image.width);
                $("#customize-canvas-height").val(settings.image.height);
               
            }
            reader.readAsDataURL(file);
           
        }
    });
   
    //Tool Bar Events
    $("#revoke").click(function () {
        revoke(context,history,true);
    })
    $("#save").click(function(){
        settings.urlImageToSave=canvas.toDataURL("image/png",1);
        ipc.send('save-image');
    })
    $("#clear").click(function () {
        clearClient(canvas, context);
        history=[];
        // context.clearRect(0,0,canvas.width,canvas.height);
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
                clearClient(canvas, context);//清屏，实现动态绘制
                //if (history.length != 0) {
                    //context.putImageData(history[history.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);//显示最后一次保存的快照
                    refreshClient(canvas, context, history); 
             //   }
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
           // history.push(context.getImageData(0, 0, canvas.width, canvas.height));
           autoSave(canvas, context, history); 
        }
    }
})