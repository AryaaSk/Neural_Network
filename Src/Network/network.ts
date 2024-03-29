interface DataPoint {
    inputs: number[];
    expectedOutputs: number[];
}

const RandomID = () => {
    return String(Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1) + 10000000000000));
}






class Neuron {
    id: string = ""
    rawValue: number = 0;
    value: number = 0;
    //layer is set implicitly  
    //bias stored in separate dictionary

    constructor(value?: number) {
        this.id = RandomID();
        if (value != undefined) {
            this.value = value;
        }
    }

    static ActivationFunction(num: number) {
        return Sigmoid(num);
    }
    static ActivationDerivative(num: number) {
        return SigmoidDerivative(num);
    }
}
const Sigmoid = (num: number) => {
    return 1 / (1 + Math.E**-num);
}
const SigmoidDerivative = (num: number) => {
    return (1 - Sigmoid(num)) * Sigmoid(num);
}
const RELU = (num: number) => {
    return (num <= 0) ? 0 : num;
}
const REULDerivative = (num: number) => {
    return (num <= 0) ? 0 : 1;
}
const HyperbolicTan = (num: number) => {
    return Math.tanh(num);
}
const HyperbolicTanDerivative = (num: number) => {
    return 1 - (Math.tanh(num)**2)
}






class Layer {
    id: string = "";
    neurons: Neuron[] = [];

    constructor(numOfNeurons?: number) {
        this.id = RandomID();

        if (numOfNeurons != undefined) {
            this.neurons = [];
            for (let _ = 0; _ != numOfNeurons; _ += 1) {
                this.neurons.push(new Neuron());
            }
        }
    }
}
const LayerCalculateValues = (currentLayer: Layer, previousLayer: Layer) => {
    for (let i = 0; i != currentLayer.neurons.length; i += 1) { //each neuron in this layer, is connected to every neuron in the previous layer
        const neuron = currentLayer.neurons[i];

        let sum = 0;
        for (let a = 0; a != previousLayer.neurons.length; a += 1) {
            const prevNeuron = previousLayer.neurons[a];
            const nodeWeight = WEIGHTS[JSON.stringify([previousLayer.id, currentLayer.id, prevNeuron.id, neuron.id])];
            sum += prevNeuron.value * nodeWeight
        }
        const bias = BIASES[JSON.stringify([neuron.id])];
        const rawValue = sum + bias;
        neuron.rawValue = rawValue;
        neuron.value = Neuron.ActivationFunction(rawValue);
    }
}






const RunNetwork = (network: Layer[], inputs: number[]) => {
    const inputLayer = network[0];
    for (let i = 0; i != inputs.length; i += 1) {
        inputLayer.neurons[i].rawValue = inputs[i];
        inputLayer.neurons[i].value = inputs[i];
    }

    for (let i = 1; i != network.length; i += 1) {
        const currentLayer = network[i];
        const previousLayer = network[i - 1];
        LayerCalculateValues(currentLayer, previousLayer);
    }

    return network[network.length - 1]; //return output layer
}

const CalculateCost = (network: Layer[], dataset: DataPoint[]) => {
    //use data, pass in x and y, and see how accurately the result predicts true or false
    let totalDatasetCost = 0;
    for (const data of dataset) {
        const outputLayer = RunNetwork(network, data.inputs);

        //outputLayer.neurons[0] represents false, outputLayer.neurons[1] represents true
        let totalCost = 0;
        for (let i = 0; i != outputLayer.neurons.length; i += 1) {
            const neuron = outputLayer.neurons[i];
            const difference = data.expectedOutputs[i] - neuron.value;
            const differenceSquared = difference**2;
            totalCost += differenceSquared;
        }

        totalDatasetCost += totalCost;
    }

    const averageCost = totalDatasetCost / dataset.length;
    return averageCost;
}






function shuffle(array: any[]) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
const CreateMiniBatches = (dataset: any[], batchSize: number) => {
    const randomOrderDataset = JSON.parse(JSON.stringify(dataset));
    shuffle(randomOrderDataset); //shuffle before to make batches random

    const chunks: DataPoint[][] = [];
    const chunkSize = batchSize;
    for (let i = 0; i < randomOrderDataset.length; i += chunkSize) {
        const chunk = randomOrderDataset.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    return chunks;
}






const Train = (network: Layer[], data: DataPoint[], epochIterations: number, stepSize: number, miniBatchSize: number, epochCallback?: () => void) => {
    let [miniBatches, miniBatchCounter] = [CreateMiniBatches(data, miniBatchSize), 0];

    let i = 0;
    while (i != epochIterations) {
        const miniBatch = miniBatches[miniBatchCounter % miniBatches.length];

        Learn1(network, stepSize, miniBatch);
        SaveWeights();
        SaveBiases();

        miniBatchCounter += 1;
        if (miniBatchCounter % miniBatches.length == 0) { //completed 1 epoch
            miniBatches = CreateMiniBatches(data, miniBatchSize); //create new mini batches to introduce new variety on every cycle
            i += 1;

            if (epochCallback != undefined) {
                epochCallback();
            }
        }
    }
}