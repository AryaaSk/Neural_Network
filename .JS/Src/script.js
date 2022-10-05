"use strict";
const STEP_SIZE = 0.002; //when the cost starts to fluctuate, just reduce the STEP_SIZE
let DATA = JSON.parse('[{"x":-120,"y":203.5,"result":true},{"x":-208,"y":126.5,"result":true},{"x":-215,"y":41.5,"result":true},{"x":-173,"y":-65.5,"result":true},{"x":-73,"y":-113.5,"result":true},{"x":42,"y":-122.5,"result":true},{"x":144,"y":-118.5,"result":true},{"x":214,"y":-74.5,"result":true},{"x":242,"y":-1.5,"result":true},{"x":237,"y":86.5,"result":true},{"x":195,"y":150.5,"result":true},{"x":107,"y":183.5,"result":true},{"x":-2,"y":202.5,"result":true},{"x":-56,"y":161.5,"result":true},{"x":-125,"y":120.5,"result":true},{"x":-144,"y":61.5,"result":true},{"x":-96,"y":-8.5,"result":true},{"x":-5,"y":-47.5,"result":true},{"x":123,"y":-49.5,"result":true},{"x":172,"y":3.5,"result":true},{"x":138,"y":67.5,"result":true},{"x":59,"y":12.5,"result":true},{"x":-11,"y":40.5,"result":true},{"x":-87,"y":85.5,"result":true},{"x":2,"y":116.5,"result":true},{"x":-14,"y":85.5,"result":true},{"x":76,"y":61.5,"result":true},{"x":109,"y":105.5,"result":true},{"x":51,"y":129.5,"result":true},{"x":5,"y":164.5,"result":true},{"x":-59,"y":36.5,"result":true},{"x":-165,"y":-2.5,"result":true},{"x":-79,"y":-58.5,"result":true},{"x":82,"y":-86.5,"result":true},{"x":-35,"y":-1.5,"result":true},{"x":27,"y":49.5,"result":true},{"x":-132,"y":32.5,"result":true},{"x":-133,"y":143.5,"result":true},{"x":-69,"y":124.5,"result":true},{"x":-111,"y":-29.5,"result":true},{"x":-133,"y":109.5,"result":true},{"x":-198,"y":59.5,"result":true},{"x":-153,"y":-40.5,"result":true},{"x":-91,"y":-111.5,"result":true},{"x":72,"y":-128.5,"result":true},{"x":188,"y":-35.5,"result":true},{"x":181,"y":119.5,"result":true},{"x":110,"y":46.5,"result":true},{"x":-54,"y":-89.5,"result":true},{"x":62,"y":-57.5,"result":true},{"x":19,"y":-65.5,"result":true},{"x":59,"y":-19.5,"result":true},{"x":74,"y":131.5,"result":true},{"x":64,"y":111.5,"result":true},{"x":25,"y":27.5,"result":true},{"x":47,"y":158.5,"result":true},{"x":11,"y":184.5,"result":true},{"x":-73,"y":186.5,"result":true},{"x":-132,"y":88.5,"result":true},{"x":-120,"y":-31.5,"result":true},{"x":-39,"y":155.5,"result":true},{"x":-78,"y":27.5,"result":true},{"x":-61,"y":138.5,"result":true},{"x":-182,"y":30.5,"result":true},{"x":-201,"y":63.5,"result":true},{"x":-240,"y":44.5,"result":true},{"x":-204,"y":-75.5,"result":true},{"x":-178,"y":-97.5,"result":true},{"x":-182,"y":-67.5,"result":true},{"x":-52,"y":-131.5,"result":true},{"x":-9,"y":-135.5,"result":true},{"x":77,"y":-105.5,"result":true},{"x":138,"y":62.5,"result":true},{"x":177,"y":-9.5,"result":true},{"x":114,"y":156.5,"result":true},{"x":105,"y":92.5,"result":true},{"x":33,"y":160.5,"result":true},{"x":-42,"y":98.5,"result":true},{"x":-80,"y":30.5,"result":true},{"x":-87,"y":109.5,"result":true},{"x":-84,"y":185.5,"result":true},{"x":-143,"y":110.5,"result":true},{"x":-135,"y":144.5,"result":true},{"x":-124,"y":102.5,"result":true},{"x":-175,"y":71.5,"result":true},{"x":-175,"y":-9.5,"result":true},{"x":-37,"y":-67.5,"result":true},{"x":-36,"y":32.5,"result":true},{"x":-3,"y":-4.5,"result":true},{"x":84,"y":-7.5,"result":true},{"x":96,"y":-3.5,"result":true},{"x":97,"y":-9.5,"result":true},{"x":122,"y":-9.5,"result":true},{"x":100,"y":-0.5,"result":true},{"x":104,"y":-12.5,"result":true},{"x":7,"y":52.5,"result":true},{"x":56,"y":60.5,"result":true},{"x":83,"y":-53.5,"result":true},{"x":-6,"y":106.5,"result":true},{"x":51,"y":12.5,"result":true},{"x":19,"y":-27.5,"result":true},{"x":41,"y":81.5,"result":true},{"x":24,"y":-36.5,"result":true}]');
DATA = DATA.concat(JSON.parse('[{"x":-272,"y":-62.5,"result":false},{"x":-185,"y":-139.5,"result":false},{"x":-15,"y":-184.5,"result":false},{"x":195,"y":-182.5,"result":false},{"x":101,"y":-179.5,"result":false},{"x":268,"y":-128.5,"result":false},{"x":305,"y":-66.5,"result":false},{"x":319,"y":15.5,"result":false},{"x":324,"y":115.5,"result":false},{"x":278,"y":181.5,"result":false},{"x":153,"y":229.5,"result":false},{"x":79,"y":241.5,"result":false},{"x":-81,"y":254.5,"result":false},{"x":-185,"y":243.5,"result":false},{"x":-203,"y":183.5,"result":false},{"x":-260,"y":125.5,"result":false},{"x":-274,"y":37.5,"result":false},{"x":-285,"y":-24.5,"result":false},{"x":-426,"y":-75.5,"result":false},{"x":-356,"y":-170.5,"result":false},{"x":-352,"y":-94.5,"result":false},{"x":-400,"y":45.5,"result":false},{"x":-349,"y":66.5,"result":false},{"x":-487,"y":168.5,"result":false},{"x":-496,"y":356.5,"result":false},{"x":-465,"y":457.5,"result":false},{"x":-364,"y":455.5,"result":false},{"x":-174,"y":448.5,"result":false},{"x":17,"y":438.5,"result":false},{"x":202,"y":434.5,"result":false},{"x":339,"y":435.5,"result":false},{"x":422,"y":424.5,"result":false},{"x":478,"y":320.5,"result":false},{"x":463,"y":119.5,"result":false},{"x":453,"y":221.5,"result":false},{"x":456,"y":-3.5,"result":false},{"x":460,"y":-91.5,"result":false},{"x":472,"y":-179.5,"result":false},{"x":480,"y":-306.5,"result":false},{"x":469,"y":-410.5,"result":false},{"x":462,"y":-506.5,"result":false},{"x":368,"y":-512.5,"result":false},{"x":198,"y":-511.5,"result":false},{"x":31,"y":-500.5,"result":false},{"x":284,"y":-516.5,"result":false},{"x":-74,"y":-504.5,"result":false},{"x":-160,"y":-503.5,"result":false},{"x":-300,"y":-500.5,"result":false},{"x":-380,"y":-508.5,"result":false},{"x":-453,"y":-509.5,"result":false},{"x":-488,"y":-472.5,"result":false},{"x":-480,"y":-392.5,"result":false},{"x":-479,"y":-283.5,"result":false},{"x":-474,"y":-115.5,"result":false},{"x":-480,"y":73.5,"result":false},{"x":-396,"y":202.5,"result":false},{"x":-271,"y":251.5,"result":false},{"x":-386,"y":297.5,"result":false},{"x":-370,"y":397.5,"result":false},{"x":-251,"y":357.5,"result":false},{"x":-87,"y":326.5,"result":false},{"x":-93,"y":377.5,"result":false},{"x":81,"y":331.5,"result":false},{"x":4,"y":326.5,"result":false},{"x":314,"y":323.5,"result":false},{"x":207,"y":283.5,"result":false},{"x":392,"y":365.5,"result":false},{"x":362,"y":240.5,"result":false},{"x":403,"y":99.5,"result":false},{"x":402,"y":-80.5,"result":false},{"x":330,"y":-151.5,"result":false},{"x":430,"y":-233.5,"result":false},{"x":198,"y":-282.5,"result":false},{"x":89,"y":-307.5,"result":false},{"x":351,"y":-356.5,"result":false},{"x":333,"y":-243.5,"result":false},{"x":195,"y":-388.5,"result":false},{"x":397,"y":-454.5,"result":false},{"x":292,"y":-407.5,"result":false},{"x":-271,"y":-220.5,"result":false},{"x":-407,"y":-269.5,"result":false},{"x":-408,"y":-342.5,"result":false},{"x":-296,"y":-335.5,"result":false},{"x":-144,"y":-269.5,"result":false},{"x":-37,"y":-352.5,"result":false},{"x":-6,"y":-262.5,"result":false},{"x":-175,"y":-382.5,"result":false},{"x":-317,"y":-414.5,"result":false},{"x":-424,"y":-442.5,"result":false},{"x":-178,"y":-450.5,"result":false},{"x":-35,"y":-442.5,"result":false},{"x":128,"y":-436.5,"result":false},{"x":62,"y":-385.5,"result":false},{"x":-96,"y":-205.5,"result":false},{"x":-287,"y":184.5,"result":false},{"x":200,"y":371.5,"result":false}]'));
//had to get similar number of true and false points
const RandomID = () => {
    return String(Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1) + 10000000000000));
};
class Neuron {
    //bias stored in separate dictionary
    constructor(value) {
        this.id = "";
        //layer is set implicitly  
        this.value = 0;
        this.id = RandomID();
        if (value != undefined) {
            this.value = value;
        }
    }
    static ActivationFunction(num) {
        //return 1 / (1 + Math.E**-num);
        //return num;
        //return (num <= 0) ? 0 : num;
        return Math.tanh(num);
    }
}
class Layer {
    constructor(numOfNeurons) {
        this.id = "";
        this.neurons = [];
        this.id = RandomID();
        if (numOfNeurons != undefined) {
            this.neurons = [];
            for (let _ = 0; _ != numOfNeurons; _ += 1) {
                this.neurons.push(new Neuron());
            }
        }
    }
}
const LayerCalculateValues = (currentLayer, previousLayer) => {
    for (let i = 0; i != currentLayer.neurons.length; i += 1) { //each neuron in this layer, is connected to every neuron in the previous layer
        const neuron = currentLayer.neurons[i];
        let sum = 0;
        for (let a = 0; a != previousLayer.neurons.length; a += 1) {
            const prevNeuron = previousLayer.neurons[a];
            const nodeWeight = WEIGHTS[JSON.stringify([previousLayer.id, currentLayer.id, prevNeuron.id, neuron.id])];
            sum += prevNeuron.value * nodeWeight;
        }
        const bias = BIASES[JSON.stringify([neuron.id])];
        neuron.value = Neuron.ActivationFunction(sum + bias);
    }
};
const LayerCalculateAverageCost = (layer, correctNeuronIndex) => {
    let totalCost = 0;
    for (let i = 0; i != layer.neurons.length; i += 1) {
        const neuron = layer.neurons[i];
        const difference = (i == correctNeuronIndex) ? 1 - neuron.value : 0 - neuron.value;
        const differenceSquared = difference ** 2;
        totalCost += differenceSquared;
    }
    const averageCost = totalCost / layer.neurons.length;
    return averageCost;
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
const RunNetwork = (network, inputs) => {
    const inputLayer = network[0];
    for (let i = 0; i != inputs.length; i += 1) {
        inputLayer.neurons[i].value = inputs[i];
    }
    for (let i = 1; i != network.length; i += 1) {
        const currentLayer = network[i];
        const previousLayer = network[i - 1];
        LayerCalculateValues(currentLayer, previousLayer);
    }
    return network[network.length - 1]; //return output layer
};
let WEIGHTS = {}; //k: JSON.stringify([layer1ID, layer2ID, neuron1ID, neuron2ID])
let BIASES = {}; //k: JSON.stringify([neuron.id]);
const CalculateCost = (network, dataset) => {
    //use data, pass in x and y, and see how accurately the result predicts true or false
    let totalCost = 0;
    for (const data of dataset) {
        const outputLayer = RunNetwork(network, [data.x, data.y]);
        //outputLayer.neurons[0] represents false, outputLayer.neurons[1] represents true
        const expectedResultIndex = Number(data.result);
        totalCost += LayerCalculateAverageCost(outputLayer, expectedResultIndex);
    }
    const averageCost = totalCost / dataset.length;
    return averageCost;
};
const DecreaseCost = (network, weights, stepSize, dataset) => {
    //run through all the weights, for each weight, find slope at current point, then go down the slope by the STEP_SIZE
    const currentCost = CalculateCost(network, dataset);
    //WEIGHTS
    const weightVector = []; //applied to the weights after all the new weights have been calculated
    for (const key in weights) {
        const deltaX = 0.000000001; //gradient = rise / step
        weights[key] += deltaX;
        const deltaY = CalculateCost(network, dataset) - currentCost;
        const gradient = deltaY / deltaX;
        weights[key] -= deltaX; //store old value to prevent this change from affecting future iterations
        //if gradient is positive, it is an upwards slope, so we want to decrease the weight, negative is downwards slope so we want to increase weight
        if (gradient == 0) {
            weightVector.push(0);
        }
        else if (gradient > 0) {
            weightVector.push(-1 * stepSize);
        }
        else {
            weightVector.push(stepSize);
        }
    }
    //apply weightVector
    let i = 0;
    for (const key in weights) {
        weights[key] += weightVector[i];
        i += 1;
    }
};
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
const CreateMiniBatches = (dataset, batchSize) => {
    const randomOrderDataset = JSON.parse(JSON.stringify(dataset));
    shuffle(randomOrderDataset); //shuffle before to make batches random
    const chunks = [];
    const chunkSize = batchSize;
    for (let i = 0; i < randomOrderDataset.length; i += chunkSize) {
        const chunk = randomOrderDataset.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
};
const Main = () => {
    const network = RetrieveNeuralNetwork();
    if (network.length == 0) {
        const inputLayer = new Layer(2);
        const hiddenLayer = new Layer(3);
        const outputLayer = new Layer(2);
        network.push(inputLayer, hiddenLayer, outputLayer);
        SaveNeuralNetwork(network);
    }
    InitaliseWeights(network);
    InitialiseBiases(network);
    CANVAS.linkCanvas("canvas");
    VisualiseData(CANVAS, DATA);
    VisualiseNeuralNetwork(CANVAS, network, 100);
    console.log("Cost: " + CalculateCost(network, DATA));
    const miniBatchSize = 30;
    let miniBatches = CreateMiniBatches(DATA, miniBatchSize);
    let miniBatchCounter = 0;
    const interval1 = setInterval(() => {
        const miniBatch = miniBatches[miniBatchCounter % miniBatches.length];
        DecreaseCost(network, WEIGHTS, STEP_SIZE, miniBatch);
        DecreaseCost(network, BIASES, STEP_SIZE, miniBatch); //use same function but just replace weights with biases
        console.log("Cost: " + CalculateCost(network, DATA));
        SaveWeights();
        SaveBiases();
        miniBatchCounter += 1;
        if (miniBatchCounter % miniBatches.length == 0) {
            miniBatches = CreateMiniBatches(DATA, miniBatchSize); //create new mini batches to introduce new variety on every cycle
        }
    }, 16);
    const interval2 = setInterval(() => {
        CANVAS.clearCanvas();
        VisualiseData(CANVAS, DATA);
        VisualiseNeuralNetwork(CANVAS, network, 100);
    }, 1000);
    clearInterval(interval1);
    clearInterval(interval2);
    document.onkeydown = ($e) => {
        if ($e.key.toLowerCase() == " ") {
            clearInterval(interval1);
            clearInterval(interval2);
        }
    };
};
Main();
