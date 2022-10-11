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
- Therefore: d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O]);

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
*/