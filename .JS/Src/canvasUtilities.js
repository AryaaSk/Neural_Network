"use strict";
//Canvas Utilites - from Aryaa3D (https://github.com/AryaaSk/3D-Engine/blob/master/Source/aryaa3D.ts)
let dpi = window.devicePixelRatio;
class Canvas {
    constructor() {
        this.canvas = undefined;
        this.c = undefined;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.linkCanvas = (canvasID) => {
            this.canvas = document.getElementById(canvasID);
            this.c = this.canvas.getContext('2d');
            this.canvasHeight = document.getElementById(canvasID).getBoundingClientRect().height; //Fix blury lines
            this.canvasWidth = document.getElementById(canvasID).getBoundingClientRect().width;
            this.canvas.setAttribute('height', String(this.canvasHeight * dpi));
            this.canvas.setAttribute('width', String(this.canvasWidth * dpi));
            document.body.onresize = () => {
                this.linkCanvas(canvasID);
            };
        };
        //ACTUAL DRAWING FUNCTIONS - MatterJS doesn't use ScreenX and ScreenY, so I disabled those functions
        this.ScreenX = (x) => {
            if (this.c == undefined) {
                console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
                return;
            }
            return ((this.canvasWidth / 2) + x) * dpi;
        };
        this.ScreenY = (y) => {
            if (this.c == undefined) {
                console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
                return;
            }
            return ((this.canvasHeight / 2) - y) * dpi;
        };
        this.GridX = (screenX) => {
            return (screenX) - (this.canvasWidth / 2);
        };
        this.GridY = (screenY) => {
            return -((screenY) - (this.canvasHeight / 2));
        };
        this.plotPoint = (p, colour, label) => {
            if (this.c == undefined) {
                console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
                return;
            }
            //point will be in format: [x, y]
            this.c.fillStyle = colour;
            this.c.fillRect(this.ScreenX(p[0]), this.ScreenY(p[1]), 10, 10);
            if (label != undefined) {
                this.c.font = `${20 * dpi}px Arial`;
                this.c.fillText(label, this.ScreenX(p[0]) + 10, this.ScreenY(p[1]) + 10);
            }
        };
        this.drawLine = (p1, p2, colour, thickness) => {
            if (this.c == undefined) {
                console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
                return;
            }
            const linKThickness = (thickness == undefined) ? 1 : thickness;
            //points will be in format: [x, y]
            //I need to convert the javascript x and y into actual grid x and y
            this.c.strokeStyle = colour;
            this.c.lineWidth = linKThickness;
            this.c.beginPath();
            this.c.moveTo(this.ScreenX(p1[0]), this.ScreenY(p1[1]));
            this.c.lineTo(this.ScreenX(p2[0]), this.ScreenY(p2[1]));
            this.c.stroke();
        };
        this.drawShape = (points, colour, outline, outlineColour) => {
            if (this.c == undefined) {
                console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
                return;
            }
            if (points.length == 2) {
                this.drawLine(points[0], points[1], colour);
                return;
            }
            else if (points.length < 3) {
                console.error("Cannot draw shape, need at least 3 points to draw a shape");
                return;
            }
            this.c.fillStyle = colour;
            this.c.beginPath();
            this.c.moveTo(this.ScreenX(points[0][0]), this.ScreenY(points[0][1]));
            for (let pointsIndex = 1; pointsIndex != points.length; pointsIndex += 1) {
                this.c.lineTo(this.ScreenX(points[pointsIndex][0]), this.ScreenY(points[pointsIndex][1]));
            }
            this.c.closePath();
            this.c.fill();
            if (outline == true) {
                const lineColour = (outlineColour == undefined) ? "#000000" : outlineColour;
                if (outlineColour != undefined) { }
                for (let i = 1; i != points.length; i += 1) {
                    this.drawLine(points[i - 1], points[i], lineColour);
                }
                this.drawLine(points[points.length - 1], points[0], lineColour); //to cover the line from last point to first point
            }
        };
        this.clearCanvas = () => {
            if (this.c == undefined) {
                console.error("Cannot draw, canvas is not linked, please use the linkCanvas(canvasID) before rendering any shapes");
                return;
            }
            this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
    }
}
