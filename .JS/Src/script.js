"use strict";
const STEP_SIZE = 1;
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
