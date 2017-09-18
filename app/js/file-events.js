exports.setCanvas=function(canvas,context,width,height){
    canvas.width=width;
    canvas.height = height;
    //Set Background Color, Otherwise it will be transparent
    context.beginPath();
    context.fillStyle = "#fff";
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
}

exports.revoke = function (context, history, refresh) {
    if (history.length > 0) {
        history.pop();
    }
    if (refresh) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if(history.length>0){
            context.putImageData(history[history.length-1],0,0,0,0,canvas.width,canvas.height);
        }
    }    
   
}

exports.autoSave = function (canvas, context, history) {
    history.push(context.getImageData(0, 0, canvas.width, canvas.height));
}

exports.refreshClient = function (canvas, context, history) {
    if (history.length > 0) {
        context.putImageData(history[history.length - 1], 0, 0, 0, 0, canvas.width, canvas.height);
    }    
}

exports.clearClient = function (canvas, context) {
    context.clearRect(0,0,canvas.width,canvas.height);
}