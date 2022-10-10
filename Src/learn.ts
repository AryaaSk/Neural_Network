//A single file to hold the DecreaseCost() function, which just has to modify the weights to decrease the overall cost of the network

/*
//Calculus:
RawOutput [RO] = [PreviousOutput][Weight] + [Bias]
Output [O] = ActivationFunction([RO])
NeuronCost [NC] = (Expected output - [O])2

- Find ∂[NC]/∂[Weight]

AverageCost = TotalNeuronCost / NumOfNeurons
- By reducing each neuron's cost we will also reduce the overall cost
*/