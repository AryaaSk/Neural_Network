"use strict";
const STEP_SIZE = 1;
let DATA = JSON.parse('[{"x":-120,"y":203.5,"result":true},{"x":-208,"y":126.5,"result":true},{"x":-215,"y":41.5,"result":true},{"x":-173,"y":-65.5,"result":true},{"x":-73,"y":-113.5,"result":true},{"x":42,"y":-122.5,"result":true},{"x":144,"y":-118.5,"result":true},{"x":214,"y":-74.5,"result":true},{"x":242,"y":-1.5,"result":true},{"x":237,"y":86.5,"result":true},{"x":195,"y":150.5,"result":true},{"x":107,"y":183.5,"result":true},{"x":-2,"y":202.5,"result":true},{"x":-56,"y":161.5,"result":true},{"x":-125,"y":120.5,"result":true},{"x":-144,"y":61.5,"result":true},{"x":-96,"y":-8.5,"result":true},{"x":-5,"y":-47.5,"result":true},{"x":123,"y":-49.5,"result":true},{"x":172,"y":3.5,"result":true},{"x":138,"y":67.5,"result":true},{"x":59,"y":12.5,"result":true},{"x":-11,"y":40.5,"result":true},{"x":-87,"y":85.5,"result":true},{"x":2,"y":116.5,"result":true},{"x":-14,"y":85.5,"result":true},{"x":76,"y":61.5,"result":true},{"x":109,"y":105.5,"result":true},{"x":51,"y":129.5,"result":true},{"x":5,"y":164.5,"result":true},{"x":-59,"y":36.5,"result":true},{"x":-165,"y":-2.5,"result":true},{"x":-79,"y":-58.5,"result":true},{"x":82,"y":-86.5,"result":true}]');
DATA = DATA.concat(JSON.parse('[{"x":-272,"y":-62.5,"result":false},{"x":-185,"y":-139.5,"result":false},{"x":-15,"y":-184.5,"result":false},{"x":195,"y":-182.5,"result":false},{"x":101,"y":-179.5,"result":false},{"x":268,"y":-128.5,"result":false},{"x":305,"y":-66.5,"result":false},{"x":319,"y":15.5,"result":false},{"x":324,"y":115.5,"result":false},{"x":278,"y":181.5,"result":false},{"x":153,"y":229.5,"result":false},{"x":79,"y":241.5,"result":false},{"x":-81,"y":254.5,"result":false},{"x":-185,"y":243.5,"result":false},{"x":-203,"y":183.5,"result":false},{"x":-260,"y":125.5,"result":false},{"x":-274,"y":37.5,"result":false},{"x":-285,"y":-24.5,"result":false},{"x":-426,"y":-75.5,"result":false},{"x":-356,"y":-170.5,"result":false},{"x":-352,"y":-94.5,"result":false},{"x":-400,"y":45.5,"result":false},{"x":-349,"y":66.5,"result":false},{"x":-487,"y":168.5,"result":false},{"x":-496,"y":356.5,"result":false},{"x":-465,"y":457.5,"result":false},{"x":-364,"y":455.5,"result":false},{"x":-174,"y":448.5,"result":false},{"x":17,"y":438.5,"result":false},{"x":202,"y":434.5,"result":false},{"x":339,"y":435.5,"result":false},{"x":422,"y":424.5,"result":false},{"x":478,"y":320.5,"result":false},{"x":463,"y":119.5,"result":false},{"x":453,"y":221.5,"result":false},{"x":456,"y":-3.5,"result":false},{"x":460,"y":-91.5,"result":false},{"x":472,"y":-179.5,"result":false},{"x":480,"y":-306.5,"result":false},{"x":469,"y":-410.5,"result":false},{"x":462,"y":-506.5,"result":false},{"x":368,"y":-512.5,"result":false},{"x":198,"y":-511.5,"result":false},{"x":31,"y":-500.5,"result":false},{"x":284,"y":-516.5,"result":false},{"x":-74,"y":-504.5,"result":false},{"x":-160,"y":-503.5,"result":false},{"x":-300,"y":-500.5,"result":false},{"x":-380,"y":-508.5,"result":false},{"x":-453,"y":-509.5,"result":false},{"x":-488,"y":-472.5,"result":false},{"x":-480,"y":-392.5,"result":false},{"x":-479,"y":-283.5,"result":false},{"x":-474,"y":-115.5,"result":false},{"x":-480,"y":73.5,"result":false},{"x":-396,"y":202.5,"result":false},{"x":-271,"y":251.5,"result":false},{"x":-386,"y":297.5,"result":false},{"x":-370,"y":397.5,"result":false},{"x":-251,"y":357.5,"result":false},{"x":-87,"y":326.5,"result":false},{"x":-93,"y":377.5,"result":false},{"x":81,"y":331.5,"result":false},{"x":4,"y":326.5,"result":false},{"x":314,"y":323.5,"result":false},{"x":207,"y":283.5,"result":false},{"x":392,"y":365.5,"result":false},{"x":362,"y":240.5,"result":false},{"x":403,"y":99.5,"result":false},{"x":402,"y":-80.5,"result":false},{"x":330,"y":-151.5,"result":false},{"x":430,"y":-233.5,"result":false},{"x":198,"y":-282.5,"result":false},{"x":89,"y":-307.5,"result":false},{"x":351,"y":-356.5,"result":false},{"x":333,"y":-243.5,"result":false},{"x":195,"y":-388.5,"result":false},{"x":397,"y":-454.5,"result":false},{"x":292,"y":-407.5,"result":false},{"x":-271,"y":-220.5,"result":false},{"x":-407,"y":-269.5,"result":false},{"x":-408,"y":-342.5,"result":false},{"x":-296,"y":-335.5,"result":false},{"x":-144,"y":-269.5,"result":false},{"x":-37,"y":-352.5,"result":false},{"x":-6,"y":-262.5,"result":false},{"x":-175,"y":-382.5,"result":false},{"x":-317,"y":-414.5,"result":false},{"x":-424,"y":-442.5,"result":false},{"x":-178,"y":-450.5,"result":false},{"x":-35,"y":-442.5,"result":false},{"x":128,"y":-436.5,"result":false},{"x":62,"y":-385.5,"result":false},{"x":-96,"y":-205.5,"result":false},{"x":-287,"y":184.5,"result":false},{"x":200,"y":371.5,"result":false}]'));
const RandomID = () => {
    return String(Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1) + 10000000000000));
};
class Neuron {
    constructor(value) {
        this.id = "";
        //layer is set implicitly  
        this.value = 0;
        this.bias = 0;
        this.id = RandomID();
        if (value != undefined) {
            this.value = value;
        }
    }
    static SigmoidFunction(num) {
        return 1 / (1 + Math.E ** -num);
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
        neuron.value = Neuron.SigmoidFunction(sum + neuron.bias);
    }
};
const LayerCalculateCost = (layer, correctNeuronIndex) => {
    let cost = 0;
    for (let i = 0; i != layer.neurons.length; i += 1) {
        const neuron = layer.neurons[i];
        const difference = (i == correctNeuronIndex) ? 1 - neuron.value : 0 - neuron.value;
        const differenceSquared = difference ** 2;
        cost += differenceSquared;
    }
    return cost;
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
const SaveNeuralNetwork = (layers) => {
    const json = JSON.stringify(layers);
    localStorage.setItem("neuralNetwork", json);
};
const RetrieveNeuralNetwork = () => {
    const json = localStorage.getItem("neuralNetwork");
    if (json == null) {
        return [];
    }
    else {
        return JSON.parse(json);
    }
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
const InitaliseWeights = (layers) => {
    const weightData = localStorage.getItem("weightData");
    let weightArray = (weightData == undefined) ? undefined : JSON.parse(weightData);
    const weightFunction = () => {
        const randomNumber = -1 + Math.random() + Math.random(); //random number from -1 to 1
        return randomNumber;
    };
    let counter = 0;
    for (let i = 1; i != layers.length; i += 1) {
        const [layer1, layer2] = [layers[i - 1], layers[i]];
        for (let a = 0; a != layer1.neurons.length; a += 1) {
            for (let b = 0; b != layer2.neurons.length; b += 1) {
                const [neuron1, neuron2] = [layer1.neurons[a], layer2.neurons[b]];
                const key = JSON.stringify([layer1.id, layer2.id, neuron1.id, neuron2.id]);
                if (weightArray == undefined) { //if weight array is undefined then create random value
                    WEIGHTS[key] = weightFunction();
                }
                else {
                    WEIGHTS[key] = weightArray[counter];
                }
                counter += 1;
            }
        }
    }
    if (weightArray == undefined) { //save to local storage so it can be persisted
        SaveWeights();
    }
};
const SaveWeights = () => {
    const array = [];
    for (const key in WEIGHTS) {
        array.push(WEIGHTS[key]);
    }
    localStorage.setItem("weightData", JSON.stringify(array));
};
const CalculateCost = (network) => {
    //use data, pass in x and y, and see how accurately the result predicts true or false
    let totalCost = 0;
    for (const data of DATA) {
        const outputLayer = RunNetwork(network, [data.x, data.y]);
        //outputLayer.neurons[0] represents false, outputLayer.neurons[1] represents true
        const expectedResultIndex = Number(data.result);
        totalCost += LayerCalculateCost(outputLayer, expectedResultIndex);
    }
    const averageCost = totalCost / DATA.length;
    return averageCost;
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
    //the network is now persistent even after reloading
    console.log(network);
    console.log(WEIGHTS);
    console.log(CalculateCost(network));
    CANVAS.linkCanvas("canvas");
    VisualiseData(CANVAS, DATA);
    VisualiseNeuralNetwork(CANVAS, network);
};
Main();
