//注意这里的都是相对项目的根目录（即index.js所在位置）的路径
const { remote } = nodeRequire('electron');
const { Menu, MenuItem } = remote;
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


const template = [
    {
      label: '文件',
      submenu: [
        {
              label: '新建画布',
              accelerator: 'CmdOrCtrl+N',  
            click(){$("#new-trigger").click()}       
        },
        // {
        //   label: '新建窗口'
        // },
        // {
        //   type: 'separator'
        // },
        // {
        //     label: '打开图片',
        //     click() {
        //       ipc.send('open-image');
        //     }  
        // },
        {
            label: '保存',
            accelerator: 'CmdOrCtrl+S',
            click() { $("#save").click() }  
        },
        {
            label: '另存为',
            accelerator:'CmdOrCtrl+D',
            click() { //$("#save").click()
                settings.urlImageToSave = canvas.toDataURL("image/png", 1);
                ipc.send('save-image');
                
        
            }  
        },
        {
          type: 'separator'
        },
        {
          label: '关闭窗口',
          role:'close'
        },
        {
          label: '退出',
          role:'quit'
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          click() { $("#revoke").click();}
        },
        {
            label: '调整',
            accelerator: 'CmdOrCtrl+A',
          click(){$("#adjust-trigger").click();}  
        },
        {
            label: '滤镜',
            accelerator: 'CmdOrCtrl+Shift+F',
          click(){$("#filter-trigger").click();}  
        },
        {
            label: '风格化',
            accelerator: 'CmdOrCtrl+Shift+S',
          click(){$("#stylize-trigger").click();}  
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label:'重载窗口',
          role: 'reload'
        },
        {
          label:'强制重载窗口',
          role: 'forcereload'
        },
        // {
        //   label:'开发者工具',
        //   role: 'toggledevtools'
        // },
        {
          type: 'separator'
        },
        {
          label:'重置缩放比例',
          role: 'resetzoom'
        },
        {
          label:'放大显示',
          role: 'zoomin'
        },
        {
          label:'缩小显示',
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          label:'最小化',
          role: 'minimize'
        },
        {
          label:'全屏',
          role: 'togglefullscreen'
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click () { require('electron').shell.openExternal('https://github.com/AlbertSerica/DrawBoard') }
        }
      ]
    }
  ]
  
  
  
    const menu = Menu.buildFromTemplate(template);
    


var settings = {
    "shape": "pen",
    "lineWidth": 3,
    "edgeNum": 3,
    "strokeFillStyle": "strokeFill",
    "strokeColor": "#000",
    "fillColor": "#fff",
    "customizeCanvas": false,
    "customizeCanvasWidth": 0,
    "customizeCanvasHeight": 0,
    "image": null,
    "urlImageToSave": null,
    "saved": false,
    "savePath":null
}


$(function () {

    function a() {
        $("#open-image").click();
    }

    Menu.setApplicationMenu(menu);
    //Initialize modals
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        complete: function () { 
            // Reset
        $("#brightness").val(0);
        $("#contrast").val(0);
        $("#hue").val(0);
        $("#saturation").val(0);
        $("#noise").val(0);
        $("#unsharp").val(0);
         } 
    });

    //Initialize the App: Canvas & Settings
    var history = [];
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    setCanvas(canvas, context, document.documentElement.clientWidth, document.documentElement.clientHeight - $("#draw-board").offset().top - 20);
    canvas.width = $("#canvas").width();
    canvas.height = $("#canvas").height();
    autoSave(canvas, context, history);
    $(window).resize(function () {
        if (!settings.customizeCanvas) {
            setCanvas(canvas, context, document.documentElement.clientWidth, document.documentElement.clientHeight - $("#draw-board").offset().top - 20);
            canvas.width = $("#canvas").width();
            canvas.height = $("#canvas").height();
            refreshClient(canvas, context, history);
            revoke(context, history, false);
            autoSave(canvas, context, history);
        }
    });


    $("#new-trigger").click(function () {
        //创建画布时，默认为当前屏幕大小
        settings.saved = false;
        $("#customize-canvas-width").val(parseInt(document.documentElement.clientWidth));
        $("#customize-canvas-height").val(parseInt(document.documentElement.clientHeight - $("#draw-board").offset().top - 20));
        if (settings.image!=null) {
            $("#customize-canvas-width").val(settings.image.width);
            $("#customize-canvas-height").val(settings.image.height);
        }
        $("#canvas").removeClass("fluent");
        settings.customizeCanvas = true;
        settings.customizeCanvasWidth = $("#customize-canvas-width").val();
        settings.customizeCanvasHeight = $("#customize-canvas-height").val();

    });
    //Listeners
    listen(settings);
    // ipc.on('opened-image', function (event, path) {
    //     if (!path) {
    //         alert("请选择正确的路径！");
    //         return;
    //     } else {
    //         console.log(path);
    //         let image = nativeImage.createFromPath(path[0]);
    //         settings.image = new Image();
    //         settings.image.src = image.toDataURL();
    //         // let hiddenImage = document.getElementById('image');
    //         // hiddenImage.src = image.toDataURL();
    //         settings.customizeCanvas = true;
    //         settings.customizeCanvasWidth = settings.image.width;
    //         settings.customizeCanvasHeight = settings.image.height;
    //         $("#customize-confirm").click();
    
         
    //     }
      
    // });
    ipc.on('saved-image', function (event, path) {
        if (!path) {
            alert("请选择正确的路径！");
            return;
        } else {
            settings.saved = true;
            settings.savePath = path;
            var image = nativeImage.createFromDataURL(settings.urlImageToSave);
            fs.writeFile(path, image.toPNG(), function (err) {
                if (err)
                    console.log(err);
            });
        }
        console.log(path);
    });
    
    $("#lens-blur").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);
        _cvs.draw(_texture).lensBlur(10, 0.75, 0).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
       
        console.log("lblur");
    });
    $("#zoom-blur").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);
        _cvs.draw(_texture).zoomBlur(_cvs.width / 2, _cvs.height / 2, 0.1).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
       
        console.log("zblur");
    });
    $("#triangle-blur").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        	
        _cvs.draw(_texture).triangleBlur(10).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
       
        console.log("tblur");
    });
    $("#bulge").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        
        	
        _cvs.draw(_texture).bulgePinch(_cvs.width/2, _cvs.height/2, 2*_cvs.width/3, 0.45).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
       
        console.log("bulge");
    });
    $("#vignette").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        
        	
        _cvs.draw(_texture).vignette(0.6, 0.5).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
       
        console.log("bulge");
    });
    $("#sepia").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        
        	
        _cvs.draw(_texture).sepia(1).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            autoSave(canvas, context, history);
        }, 500);
        
        console.log("bulge");
    });
    $("#ink").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        
        	
        _cvs.draw(_texture).ink(0.5).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
        console.log("bulge");
    });
    $("#edge-work").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        
        	
        _cvs.draw(_texture).edgeWork(10).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
      
        console.log("bulge");
    });
    $("#pixelate").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        
        	
        _cvs.draw(_texture).hexagonalPixelate(_cvs.width/2, _cvs.height/2, 20).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
        
        console.log("bulge");
    });
    $("#halftone").click(function () {
        let _cvs = fx.canvas();
        let __canvas__ = document.getElementById('canvas');
        let _texture = _cvs.texture(__canvas__);        
        _cvs.draw(_texture).colorHalftone(_cvs.width/2, _cvs.height/2, 0.25, 7).update();
        let img = new Image;
        img.src = _cvs.toDataURL('image/png');
        setTimeout(function () {
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            autoSave(canvas, context, history);
        }, 500);
       
        console.log("bulge");
    });


    var cvs = fx.canvas();
    var texture;
    $("#adjust-preview").append(cvs);
    $("#adjust-card").click(function () {
        $("#adjust-trigger").click();
    });
    $("#filter-card").click(function () {
        $("#filter-trigger").click();
    });
    $("#stylize-card").click(function () {
        $("#stylize-trigger").click();
    });
   
    $("#adjust-trigger").click(function (e) {
        let image = document.getElementById('image');
        image.src = history[history.length - 1].src;
        texture = cvs.texture(image);
        setTimeout(function () { cvs.draw(texture).update(); }, 500);
    });
    $("#adjustment .confirm").click(function (e) {
        console.log(e.target);
        $('.collapsible').collapsible('close', $(this).attr("data-index"));
        let image = document.getElementById('image');
        texture = cvs.texture(image); // Update Texture
        // Update CVS
        setTimeout(function () { cvs.draw(texture).update(); }, 500);
        // Reset
        $("#brightness").val(0);
        $("#contrast").val(0);
        $("#hue").val(0);
        $("#saturation").val(0);
        $("#noise").val(0);
        $("#unsharp").val(0);
    });
    $("#adjustment .cancel").click(function () {
        $('.collapsible').collapsible('close', $(this).attr("data-index"));
        $("#brightness").val(0);
        $("#contrast").val(0);
        $("#hue").val(0);
        $("#saturation").val(0);
        $("#noise").val(0);
        $("#unsharp").val(0);
    });
    $("#adjustments-confirm").click(function (e) {
        let image = document.getElementById('image');
        let img = new Image();
        img.src = image.src;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        autoSave(canvas, context, history);
    });
    $("#column1").change(function () {
        let brightness = parseInt($("#brightness").val());
        let contrast = parseInt($("#contrast").val());
        cvs.draw(texture).brightnessContrast(0.01 * brightness, 0.01 * contrast).update();
        let image = document.getElementById('image');
        image.src = cvs.toDataURL('image/png');
    });
    $("#column2").change(function () {
        let saturation = parseInt($("#saturation").val());
        let hue = parseInt($("#hue").val());
        cvs.draw(texture).hueSaturation(0.01 * hue, 0.01 * saturation).update();
        let image = document.getElementById('image');
        image.src = cvs.toDataURL('image/png');
    });
    $("#column3").change(function () {
        let unsharp = parseInt($("#unsharp").val());
        cvs.draw(texture).unsharpMask(100, 0.05 * unsharp).update();
        let image = document.getElementById('image');
        image.src = cvs.toDataURL('image/png');
    });
    $("#column4").change(function () {
        let noise = parseInt($("#noise").val());
        if (noise <= 0) {
            cvs.draw(texture).denoise((50 + noise)).update();
        }
        else {
            cvs.draw(texture).noise((noise*0.02)).update();
        }
        let image = document.getElementById('image');
        image.src = cvs.toDataURL('image/png');
    });
    // let img = new Image;
    // img.src = cvs.toDataURL('image/png');
    // context.drawImage(img, 0, 0, canvas.width, canvas.height);
    //autoSave(canvas, context, history);
    // settings.adjustments.brightness = parseInt($("#brightness").val());


    // $("#adjustment").change(function () {
    //    
    //     let unsharp = parseInt($("#unsharp").val());
    //     let noise = parseInt($("#noise").val());
    //     let image = document.getElementById('image');
    //     image.src = history[history.length-1].src;
    //     // convert the image to a texture


    //     cvs.draw(texture).denoise(50 - noise).update();

    //     cvs.draw(texture).unsharpMask(100, 0.05*unsharp).update();

    //     // let img = new Image;
    //     // img.src = cvs.toDataURL('image/png');
    //     // context.drawImage(img, 0, 0, canvas.width, canvas.height);
    //     //autoSave(canvas, context, history);
    //     // settings.adjustments.brightness = parseInt($("#brightness").val());

    // })
    // Caman.Event.listen("renderFinished", function (job) {
    //     console.log("finish");
    //     autoSave(canvas, context, history); 
    // })
    //Confirm Canvas Size Settings (The sizes were validated by listeners)
    $("#customize-confirm").click(function (e) {
        
        if ((settings.customizeCanvasWidth > 0) && (settings.customizeCanvasHeight > 0)) {
            settings.customizeCanvas = true;
            setCanvas(canvas, context, settings.customizeCanvasWidth, settings.customizeCanvasHeight);
            //Remove active card style
            $("#presets .card-panel").each(function (index, ele) {
                $("#presets .card-panel").removeClass("teal").addClass("grey");
            });
            clearClient(canvas, context);
            history = [];
            autoSave(canvas, context, history);
        } else {
            e.preventDefault();
            settings.customizeCanvasWidth = 0;
            settings.customizeCanvasHeight = 0;
        }
        if (settings.image.src) {
            clearClient(canvas, context);
            history = [];
            // settings.customizeCanvas = true;
            // settings.customizeCanvasWidth = settings.image.width;
            // settings.customizeCanvasHeight = settings.image.height;
            //console.log(settings.customizeCanvasWidth, settings.customizeCanvasHeight);
            context.drawImage(settings.image, 0, 0, settings.customizeCanvasWidth, settings.customizeCanvasHeight);
            autoSave(canvas, context, history);
            let image = document.getElementById('image');
            image.src = history[history.length - 1].src;
        }

    });


    $("#open-image").change(function () {
        if (this.files.length) {
            let file = this.files[0];
            let reader = new FileReader();
            // Check status
            if (!/image\/\w+/.test(file.type)) {
                $("#open-message").text("请确保文件为图像类型");
                return false;
            }
            // onload是异步操作
            reader.onload = function () {
                settings.image = new Image();
                settings.image.src = reader.result;
                $("#open-message").html('<img src="' + reader.result + '">');
            }
            reader.onloadend = function () {
                settings.customizeCanvas = true;
                settings.customizeCanvasWidth = settings.image.width;
                settings.customizeCanvasHeight = settings.image.height;
                setCanvas(canvas, context, settings.customizeCanvasWidth, settings.customizeCanvasHeight);
                $("#customize-canvas-width").val(settings.image.width);
                $("#customize-canvas-height").val(settings.image.height);
            }
            reader.readAsDataURL(file);

        }
    });

    //Tool Bar Events
    $("#revoke").click(function () {
        revoke(context, history, true);
    });
    $("#save").click(function () {
        // Get Current Image URL
        settings.urlImageToSave = canvas.toDataURL("image/png", 1);
        if (!settings.saved) {
            ipc.send('save-image');
        }
        else {
            var image = nativeImage.createFromDataURL(settings.urlImageToSave);
            fs.writeFile(settings.savePath, image.toPNG(), function (err) {
                if (err)
                    console.log(err);
            });
        }
    });
    $("#clear").click(function () {
        clearClient(canvas, context);
        history = [];
        // context.clearRect(0,0,canvas.width,canvas.height);
    });

    var startX, startY, currentX, currentY;
    var lx, ly, lw, lh;
    canvas.onmousedown = function (e) { //按下鼠标
        startX = e.offsetX; //按下鼠标时的位置
        startY = e.offsetY;
        if (settings.shape == "pen") {
            context.beginPath();
            context.moveTo(startX, startY); //按下鼠标时的位置 设置为起点
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
            fillColor: settings.fillColor,
            width: settings.lineWidth
        }); //实例化构造函数
        canvas.onmousemove = function (e) {
            currentX = e.offsetX; //移动中的位置
            currentY = e.offsetY;
            if (settings.shape != "eraser") {
                clearClient(canvas, context); //清屏，实现动态绘制
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