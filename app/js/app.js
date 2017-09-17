$(function () {
    

var container = $(".container");
var canvas = document.querySelector("canvas");
var screenWidth = document.documentElement.clientWidth;
var screenHeight = document.documentElement.clientHeight;
var width = screenWidth - 295;
var height = screenHeight - 15;
canvas.width = width;
canvas.height = height;
var obj = canvas.getContext("2d");
var typechoose = $(".type li");
var stylechoose = $(".style li");
var colorchoose = document.querySelector("input[type=color]");
var widthchoose = document.querySelector(".linewidth input[type=number]");
var canvasWidth = document.querySelector(".xinjian_width input[type=number]");
var canvasHeight = document.querySelector(".xinjian_height input[type=number]");
canvasWidth.value = width; canvasHeight.value = height;
canvasWidth.max = screenWidth - 295; canvasHeight.max = screenHeight - 15;
var ding = document.querySelector("#ding");
var poly = $(".poly");
var bian = $(".bian");
var polychoose = $(".bian input");
var shezhi = $(".shezhi");
var cut = $(".cut");
var copy = $(".copy");
var back = $(".back");
var clear = $(".clear");
var save = $(".save");
var create = $(".create");
var xinjian = $(".xinjian");
var create_close = $(".xinjian_before");
var cutflag = false;
var iscut = true;
var color = "#000";
var type = "line";
var n = 3;
var linewidth = "1";
var style = "stroke";
var arr = [];
$(".fill").css({ display: "none" });
// 多边形
poly.hover(function () {
    bian.fadeIn();
}, function () {
    bian.fadeOut();
})
// 绘制形状
typechoose.each(function (index, ele) {
    $(ele).click(function () {
        typechoose.removeClass("typeactive");
        $(this).addClass("typeactive");
        cut.css({ color: "#fff", backgroundColor: "#5bd219", opacity: 1 });
        copy.css({ color: "#fff", backgroundColor: "#5bd219", opacity: 1 });
        type = $(this).attr("data");
        if ($(this).is(".line") || $(this).is(".pen")) {
            style = "stroke";
            $(".stroke").addClass("styleactive");
            $(".fill").css({ display: "none" }).removeClass("styleactive");
        } else {
            $(".fill").css({ display: "block" });
        }
    })
})
// 描边、填充单击事件
stylechoose.each(function (index, ele) {
    $(ele).click(function () {
        style = $(this).attr("class");
        stylechoose.removeClass("styleactive");
        $(this).toggleClass("styleactive");
    })
})
// 剪切
cut.click(function () {
    type = $(this).attr("data");
    typechoose.removeClass("typeactive");
    $(this).css({ color: "#5bd219", backgroundColor: "#fff" }).toggleClass("shezhistyle");
    iscut = true;
})
copy.click(function () {
    type = "cut";
    typechoose.removeClass("typeactive");
    $(this).css({ color: "#5bd219", backgroundColor: "#fff" }).toggleClass("shezhistyle");
    iscut = false;
})
// 设置
shezhi.each(function (index, ele) {
    if ($(ele).is(".cut") || $(ele).is(".copy")) {
        return;
    } else {
        $(ele).click(function () {
            $(this).css({ color: "#5bd219", backgroundColor: "#fff" }).animate({ opacity: 0.99 }, 200, function () {
                $(this).css({ color: "#fff", backgroundColor: "#5bd219", opacity: 1 });
            });
        })
    }
})
// 撤销
back.click(function () {
    arr.pop();
    obj.clearRect(0, 0, width, height);
    if (arr.length > 0) {
        obj.putImageData(arr[arr.length - 1], 0, 0, 0, 0, width, height);
    }
})
// 清除
clear.click(function () {
    arr = [];
    obj.clearRect(0, 0, width, height);
})
// 保存
save.click(function () {
    var reg = canvas.toDataURL("image/png");//跳转页面手动保存
    //        var reg=canvas.toDataURL("image/png").replace("image/png","image/octet-stream");//直接自动保存下载
    location.href = reg;
})
// 新建画布
create.click(function () {
    xinjian.fadeIn();
})
create_close.click(function (e) {
    e.stopPropagation()
    xinjian.fadeOut();
})
canvasWidth.onblur = function () {
    if (this.value <= this.min) {
        this.value = this.min;
    }
    if (this.value >= screenWidth - 295) {
        this.value = screenWidth - 295;
    }
    width = this.value;
}
canvasHeight.onblur = function () {
    if (this.value <= this.min) {
        this.value = this.min;
    }
    if (this.value >= screenHeight - 15) {
        this.value = screenHeight - 15;
    }
    height = this.value;
}
ding.onclick = function (e) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.left = (screenWidth + 295 - canvas.width) / 2 + "px";
    canvas.style.top = (screenHeight - 5 - canvas.height) / 2 + "px";
    arr = [];
    obj.clearRect(0, 0, width, height);
    e.stopPropagation()
    xinjian.fadeOut();
}
// 颜色选择
colorchoose.onchange = function () {
    color = this.value;
}
// 粗细改变
widthchoose.onchange = function () {
    linewidth = this.value;
}
//多边形边数
polychoose.change(function () {
    n = this.value;
})
var x, y, w, h;
var lx, ly, lw, lh;
var cutdata;
canvas.onmousedown = function (e) {
    x = e.offsetX;
    y = e.offsetY;
    if (type == "pen") {
        obj.beginPath();
        obj.moveTo(x, y);
    }
    if (type == "eraser") {
        obj.clearRect(x - 5, y - 5, 10, 10);
    }
    if (cutflag && type == "cut") {
        if (arr.length != 0) {
            arr.splice(-1, 1);
        }
    }
    var draw = new Draw(obj, { type: style, color: color, width: linewidth });//实例化构造函数
    canvas.onmousemove = function (e) {
        w = e.offsetX;
        h = e.offsetY;
        if (type != "eraser") {
            obj.clearRect(0, 0, width, height);
            if (arr.length != 0) {
                obj.putImageData(arr[arr.length - 1], 0, 0, 0, 0, width, height);
            }
        }
        if (cutflag && type == "cut") {
            if (iscut) {
                obj.clearRect(lx, ly, lw - lx, lh - ly);
            }
            var nx = lx + (w - x);
            var ny = ly + (h - y);
            obj.putImageData(cutdata, nx, ny);
        } else if (type == "poly") {
            draw[type](x, y, w, h, n);
        } else {
            draw[type](x, y, w, h);
        }

    }
    document.onmouseup = function () {
        canvas.onmousemove = null;
        document.onmouseup = null;
        if (type == "cut") {
            if (!cutflag) {
                cutflag = true;
                cutdata = obj.getImageData(x + 1, y + 1, w - x - 2, h - y - 2);
                lx = x; ly = y; lw = w; lh = h;
                container.css({ display: "none" });
            } else {
                cutflag = false;
                container.css({ display: "block" });
            }
        }
        arr.push(obj.getImageData(0, 0, width, height));
    }
}
})