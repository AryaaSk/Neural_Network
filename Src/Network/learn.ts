//A single file to hold the DecreaseCost() function, which just has to modify the weights to decrease the overall cost of the network

//https://www.youtube.com/watch?v=hfMk-kjRv4c
//https://medium.com/spidernitt/breaking-down-neural-networks-an-intuitive-approach-to-backpropagation-3b2ff958794c
//https://ai.stackexchange.com/questions/31566/different-ways-to-calculate-backpropagation-derivatives-any-difference

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