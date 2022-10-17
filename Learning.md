# A text log keeping track of my progress trying to understand the backpropogation algorithm
*These notes were originally comments of [learn.ts](Src/Network/learn.ts), so they are not designed to be a full explanation, but rather to just help understand the main concept*

## Notes:

//Calculus:
RawOutput [RO] = [PreviousOutput][Weight] + [Bias]\
Output [O] = Sigmoid([RO])\
NeuronCost [NC] = ([ExpectedOutput] - [O])2\

d[NC]/d[Weight] = d[RO]/d[Weight] * d[O]/d[RO] * d[NC]/d[O]
- d[RO]/d[Weight] = [PreviousOutput]
- d[O]/d[RO] = (1 - Sigmoid(RO)) * Sigmoid(RO)
- d[NC]/d[O] = 2([ExpectedOutput] - [O])
- Therefore: d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])

AverageCost = TotalNeuronCost / NumOfNeurons
- By reducing each neuron's cost we will also reduce the overall cost



Confusion:
- The above only works for neurons in the last/output layer, we also want to adjust neurons in all the other layers
- We cannot determine [ExpectedOutput] for neurons in hidden layers, so we must keep the derivative as d[NC]/d[AnyWeight], so it is always adjusting weights to improve the overall cost



Second Layer:

RawOutputPrev [ROp] = [PreviousPreviousOutput][WeightPrev] + [BiasPrev]\
OutputPrev [Op] = Sigmoid([ROp])\
RawOutput [RO] = [PreviousOutput which is also [Op]][Weight] + [Bias]\
Output [O] = Sigmoid([RO])\
NeuronCost [NC] = ([ExpectedOutput] - [O])2\

d[NC]/d[WeightPrev] = d[ROp]/d[WeightPrev] * d[Op]/d[ROp] * d[RO]/d[Op] * ([d[O]/d[RO] * d[NC]/d[O]])
- d[ROp]/d[WeightPrev] = [PreviousPreviousOutput]
- d[Op]/d[ROp] = (1 - Sigmoid(ROp)) * Sigmoid(ROp)
- d[RO]/d[Op] = [Weight]
- We already have ([d[O]/d[RO] * d[NC]/d[O]]) from calculating the derivative for the output layer weights
- Therefore d[NC]/d[WeightPrev] = [PreviousPreviousOutput] * (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])



More Confusion:
- I am a bit confused why the derivative of d[NC]/d[WeightPrev] or even d[NC]/d[Weight] do not contain the original weight variable which they are in respect to
- This would suggest that the gradient will be constant throughout without adjusting the weight
- Below is a diagram labelling the different components of the neural network

```
    2|---(3/4)---|5
(1)--|           |--(6/7)
           ()
()                  ()
           ()
```

1 = PreviousPreviousOutput\
2 = WeightPrev\
3 = RawOutputPrev [ROp]\
4 = OutputPrev [Op]\
5 = Weight\
6 = RawOutput [RO]\
7 = Output [O]\



I will do one more for the 3rd last layer of weights, to try and see a pattern:

RawOutputPrevPrev [ROpp] = [PreviousPreviousPreviousOutput][WeightPrevPrev] + [BiasPrevPrev]\
OutputPrevPrev [Opp] = Sigmoid([ROpp])\
RawOutputPrev [ROp] = [Opp][WeightPrev] + [BiasPrev]\
OutputPrev [Op] = Sigmoid([ROp])\
RawOutput [RO] = [PreviousOutput which is also [Op]][Weight] + [Bias]\
Output [O] = Sigmoid([RO])\
NeuronCost [NC] = ([ExpectedOutput] - [O])2\

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



Finally we can just use gradient descent with these gradients we have calculated, to either add or subtract to the weight/biases proportional to the step size.