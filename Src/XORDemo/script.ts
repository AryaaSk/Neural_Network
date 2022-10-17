const XORDATA: DataPoint[] = [
    { inputs: [0, 0], expectedOutputs: [0] },
    { inputs: [1, 0], expectedOutputs: [1] },
    { inputs: [0, 1], expectedOutputs: [1] },
    { inputs: [1, 1], expectedOutputs: [0] }
]

const network = RetrieveNeuralNetwork([2, 3, 1]);
console.log("Cost: " + CalculateCost(network, XORDATA));

const interval = setInterval(() => {
    Train(network, XORDATA, 40, 0.01, 4, () => {
        console.log("Cost: " + CalculateCost(network, XORDATA));
    });
}, 1000);
clearInterval(interval);

console.log("[0, 0]: " + RunNetwork(network, [0, 0]).neurons[0].value);
console.log("[1, 0]: " + RunNetwork(network, [1, 0]).neurons[0].value);
console.log("[0, 1]: " + RunNetwork(network, [0, 1]).neurons[0].value);
console.log("[1, 1]: " + RunNetwork(network, [1, 1]).neurons[0].value);