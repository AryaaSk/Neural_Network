const CANVAS = new Canvas();

const AddNewPoints = () => { //this function can just be called when I need more data points
    const newData: DataPoint[] = [];
    const Data = (x: number, y: number, result: boolean) => { return { x: x, y: y, result: result }; };

    document.body.onclick = ($e) => {
        const screenPosition = { x: $e.clientX, y: $e.clientY };
        const gridPosition = { x: CANVAS.GridX(screenPosition.x), y: CANVAS.GridY(screenPosition.y) };
        CANVAS.plotPoint([gridPosition.x, gridPosition.y], "blue");

        newData.push(Data(gridPosition.x, gridPosition.y, true));
    }
    document.onkeydown = () => {
        const json = JSON.stringify(newData);
        console.log(json);
    }
}

const VisualiseData = (canvas: Canvas, data: DataPoint[]) => {
    for (const point of data) {
        if (point.result == true) {
            canvas.plotPoint([point.x, point.y], "blue");
        }
        else {
            canvas.plotPoint([point.x, point.y], "red");
        }
    }
}

//SEEM TO HAVE SOME ERROR THAT NEURAL NETWORK IS RETURNING SAME RESULT FOR ALL DIFFERENT INPUTS, actually it seems to just give same results for certain values (possibly due to activation function)
const VisualiseNeuralNetwork = (canvas: Canvas, network: Layer[], detail: number) => {
    //split canvas into x*x grid, and just check what output would be for center of all grid cells
    const gridSize = detail;
    const widthInterval = canvas.canvasWidth / gridSize;
    const heightInterval = canvas.canvasHeight / gridSize;
    
    for (let i = -(gridSize / 2); i != gridSize / 2; i += 1) {
        const x =  (i * widthInterval) + (widthInterval / 2); //to get the center of the point
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
}