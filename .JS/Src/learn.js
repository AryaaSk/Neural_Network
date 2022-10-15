"use strict";
//A single file to hold the DecreaseCost() function, which just has to modify the weights to decrease the overall cost of the network
/*
//Calculus:
RawOutput [RO] = [PreviousOutput][Weight] + [Bias]
Output [O] = Sigmoid([RO])
NeuronCost [NC] = ([ExpectedOutput] - [O])2

d[NC]/d[Weight] = d[RO]/d[Weight] * d[O]/d[RO] * d[NC]/d[O]
- d[RO]/d[Weight] = [PreviousOutput]
- d[O]/d[RO] = (1 - Sigmoid(RO)) * Sigmoid(RO)
- d[NC]/d[O] = 2([ExpectedOutput] - [O])
- Therefore: d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])

AverageCost = TotalNeuronCost / NumOfNeurons
- By reducing each neuron's cost we will also reduce the overall cost



- The above only works for neurons in the last/output layer, we also want to adjust neurons in all the other layers
- We cannot determine [ExpectedOutput] for neurons in hidden layers, so we must keep the derivative as d[NC]/d[AnyWeight], so it is always adjusting weights to improve the overall cost

RawOutputPrev [ROp] = [PreviousPreviousOutput][WeightPrev] + [BiasPrev]
OutputPrev [Op] = Sigmoid([ROp])
RawOutput [RO] = [PreviousOutput which is also [Op]][Weight] + [Bias]
Output [O] = Sigmoid([RO])
NeuronCost [NC] = ([ExpectedOutput] - [O])2

d[NC]/d[WeightPrev] = d[ROp]/d[WeightPrev] * d[Op]/d[ROp] * d[RO]/d[Op] * ([d[O]/d[RO] * d[NC]/d[O]])
- d[ROp]/d[WeightPrev] = [PreviousPreviousOutput]
- d[Op]/d[ROp] = (1 - Sigmoid(ROp)) * Sigmoid(ROp)
- d[RO]/d[Op] = [Weight]
- We already have ([d[O]/d[RO] * d[NC]/d[O]]) from calculating the derivative for the output layer weights
- Therefore d[NC]/d[WeightPrev] = [PreviousPreviousOutput] * (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])


- I am a bit confused why the derivative of d[NC]/d[WeightPrev] or even d[NC]/d[Weight] do not contain the original weight variable which they are in respect to
- This would suggest that the gradient will be constant throughout without adjusting the weight
- Below is a diagram labelling the different components of the neural network

        2|---(3/4)---|5
    (1)--|           |--(6/7)
              ()
    ()                  ()
              ()
1 = PreviousPreviousOutput
2 = WeightPrev
3 = RawOutputPrev [ROp]
4 = OutputPrev [Op]
5 = Weight
6 = RawOutput [RO]
7 = Output [O]



I will do one more for the 3rd last layer of weights, to try and see a pattern

RawOutputPrevPrev [ROpp] = [PreviousPreviousPreviousOutput][WeightPrevPrev] + [BiasPrevPrev]
OutputPrevPrev [Opp] = Sigmoid([ROpp])
RawOutputPrev [ROp] = [Opp][WeightPrev] + [BiasPrev]
OutputPrev [Op] = Sigmoid([ROp])
RawOutput [RO] = [PreviousOutput which is also [Op]][Weight] + [Bias]
Output [O] = Sigmoid([RO])
NeuronCost [NC] = ([ExpectedOutput] - [O])2

d[NC]/d[WeightPrevPrev] = d[ROpp]/d[WeightPrevPrev] * d[Opp]/d[ROpp] * d[ROp]/d[Opp] * ( d[Op]/d[ROp] * d[RO]/d[Op] * ([d[O]/d[RO] * d[NC]/d[O]]) )
- We already know d[Op]/d[ROp] * d[RO]/d[Op] * ([d[O]/d[RO] * d[NC]/d[O]]) from previous iteration
- We need to calculate d[ROp]/d[Opp] which is just [WeightPrev]
- d[ROpp]/d[WeightPrevPrev] * d[Opp]/d[ROpp] can be calculated in a similar way to d[ROp]/d[WeightPrev] * d[Op]/d[ROp]

- This leaves, d[NC]/d[WeightPrevPrev] = [PreviousPreviousPreviousOutput] * (1 - Sigmoid(ROpp))Sigmoid(ROpp) * [WeightPrev] * (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])



So finally, if we compare all three layers (going from last to first):
- Output layer derivative:            d[NC]/d[Weight]     = [PreviousOutput] *                                                                                                               (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
- First hidden layer derivative:      d[NC]/d[WeightPrev] = [PreviousPreviousOutput] *                                                           (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
- Second hidden layer derivative: d[NC]/d[WeightPrevPrev] = [PreviousPreviousPreviousOutput] * (1 - Sigmoid(ROpp))Sigmoid(ROpp) * [WeightPrev] * (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])



I think I'm doing something wrong, since it is ambiguous which weight I should be using for the [Weight...] variables
- I have watched a few tutorials, and I believe that when you multiply: [Weight...] * [NodeValue], you add up the sum of all the [weights coming out of neuron] * [node value of the neurons]
- This would give it a higher nodeValue, which makes sense because it affects the output much more than a neuron in a later layer



It is a similar thing for the bias:
- d[NC]/d[Bias] = d[RO]/d[Bias] * d[O]/d[RO] * d[NC]/d[O]
- d[NC]/d[Bias] = 1 * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
*/
/*
const ActivationDerivative = (num: number) => {
    //return (1 - Sigmoid(num)) * Sigmoid(num);
    return 1 - Math.tanh(num)**2;
}
const Learn = (network: Layer[], stepSize: number, dataset: DataPoint[]) => {
    //Initialise gradient storage
    const weightDescentGradients: { [weightID: string]: number } = {};
    const biasDescentGradients: { [biasID: string]: number } = {};
    for (const weightKey in WEIGHTS) {
        weightDescentGradients[weightKey] = 0;
    }
    for (const biasKey in BIASES) {
        biasDescentGradients[biasKey] = 0;
    }

    const data = dataset[0];
    //for (const data of dataset) {
    RunNetwork(network, [data.x, data.y]); //forward propogate the data through the network

    console.log(network);

    const nodeValues: { [neuronID: string] : number } = {};
    //Output layer derivative: d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
    const outputLayer = network[network.length - 1];
    const previousLayer = network[network.length - 2];

    for (const neuron of outputLayer.neurons) {
        //Go through each weight in the last layer, calculate derivative of d[NC]/d[Weight], then just modify weight using gradient descent
        const activationDerivative = ActivationDerivative(neuron.rawValue);
        const ExpectedOutput = Number(data.result);
        const DerivativeCostWRTOutput = -2 * (ExpectedOutput - neuron.value);

        const nodeValue = activationDerivative * DerivativeCostWRTOutput; //set the node value for the specific neuron
        nodeValues[neuron.id] = nodeValue;

        UpdateWeightsBiases(nodeValue, neuron, outputLayer, previousLayer, weightDescentGradients, biasDescentGradients, stepSize);
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
            
            const activationDerivative = ActivationDerivative(neuron.rawValue);
            const nodeValue = activationDerivative * sum;
            nodeValues[neuron.id] = nodeValue;

            UpdateWeightsBiases(nodeValue, neuron, layer, previousLayer, weightDescentGradients, biasDescentGradients, stepSize);
        }
        
    }

    ApplyGradients(weightDescentGradients, biasDescentGradients);
}

const UpdateWeightsBiases = (nodeValue: number, currentNeuron: Neuron, currentlayer: Layer, previousLayer: Layer, weightDescentGradients: {[weightID: string] : number}, biasDescentGradients: {[biasID: string] : number}, stepSize: number) => {
    for (const prevNeuron of previousLayer.neurons) {
        const weightKey = JSON.stringify([previousLayer.id, currentlayer.id, prevNeuron.id, currentNeuron.id])
        const PreviousOutput = prevNeuron.value;

        const weightGradient = PreviousOutput * nodeValue;
        weightDescentGradients[weightKey] = weightGradient * stepSize;
    }

    //d[NC]/d[Bias] = 1 * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
    const biasGradient = 1 * nodeValue;
    const biasKey = JSON.stringify([currentNeuron.id]);
    biasDescentGradients[biasKey] = biasGradient * stepSize;
}

const ApplyGradients = (weightDescentGradients: {[weightID: string] : number}, biasDescentGradients: {[biasID: string] : number}) => {
    //Apply weights and biases for current layer
    for (const weightKey in weightDescentGradients) {
        WEIGHTS[weightKey] = weightDescentGradients[weightKey];
    }
    for (const biasKey in biasDescentGradients) {
        BIASES[biasKey] = biasDescentGradients[biasKey];
    }
}
*/
const CostDerivative = (actualOutput, expectedOutput) => {
    return expectedOutput - actualOutput;
};
const ActivationDerivative = (num) => {
    return (1 - Sigmoid(num)) * Sigmoid(num);
    //return 1 - Math.tanh(num)**2;
};
const Learn = (network, stepSize, dataset) => {
    const costGradientWRTW = {};
    const costGradientWRTB = {};
    for (const key in WEIGHTS) {
        costGradientWRTW[key] = 0;
    }
    for (const key in BIASES) {
        costGradientWRTB[key] = 0;
    }
    for (const data of dataset) {
        const expectedOutput = Number(data.result);
        RunNetwork(network, [data.x, data.y]); //forward propogate the data through the network
        const nodeValues = {};
        //Calculate output layer node values
        const outputLayer = network[network.length - 1];
        for (const neuron of outputLayer.neurons) {
            const costDerivative = CostDerivative(neuron.value, expectedOutput);
            const activationDerivative = ActivationDerivative(neuron.rawValue);
            nodeValues[neuron.id] = costDerivative * activationDerivative;
        }
        //Update gradients for output layer
        const previousLayer = network[network.length - 2];
        UpdateGradients(nodeValues, previousLayer, outputLayer, costGradientWRTW, costGradientWRTB);
        //Update hidden layers
        for (let i = network.length - 2; i != 0; i -= 1) {
            const hiddenLayer = network[i];
            const nextLayer = network[i + 1];
            //Calculate hidden layer node values
            for (const neuron of hiddenLayer.neurons) {
                let newNodeValue = 0;
                //loop through node values of layer in front of this layer
                for (const nextNeuron of nextLayer.neurons) {
                    const oldNodeValue = nodeValues[nextNeuron.id];
                    //get weight between neuron and nextNeuron
                    const weightedInputDerivative = WEIGHTS[JSON.stringify([hiddenLayer.id, nextLayer.id, neuron.id, nextNeuron.id])];
                    newNodeValue += weightedInputDerivative * oldNodeValue;
                }
                newNodeValue *= ActivationDerivative(neuron.rawValue);
                nodeValues[neuron.id] = newNodeValue;
            }
            //Update gradients for hidden layer
            const previousHiddenLayer = network[i - 1];
            UpdateGradients(nodeValues, previousHiddenLayer, hiddenLayer, costGradientWRTW, costGradientWRTB);
        }
    }
    //Apply all gradients to WEIGHTS and BIASES
    ApplyGradients(stepSize, costGradientWRTW, costGradientWRTB);
};
const UpdateGradients = (nodeValues, previousLayer, layer, costGradientWRTW, costGradientWRTB) => {
    for (const neuron of layer.neurons) {
        const nodeValue = nodeValues[neuron.id];
        for (const prevNeuron of previousLayer.neurons) {
            const derivativeCostWRTWeight = prevNeuron.value * nodeValue;
            //update costGradientW
            const weightKey = JSON.stringify([previousLayer.id, layer.id, prevNeuron.id, neuron.id]);
            costGradientWRTW[weightKey] += derivativeCostWRTWeight;
        }
    }
    for (const neuron of layer.neurons) {
        const nodeValue = nodeValues[neuron.id];
        const derivativeCostWRTBias = 1 * nodeValue;
        //update costGradientB
        const biasKey = JSON.stringify([neuron.id]);
        costGradientWRTB[biasKey] += derivativeCostWRTBias;
    }
};
const ApplyGradients = (learnRate, costGradientWRTW, costGradientWRTB) => {
    for (const key in WEIGHTS) {
        const gradient = costGradientWRTW[key];
        if (gradient == 0) { } //do nothing, since the weight is already at the minimum
        else if (gradient > 0) {
            WEIGHTS[key] -= learnRate;
        }
        else {
            WEIGHTS[key] += learnRate;
        }
        costGradientWRTW[key] = 0;
    }
    for (const key in BIASES) {
        const gradient = costGradientWRTB[key];
        if (gradient == 0) { }
        else if (gradient > 0) {
            BIASES[key] -= learnRate;
        }
        else {
            BIASES[key] += learnRate;
        }
        costGradientWRTB[key] = 0;
    }
};
