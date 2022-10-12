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
- I have watched a few tutorials, and I believe that when you have multiply by a [Weight...], you have to add up all weights coming out of that neuron, and use that as the partial derivative of d[RO]/d[Op]
*/





const SigmoidDerivative = (num: number) => {
    return (1 - Sigmoid(num)) * Sigmoid(num);
}
const LearnWeights = (network: Layer[], weights: {[k: string]: number}, stepSize: number, dataset: DataPoint[]) => {
    for (const data of dataset) {
        RunNetwork(network, [data.x, data.y]); //forward propogate the data through the network

        const nodeValues: { [id: string] : number } = {};

        //Output layer derivative: d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
        const previousLayer = network[network.length - 2];
        const outputLayer = network[network.length - 1];
        for (const prevNeuron of previousLayer.neurons) {
            for (const neuron of outputLayer.neurons) {
                const weightKey = JSON.stringify([previousLayer.id, outputLayer.id, prevNeuron.id, neuron.id])
                
                //Go through each weight in the last layer, calculate derivative of d[NC]/d[Weight], then just modify weight using gradient descent
                const PreviousOutput = prevNeuron.value;
                const ActivationDerivative = SigmoidDerivative(neuron.rawValue);
                const ExpectedOutput = Number(data.result);
                const DerivativeCostWRTOutput = 2 * (ExpectedOutput - neuron.value);

                const nodeValue = ActivationDerivative * DerivativeCostWRTOutput; //set the node value for the specific neuron
                nodeValues[neuron.id] = nodeValue;

                //PROBLEM - NODE VALUE WILL BE CONSTANT THROUGHOUT ALL ITERATIONS SINCE THEY ARE NOT AFFECTED BY ANY WEIGHTS OR PREVIOUS NEURONS, WILL HAVE TO MOVE THE NODE VALUE CODE OUTSIDE THE LOOP
            }   
        }
    }
}