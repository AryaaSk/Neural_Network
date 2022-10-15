//https://dev.to/liashchynskyi/creating-of-neural-network-using-javascript-in-7minutes-o21
//This doesn't work either...

const Learn = (network: Layer[], stepSize: number, dataset: DataPoint[]) => {
    for (const data of dataset) {
        RunNetwork(network, [data.x, data.y]);
        const targetOutput = Number(data.result);

        const deltaErrorValues: {[neuronID: string] : number} = {};

        const outputLayer = network[network.length - 1];
        for (const neuron of outputLayer.neurons) {
            const error = targetOutput - neuron.value;
            const deltaError = Neuron.ActivationDerivative(neuron.value) * error;
            deltaErrorValues[neuron.id] = deltaError;
        }

        //calculate errors and delta errors for hidden layer neurons
        for (let i = network.length - 2; i != 0; i -= 1) {
            const hiddenLayer = network[i];

            const nextLayer = network[i + 1];
            for (const neuron of hiddenLayer.neurons) {
                let error = 0;
                for (const nextNeuron of nextLayer.neurons) {
                    const synapse = WEIGHTS[JSON.stringify([hiddenLayer.id, nextLayer.id, neuron.id, nextNeuron.id])];
                    const deltaError = deltaErrorValues[nextNeuron.id];
                    error += synapse * deltaError;
                }

                const deltaError = Neuron.ActivationDerivative(neuron.value) * error;
                deltaErrorValues[neuron.id] = deltaError;
            }

            //we have the deltaError values for the current layer and the next layer, so we update the weights next
            for (const neuron of hiddenLayer.neurons) {
                for (const nextNeuron of nextLayer.neurons) {
                    WEIGHTS[JSON.stringify([hiddenLayer.id, nextLayer.id, neuron.id, nextNeuron.id])] += neuron.value * deltaErrorValues[nextNeuron.id] * stepSize;
                }
            }
        }
    }
}