# Neural Network
### A project I made to learn about neural networks, how they work, and implementing one myself

# Getting Started
### Installation
To get started with this network, simply download [learn.ts](Src/Network/learn.ts), [network.ts](Src/Network/network.ts), and [persistance.ts](Src/Network/persistance.ts)

Then link in HTML:
```html
<script src="persistance.js"></script>
<script src="learn.js"></script>
<script src="network.js"></script>

<script src="script.js"></script> <!-- Link before initialising your own script>
```

### Creating a Network
To create a network once you have installed the files, simply:
```javascript
const network = RetrieveNeuralNetwork([2, 3, 1]); //2 neurons in input layer, 1 hidden layer (3 neurons), 1 neuron in output layer
```
*This will check for a network matching the config in local storage, if there isn't one found or it doesn't match the specification then it will create a new one and save it to local storage*

### Training Network
To train the network, you need some data. You must convert the data to its inputs, and outputs, then create an array of these objects. \
Here is an example for XOR gate data:
```javascript
const XOR_DATA = [
    { inputs: [0, 0], expectedOutputs: [0] },
    { inputs: [1, 0], expectedOutputs: [1] },
    { inputs: [0, 1], expectedOutputs: [1] },
    { inputs: [1, 1], expectedOutputs: [0] }
];
```

Then you can simply pass this data into the train() function which train the data over a specified number of epoch cycles:
```javascript
const network = network;
const data = XOR_DATA;
const epochCycles = 40;
const stepSize = 0.01; //also known as 'learningRate'
const miniBatchSize = XOR_DATA.length; //if you do not want to split data into mini batches then set this number equal to length of the data array

Train(network, data, epochCycles, stepSize, miniBatchSize);
```

You can also attach an optional callback function which will execute every time there has been 1 epoch cycle:
```javascript
Train(network, data, epochCycles, stepSize, miniBatchSize, () => {
    console.log("Completed 1 Epoch Cycle");
});
```

### Calculating Cost
Calculating the cost of the network is fundamental to how the network works, if you want to see the current cost of the network then just use the CalculateCost() function:
```javascript
console.log("Cost: " + CalculateCost(network, XOR_DATA)); //pass in the network object, as well as the data to test it on
```

### Changing Activation Function
Activation functions introduce non-linearity into the network, to enable it to learn complex patterns.\
To change the activation function which the network will use:
```javascript
const NewActivationFunction = (num) => {
    return Math.tanh(num);
}
const NewActivationFunctionDerivative = (num) => {
    return 1 - (Math.tanh(num)**2);
}

Neuron.ActivationFunction = NewActivationFunction;
Neuron.ActivationDerivative = NewActivationFunctionDerivative; //also need to define the derivative of the function, as it is used in backpropogation to reduce the network's cost
```

# Demos

### Points
I have tested this network on a few datasets, for example I tested it on classifying points into 2 groups, similar to a SVM. You can see the code for this [here](Src/PointsDemo/script.ts)

Here is a gif showing the network learning to classify the points:

![Preview 1](Previews/Dataset1GIF.gif?raw=true)

### XOR Gate
I also tested it on a XOR gate, which was much simpler as well as being much faster to train.

You can run this example using the code [here](Src/XORDemo/script.ts)