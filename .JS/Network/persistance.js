"use strict";
//Manages all functions/objects related to persisting data over reloads
const SaveNeuralNetwork = (layers) => {
    const json = JSON.stringify(layers);
    localStorage.setItem("neuralNetwork", json);
};
const RetrieveNeuralNetwork = (config) => {
    const json = localStorage.getItem("neuralNetwork");
    let network = [];
    if (json == null) {
        network = [];
    }
    else {
        network = JSON.parse(json);
    }
    //check if network found in local storage matches config
    let matchesConfig = true;
    if (network.length != config.length) {
        matchesConfig = false;
    }
    else {
        for (const [i, layer] of network.entries()) {
            if (layer.neurons.length != config[i]) {
                matchesConfig = false;
                break;
            }
        }
    }
    if (network.length == 0 || matchesConfig == false) {
        const layers = [];
        for (const layerLength of config) {
            layers.push(new Layer(layerLength));
        }
        network = layers;
        SaveNeuralNetwork(network);
        //will also have to clear any old weight and bias data since we have initialized a new network
        localStorage.removeItem("weightData");
        localStorage.removeItem("biasData");
    }
    InitaliseWeights(network);
    InitialiseBiases(network);
    return network;
};
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
const InitialiseBiases = (layers) => {
    const biasData = localStorage.getItem("biasData"); //array of numbers
    const biasArray = (biasData == undefined) ? [] : JSON.parse(biasData);
    let i = 0;
    for (const layer of layers) {
        for (const neuron of layer.neurons) {
            const key = JSON.stringify([neuron.id]);
            if (biasArray.length == 0) {
                BIASES[key] = 0;
            }
            else {
                BIASES[key] = biasArray[i];
            }
            i += 1;
        }
    }
    if (biasArray.length == 0) {
        SaveBiases(); //save for next time
    }
};
const SaveBiases = () => {
    const array = [];
    for (const key in BIASES) {
        array.push(BIASES[key]);
    }
    localStorage.setItem("biasData", JSON.stringify(array));
};
