//A single file to hold the DecreaseCost() function, which just has to modify the weights to decrease the overall cost of the network

//https://www.youtube.com/watch?v=hfMk-kjRv4c
//https://medium.com/spidernitt/breaking-down-neural-networks-an-intuitive-approach-to-backpropagation-3b2ff958794c
//https://ai.stackexchange.com/questions/31566/different-ways-to-calculate-backpropagation-derivatives-any-differenc

const CostDerivative = (actualOutput: number, expectedOutput: number) => {
    return 2 * (expectedOutput - actualOutput);
}
const Learn1 = (network: Layer[], stepSize: number, dataset: DataPoint[]) => {
    //Initialise gradient storage
    const weightDescentGradients: { [weightID: string]: number } = {};
    const biasDescentGradients: { [biasID: string]: number } = {};
    for (const weightKey in WEIGHTS) {
        weightDescentGradients[weightKey] = 0;
    }
    for (const biasKey in BIASES) {
        biasDescentGradients[biasKey] = 0;
    }

    for (const data of dataset) {
        RunNetwork(network, data.inputs); //forward propogate the data through the network

        const nodeValues: { [neuronID: string] : number } = {};
        //Output layer derivative: d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
        const outputLayer = network[network.length - 1];
        const previousLayer = network[network.length - 2];

        for (const [i, neuron] of outputLayer.neurons.entries()) {
            //Go through each weight in the last layer, calculate derivative of d[NC]/d[Weight], then just modify weight using gradient descent
            const activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);
            const expectedOutput = data.expectedOutputs[i];
            const DerivativeCostWRTOutput = CostDerivative(neuron.value, expectedOutput);

            const nodeValue = activationDerivative * DerivativeCostWRTOutput; //set the node value for the specific neuron
            nodeValues[neuron.id] = nodeValue;

            UpdateWeightsBiases(nodeValue, neuron, outputLayer, previousLayer, weightDescentGradients, biasDescentGradients);
        }



        //now we just backpropogate until we have gone through all the hidden layers
        for (let i = network.length - 2; i != 0; i -= 1) {
            const nextLayer = network[i + 1];
            const layer = network[i];
            const previousLayer = network[i - 1];

            //d[NC]/d[WeightPrev] = [PreviousPreviousOutput] * (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])

            //calculate node values, the sum of the [weights out of neuron] * [node values of neurons in next layer], then multiplied by ActivationDerivative(ROp)
            for (const neuron of layer.neurons) {
                let sum = 0;
                for (const nextNeuron of nextLayer.neurons) {
                    const weightBetweenNeurons = WEIGHTS[JSON.stringify([layer.id, nextLayer.id, neuron.id, nextNeuron.id])];
                    const nextNeuronNodeValue = nodeValues[nextNeuron.id];
                    sum += weightBetweenNeurons * nextNeuronNodeValue;
                }
                
                const activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);
                const nodeValue = activationDerivative * sum;
                nodeValues[neuron.id] = nodeValue;

                UpdateWeightsBiases(nodeValue, neuron, layer, previousLayer, weightDescentGradients, biasDescentGradients);
            }
            
        }
    }

    ApplyGradients(stepSize, weightDescentGradients, biasDescentGradients);
}

//Calculates weight gradients between a neuron and all the nodes connected to it in the previous layer
const UpdateWeightsBiases = (nodeValue: number, currentNeuron: Neuron, currentlayer: Layer, previousLayer: Layer, weightDescentGradients: {[weightID: string] : number}, biasDescentGradients: {[biasID: string] : number}) => {
    for (const prevNeuron of previousLayer.neurons) {
        const weightKey = JSON.stringify([previousLayer.id, currentlayer.id, prevNeuron.id, currentNeuron.id])
        const PreviousOutput = prevNeuron.value;
        const weightGradient = PreviousOutput * nodeValue;

        weightDescentGradients[weightKey] += weightGradient; //add them instead of assigning new gradient since it needs to layer on top of all other gradients for other data
    }

    //d[NC]/d[Bias] = 1 * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
    const biasGradient = 1 * nodeValue;
    const biasKey = JSON.stringify([currentNeuron.id]);
    biasDescentGradients[biasKey] += biasGradient;
}

const ApplyGradients = (stepSize: number, weightDescentGradients: {[weightID: string] : number}, biasDescentGradients: {[biasID: string] : number}) => {
    for (const key in WEIGHTS) {
        const gradient = weightDescentGradients[key];
        if (gradient == 0) {} //do nothing, since the weight is already at the minimum
        else if (gradient > 0) {
            WEIGHTS[key] += stepSize;            
        }
        else {
            WEIGHTS[key] -= stepSize;            
        }
        weightDescentGradients[key] = 0;
    }

    for (const key in BIASES) {
        const gradient = biasDescentGradients[key];
        if (gradient == 0) {}
        else if (gradient > 0) {
            BIASES[key] += stepSize;            
        }
        else {
            BIASES[key] -= stepSize;            
        }
        biasDescentGradients[key] = 0;
    }
}