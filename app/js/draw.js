function Draw(cxt, settings) {
    this.cxt = cxt;
    this.strokeFillStyle = settings.strokeFillStyle || "stroke";
    this.strokeColor = settings.strokeColor || "#000";
    this.fillColor = settings.fillColor || "#fff";
    this.width = settings.width || "1";
}
Draw.prototype = {
    setup: function () {
        this.cxt.strokeStyle = this.strokeColor;
        this.cxt.fillStyle = this.fillColor;
        this.cxt.lineWidth = this.width;
    },
    draw: function () {
        if (this.strokeFillStyle == "stroke") {
            this.cxt.stroke();
        }
        else if (this.strokeFillStyle == "fill") {
            this.cxt.fill();
        }
        else if (this.strokeFillStyle == "strokeFill") {
            this.cxt.stroke();
            this.cxt.fill();
        }
    },
    rect: function (x1, y1, x2, y2) {
        this.setup();
        this.cxt.beginPath();
        this.cxt.rect(x1, y1, x2 - x1, y2 - y1);
        this.draw();
        
    },
    line: function (x1, y1, x2, y2) {
        this.setup();
        this.cxt.beginPath();
        this.cxt.moveTo(x1, y1);
        this.cxt.lineTo(x2, y2);
        this.cxt.stroke();
    },
    circle: function (x1, y1, x2, y2) {
        this.setup();
        var r = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
        this.cxt.beginPath();
        this.cxt.arc(x1, y1, r, 0, 2 * Math.PI);
        this.draw();
    },
    poly: function (x1, y1, x2, y2, n) {
        this.setup();
        var cxt = this.cxt;
        var r = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));;
        cxt.save();
        cxt.translate(x1, y1);
        cxt.rotate(Math.PI / 2);
        var nx = r * Math.cos(Math.PI / n);
        var ny = r * Math.sin(Math.PI / n);
        cxt.beginPath();
        cxt.lineCap = "round";
        cxt.moveTo(nx, ny);
        for (var i = 0; i <= n; i++) {
            cxt.rotate(Math.PI * 2 / n);
            cxt.lineTo(nx, -ny);
        }
        this.draw();
        cxt.restore();
    },
    pen: function (x1, y1, x2, y2) {
        this.setup();
        this.cxt.save();
        this.cxt.lineCap = "round";
        this.cxt.lineTo(x2, y2);
        this.cxt.stroke();
        this.cxt.restore();
    },
    eraser: function (x1, y1, x2, y2) {
        this.cxt.lineCap = "round";
        this.cxt.clearRect(x2 - 5, y2 - 5, 10, 10);
    },
    cut: function (x1, y1, x2, y2) {
        this.setup();
        this.cxt.save();
        this.cxt.setLineDash([4, 2]);
        this.cxt.beginPath();
        this.cxt.lineWidth = 1;
        this.cxt.rect(x1, y1, x2 - x1, y2 - y1);
        this.cxt.stroke();
        this.cxt.restore();
    }
}

module.exports = Draw;