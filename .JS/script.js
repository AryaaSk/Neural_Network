"use strict";
const STEP_SIZE = 1;
const GetImage = (path) => {
    const promise = new Promise((resolve) => {
        const image = new Image();
        image.src = path;
        image.onload = () => {
            resolve(image);
        };
    });
    return promise;
};
const GetImageData = (image) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const imgData = ctx.getImageData(0, 0, 28, 28).data; //images are 28x28
    const pixels = [];
    for (let i = 0; i != imgData.length; i += 4) {
        pixels.push({
            r: imgData[i],
            g: imgData[i + 1],
            b: imgData[i + 2],
            a: imgData[i + 3],
        });
    }
    return pixels;
};
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
    calculateValues(previousLayer) {
        for (let i = 0; i != this.neurons.length; i += 1) { //each neuron in this layer, is connected to every neuron in the previous layer
            const neuron = this.neurons[i];
            let sum = 0;
            for (let a = 0; a != previousLayer.neurons.length; a += 1) {
                const prevNeuron = previousLayer.neurons[a];
                const nodeWeight = WEIGHTS[JSON.stringify([previousLayer.id, this.id, prevNeuron.id, neuron.id])];
                sum += prevNeuron.value * nodeWeight;
            }
            neuron.value = Neuron.SigmoidFunction(sum + neuron.bias);
        }
    }
    calculateCost(correctNeuronIndex) {
        let cost = 0;
        for (let i = 0; i != this.neurons.length; i += 1) {
            const neuron = this.neurons[i];
            const difference = (i == correctNeuronIndex) ? 1 - neuron.value : 0 - neuron.value;
            const differenceSquared = difference ** 2;
            cost += differenceSquared;
        }
        return cost;
    }
}
const CreateInputLayer = (pixels) => {
    //convert each pixel to greyscale, then create a neuron with that value, add it to an array, and create a layer with those neurons
    const neurons = [];
    for (const pixel of pixels) {
        let lum = 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b; // https://stackoverflow.com/questions/45152358/best-rgb-combination-to-convert-image-into-black-and-white-threshold
        neurons.push(new Neuron(Neuron.SigmoidFunction(lum)));
    }
    const layer = new Layer();
    layer.neurons = neurons;
    return layer;
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
const AdjustWeights = (layers, correctIndex) => {
    const adjustSpecificWeight = (layer1ID, layer2ID, neuron1ID, neuron2ID, loss) => {
        const weightKey = JSON.stringify([layer1ID, layer2ID, neuron1ID, neuron2ID]);
        //if the loss is < 0, the expected result is > than the neuron, so we need to increase the weights to make the result larger
        //otherwise if loss > 0 then the expected result is < than the neuron, so we need to reduce weights
        if (loss < 0) {
            WEIGHTS[weightKey] += STEP_SIZE;
        }
        else {
            WEIGHTS[weightKey] -= STEP_SIZE;
        }
    };
    for (let i = 0; i != layers[layers.length - 1].neurons.length; i += 1) { //output neurons
        const neuron = layers[layers.length - 1].neurons[i];
        const expectedResult = (correctIndex == i) ? 1 : 0;
        const loss = neuron.value - expectedResult; //want to bring loss closer to 0
        //just find all nodes which are connected to loss, and reduce them/bring those closer to 0
        for (let a = 1; a != layers.length; a += 1) {
            const layer1 = layers[a - 1];
            const layer2 = layers[a];
            for (let b = 0; b != layer1.neurons.length; b += 1) {
                const neuron1 = layer1.neurons[b];
                if (a != layers.length - 1) { //not the last layer
                    for (let c = 0; c != layer2.neurons.length; c += 1) {
                        const neuron2 = layer2.neurons[c];
                        adjustSpecificWeight(layer1.id, layer2.id, neuron1.id, neuron2.id, loss);
                    }
                }
                else { //last layer, only connect to the wanted neuron
                    const neuron2 = neuron;
                    adjustSpecificWeight(layer1.id, layer2.id, neuron1.id, neuron2.id, loss);
                }
            }
        }
    }
    SaveWeights();
};
const Main = async () => {
    let totalCost = 0;
    const images = [
        "0/1",
        "1/3",
        "2/5",
        "3/7",
        "4/2",
        "5/0",
        "6/13",
        "7/15",
        "8/17",
        "9/4",
    ];
    for (let counter = 0; counter != images.length; counter += 1) {
        const inputImagePath = `/mnist_png/training/${images[counter]}.png`;
        const image = await GetImage(inputImagePath);
        const pixels = GetImageData(image);
        const layers = [];
        layers.push(CreateInputLayer(pixels)); //input
        layers.push(new Layer(16));
        layers.push(new Layer(16));
        layers.push(new Layer(10)); //output
        InitaliseWeights(layers);
        layers[1].calculateValues(layers[0]);
        layers[2].calculateValues(layers[1]);
        layers[3].calculateValues(layers[2]);
        const cost = layers[3].calculateCost(counter % 10); //0 is first neuron, and is also training image
        totalCost += cost;
        //to minimise cost we need to increase all weights which will increase the output neuron corresponding to the one we want
        //however we also need to decrease all weights which will affect the other output neurons
        //increase/decrease refers to further/closer to 0
        AdjustWeights(layers, counter & 10);
    }
    const averageCost = totalCost / images.length;
    console.log("Average cost: " + averageCost); //we need to find a way to reduce average cost
    //COST KEEPS CONVERGING TO 1.8, I DONT THINK THIS LEARNING METHOD IS WORKING
};
Main();
