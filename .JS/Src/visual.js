"use strict";
const CANVAS = new Canvas();
const AddNewPoints = () => {
    const newData = [];
    const Data = (x, y, result) => { return { x: x, y: y, result: result }; };
    document.body.onclick = ($e) => {
        const screenPosition = { x: $e.clientX, y: $e.clientY };
        const gridPosition = { x: CANVAS.GridX(screenPosition.x), y: CANVAS.GridY(screenPosition.y) };
        CANVAS.plotPoint([gridPosition.x, gridPosition.y], "red");
        newData.push(Data(gridPosition.x, gridPosition.y, false));
    };
    document.onkeydown = () => {
        const json = JSON.stringify(newData);
        console.log(json);
    };
};
const VisualiseData = (canvas, data) => {
    for (const point of data) {
        if (point.result == true) {
            canvas.plotPoint([point.x, point.y], "blue");
        }
        else {
            canvas.plotPoint([point.x, point.y], "red");
        }
    }
};
//SEEM TO HAVE SOME ERROR THAT NEURAL NETWORK IS RETURNING SAME RESULT FOR ALL DIFFERENT INPUTS
const VisualiseNeuralNetwork = (canvas, network) => {
    //split canvas into 20x20 grid, and just check what output would be for center of all grid cells
    const gridSize = 20;
    const widthInterval = canvas.canvasWidth / gridSize;
    const heightInterval = canvas.canvasHeight / gridSize;
    for (let i = 0; i != gridSize; i += 1) {
        const x = (i * widthInterval) + (widthInterval / 2); //to get the center of the point
        for (let a = 0; a != gridSize; a += 1) {
            const y = (a * heightInterval) + (heightInterval / 2);
            const outputLayer = RunNetwork(network, [x, y]); //find highest neuron, if it is [0] then the network's result is false, otherwise [1] means the network thinks it's true
            console.log(x, y);
            const highestIndexNeuron = LayerFindHighestNeuronValueIndex(outputLayer);
            let blockColour = "";
            if (highestIndexNeuron == 0) {
                blockColour = "#ff000050";
            }
            else {
                blockColour = "#0000ff50";
            }
            canvas.drawShape([
                [(i * widthInterval), (a * heightInterval)],
                [(i * widthInterval) + widthInterval, (a * heightInterval)],
                [(i * widthInterval) + widthInterval, (a * heightInterval) + heightInterval],
                [(i * widthInterval), (a * heightInterval) + heightInterval]
            ], blockColour);
        }
    }
};
