public double[] CalculateOutputs(double[] inputs, LayerLearnData learnData)
{
    learnData.inputs = inputs;

    for (int nodeOut = 0; nodeOut < numNodesOut; nodeOut++)
    {
        double weightedInput = biases[nodeOut];
        for (int nodeIn = 0; nodeIn < numNodesIn; nodeIn++)
        {
            weightedInput += inputs[nodeIn] * GetWeight(nodeIn, nodeOut);
        }
        learnData.weightedInputs[nodeOut] = weightedInput;
    }

    // Apply activation function
    for (int i = 0; i < learnData.activations.Length; i++)
    {
        learnData.activations[i] = activation.Activate(learnData.weightedInputs, i);
    }

    return learnData.activations;
}

//inputs = 'a' of previous layer
//weightedInputs = 'z'
//activations = 'a'


void UpdateGradients(DataPoint data, NetworkLearnData learnData)
{
    // Feed data through the network to calculate outputs.
    // Save all inputs/weightedinputs/activations along the way to use for backpropagation.
    double[] inputsToNextLayer = data.inputs;

    for (int i = 0; i < layers.Length; i++)
    {
        inputsToNextLayer = layers[i].CalculateOutputs(inputsToNextLayer, learnData.layerData[i]);
    }

    // -- Backpropagation --
    int outputLayerIndex = layers.Length - 1;
    Layer outputLayer = layers[outputLayerIndex];
    LayerLearnData outputLearnData = learnData.layerData[outputLayerIndex];

    // Update output layer gradients
    outputLayer.CalculateOutputLayerNodeValues(outputLearnData, data.expectedOutputs, cost);
    outputLayer.UpdateGradients(outputLearnData);

    // Update all hidden layer gradients
    for (int i = outputLayerIndex - 1; i >= 0; i--)
    {
        LayerLearnData layerLearnData = learnData.layerData[i];
        Layer hiddenLayer = layers[i];

        hiddenLayer.CalculateHiddenLayerNodeValues(layerLearnData, layers[i + 1], learnData.layerData[i + 1].nodeValues);
        hiddenLayer.UpdateGradients(layerLearnData);
    }
}



public void CalculateOutputLayerNodeValues(LayerLearnData layerLearnData, double[] expectedOutputs, ICost cost)
{
    for (int i = 0; i < layerLearnData.nodeValues.Length; i++)
    {
        // Evaluate partial derivatives for current node: cost/activation & activation/weightedInput
        double costDerivative = cost.CostDerivative(layerLearnData.activations[i], expectedOutputs[i]);
        double activationDerivative = activation.Derivative(layerLearnData.weightedInputs, i);
        layerLearnData.nodeValues[i] = costDerivative * activationDerivative;
    }
}



public void CalculateHiddenLayerNodeValues(LayerLearnData layerLearnData, Layer oldLayer, double[] oldNodeValues)
{
    for (int newNodeIndex = 0; newNodeIndex < numNodesOut; newNodeIndex++)
    {
        double newNodeValue = 0;
        for (int oldNodeIndex = 0; oldNodeIndex < oldNodeValues.Length; oldNodeIndex++)
        {
            // Partial derivative of the weighted input with respect to the input
            double weightedInputDerivative = oldLayer.GetWeight(newNodeIndex, oldNodeIndex);
            newNodeValue += weightedInputDerivative * oldNodeValues[oldNodeIndex];
        }
        newNodeValue *= activation.Derivative(layerLearnData.weightedInputs, newNodeIndex);
        layerLearnData.nodeValues[newNodeIndex] = newNodeValue;
    }
}



public void UpdateGradients(LayerLearnData layerLearnData)
	{
		// Update cost gradient with respect to weights (lock for multithreading)
		lock (costGradientW)
		{
			for (int nodeOut = 0; nodeOut < numNodesOut; nodeOut++)
			{
				double nodeValue = layerLearnData.nodeValues[nodeOut];
				for (int nodeIn = 0; nodeIn < numNodesIn; nodeIn++)
				{
					// Evaluate the partial derivative: cost / weight of current connection
					double derivativeCostWrtWeight = layerLearnData.inputs[nodeIn] * nodeValue;
					// The costGradientW array stores these partial derivatives for each weight.
					// Note: the derivative is being added to the array here because ultimately we want
					// to calculate the average gradient across all the data in the training batch
					costGradientW[GetFlatWeightIndex(nodeIn, nodeOut)] += derivativeCostWrtWeight;
				}
			}
		}

		// Update cost gradient with respect to biases (lock for multithreading)
		lock (costGradientB)
		{
			for (int nodeOut = 0; nodeOut < numNodesOut; nodeOut++)
			{
				// Evaluate partial derivative: cost / bias
				double derivativeCostWrtBias = 1 * layerLearnData.nodeValues[nodeOut];
				costGradientB[nodeOut] += derivativeCostWrtBias;
			}
		}
	}