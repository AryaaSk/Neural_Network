"use strict";
const CANVAS = new Canvas();
const AddNewPoints = (expectedOutputs, colour) => {
    const newData = [];
    const Data = (inputs, expectedOutputs) => { return { inputs: inputs, expectedOutputs: expectedOutputs }; };
    document.body.onclick = ($e) => {
        const screenPosition = { x: $e.clientX, y: $e.clientY };
        const gridPosition = { x: CANVAS.GridX(screenPosition.x), y: CANVAS.GridY(screenPosition.y) };
        CANVAS.plotPoint([gridPosition.x, gridPosition.y], colour);
        newData.push(Data([gridPosition.x, gridPosition.y], expectedOutputs));
    };
    document.onkeydown = () => {
        const json = JSON.stringify(newData);
        console.log(json);
    };
};
const VisualiseData = (canvas, data) => {
    for (const point of data) {
        if (point.expectedOutputs[1] == 1) { //true
            canvas.plotPoint([point.inputs[0], point.inputs[1]], "blue");
        }
        else {
            canvas.plotPoint([point.inputs[0], point.inputs[1]], "red");
        }
    }
};
//SEEM TO HAVE SOME ERROR THAT NEURAL NETWORK IS RETURNING SAME RESULT FOR ALL DIFFERENT INPUTS, actually it seems to just give same results for certain values (possibly due to activation function)
const VisualiseNeuralNetwork = (canvas, network, detail) => {
    //split canvas into x*x grid, and just check what output would be for center of all grid cells
    const gridSize = detail;
    const widthInterval = canvas.canvasWidth / gridSize;
    const heightInterval = canvas.canvasHeight / gridSize;
    for (let i = -(gridSize / 2); i != gridSize / 2; i += 1) {
        const x = (i * widthInterval) + (widthInterval / 2); //to get the center of the point
        for (let a = -(gridSize / 2); a != gridSize / 2; a += 1) {
            const y = (a * heightInterval) + (heightInterval / 2);
            const outputLayer = RunNetwork(network, [x, y]); //find highest neuron, if it is [0] then the network's result is false, otherwise [1] means the network thinks it's true
            //console.log(x, y, [outputLayer.neurons[0].value, outputLayer.neurons[1].value]);
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
const LayerFindHighestNeuronValueIndex = (layer) => {
    let highestIndex = 0;
    for (const [i, neuron] of layer.neurons.entries()) {
        if (neuron.value > layer.neurons[highestIndex].value) {
            highestIndex = i;
        }
    }
    return highestIndex;
};
