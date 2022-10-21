# Rebuiling in C#
### This allows me to access multithreading to speed up the process (still not as fast as using GPU)

## Getting Started
### Installation
To get started with this network, simply download the [Network](/Src/NetworkCS/Network) folder and place it in the rroot of your project.

Then link in your script using:
```c#
using NetworkCS;
```

### Creating a Network
To create a network once you have installed the files, simply:
```c#
var network = new Network(new List<int>{2, 3, 1});
var persistance = new Persistance();
persistance.InitaliseWeights(ref network);
persistance.InitialiseBiases(ref network);
```
*This will check for a network matching the config in local storage, if there isn't one found or it doesn't match the specification then it will create a new one and save it to local storage*

### Training Network
To train the network, you need some data. You must convert the data to its inputs, and outputs, then create an array of these objects. \
Here is an example for XOR gate data:
```c#
var XOR_DATA = new List<DataPoint>{
    new DataPoint(new List<double>{0, 0}, new List<double>{0}),
    new DataPoint(new List<double>{1, 0}, new List<double>{1}),
    new DataPoint(new List<double>{0, 1}, new List<double>{1}),
    new DataPoint(new List<double>{1, 1}, new List<double>{0})
};
```

Then you can simply pass this data into the train() function which train the data over a specified number of epoch cycles:
```c#
network.stepSize = 0.1;
network.miniBatchSize = XOR_DATA.Count;

network.Train(XOR_DATA, 10000); //100 epoch cycles
persistance.SaveWeights(network);
persistance.SaveBiases(network);
```


### Calculating Cost
Calculating the cost of the network is fundamental to how the network works, if you want to see the current cost of the network then just use the CalculateCost() function:
```c#
var cost = network.CalculateCost(POINTS_DATA);
Console.WriteLine(cost);
```

## Demos
You can test out the demos found [here](/Src/NetworkCS/Program.cs), there is a XOR gate demo and 2 points demos (found here: [points JSON files](/Src/NetworkCS/Data)), both of which I managed to train the network on and get a cost value below 0.04;


## Troubleshooting
Sometimes the network's cost can get stuck at a large number, in these cases it is usually due to many reasons such as:
- Saddle points
- Too little training data
- Too small mini batch sizes
- Network is too large, e.g. too many neurons per layer or too many layers, which slows down training dramatically

It can help to completely reset the weights and biases of the network, since they will be reinitialised at random values, so it may put the network in a better position.\
To do so just delete the 'NetworkData' folder.