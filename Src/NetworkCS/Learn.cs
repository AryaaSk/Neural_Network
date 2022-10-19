using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace NetworkCS {

    class DataPoint {
        public List<double> inputs;
        public List<double> expectedOutputs;

        public DataPoint(List<double> inputs, List<double> expectedOutputs) {
            this.inputs = inputs;
            this.expectedOutputs = expectedOutputs;
        }
    }

    partial class Network {

        public double stepSize = 1;
        public int miniBatchSize = 30;

        public double CalculateCost(List<DataPoint> dataset) {
            double totalCost = 0;
            foreach (var data in dataset) {

                this.ForwardPropogate(data.inputs);
                var outputLayer = this.layers[this.layers.Count - 1];

                double totalLayerCost = 0;
                for (var i = 0; i != outputLayer.neurons.Count; i += 1) {
                    double expectedOutput = data.expectedOutputs[i];
                    double neuronCost = Neuron.NeuronCost(expectedOutput, outputLayer.neurons[i].value);
                    totalLayerCost += neuronCost;
                }

                totalCost += totalLayerCost;
            }

            double averageCost = totalCost / dataset.Count;
            return averageCost;
        }

        //First section calculates node values for entire layer, then calculates weight and bias gradients for layer in next step
        //Second section is how it works on JS version, calculates node value for a single neuron, then calculates weights and bias gradients for that single neuron
        //Second section works, but first section has some kind of bug which stops it from working properly

        /*
        public void Learn(List<DataPoint> dataset) {
            //first need to find gradients of weights/biases across all datapoints in the dataset
            var weightGradients = new Dictionary<string, double>{};
            var biasGradients = new Dictionary<string, double>{}; //keys are same format as network.weights and network.biases
            foreach (var entry in this.weights) {
                weightGradients[entry.Key] = 0;
            }
            foreach (var entry in this.biases) {
                biasGradients[entry.Key] = 0;
            }

            foreach (var data in dataset) {
                this.ForwardPropogate(data.inputs);
                var nodeValues = new Dictionary<string, double>{}; //key = neuron.id

                //d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
                //Node value is just the partial derivatives of activation * cost, since those do not require any other neurons to be calculated

                var outputLayer = this.layers[this.layers.Count - 1];
                for (var i = 0; i != outputLayer.neurons.Count; i += 1) {
                    var neuron = outputLayer.neurons[i];
                    double expectedOutput = data.expectedOutputs[i];
                    double costDerivative = Neuron.NeuronCostDerivative(expectedOutput, neuron.value);
                    double activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);

                    double nodeValue = activationDerivative * costDerivative;
                    nodeValues[neuron.id] = nodeValue;
                }

                //Use node value to calculate gradients of weights between output and previous layer, and biases in output layer
                CalculateGradients(outputLayer, this.layers[this.layers.Count - 2], nodeValues, ref weightGradients, ref biasGradients);

                //Backpropogate throughout all layers
                for (var i = this.layers.Count - 2; i != 0; i -= 1) {
                    var layer = this.layers[i];
                    var nextLayer = this.layers[i + 1]; //need nextLayer's node values to calculate current layer's node values

                    foreach (var neuron in layer.neurons) {
                        //d[NC]/d[WeightPrev] = [PreviousPreviousOutput] * (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
                        double sum = 0;
                        foreach (var nextNeuron in nextLayer.neurons) {
                            double nextNeuronNodeValue = nodeValues[nextNeuron.id];
                            string weightKey = neuron.id + nextNeuron.id;
                            double weight = this.weights[weightKey];
                            sum += (weight * nextNeuronNodeValue);
                        }

                        double activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);
                        double nodeValue = activationDerivative * sum;
                        nodeValues[neuron.id] = nodeValue;
                    }

                    //Update weight and bias gradients with these new node values
                    var previousLayer = this.layers[i - 1];
                    CalculateGradients(layer, previousLayer, nodeValues, ref weightGradients, ref biasGradients);
                }

                //We now have all the weight gradients and biases, we just need to apply them
                ApplyGradients(weightGradients, biasGradients);
            }
        }
        private void CalculateGradients(Layer layer, Layer previousLayer, Dictionary<string, double> nodeValues, ref Dictionary<string, double> weightGradients, ref Dictionary<string, double> biasGradients) {
            //Calculates the actual gradients of the corresponding weights between the 2 layers, by multiplying previousOutput by the nodeValue of the next neuron
            foreach (var neuron in layer.neurons) {
                double nodeValue = nodeValues[neuron.id];

                foreach (var previousNeuron in previousLayer.neurons) {
                    double previousOutput = previousNeuron.value;
                    double weightGradient = previousOutput * nodeValue;

                    string weightKey = previousNeuron.id + neuron.id;
                    weightGradients[weightKey] += weightGradient;
                }

                //d[NC]/d[Bias] = 1 * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
                double biasGradient = 1 * nodeValue;
                string biasKey = neuron.id;
                biasGradients[biasKey] += biasGradient;
            }
        }

        private void ApplyGradients(Dictionary<string, double> weightGradients, Dictionary<string, double> biasGradients) {
            foreach (var entry in this.weights) {
                double gradient = weightGradients[entry.Key];

                if (gradient == 0) {} //do nothing, since the weight is already at the minimum
                else if (gradient > 0) {
                    this.weights[entry.Key] += this.stepSize;
                }
                else {
                    this.weights[entry.Key] -= this.stepSize;
                }            

                //this.weights[entry.Key] += (gradient * this.stepSize); //By increasing the weights proportional to the gradient it seemed to fix the constant cost issue
                weightGradients[entry.Key] = 0;
            }

            foreach (var entry in this.biases) {
                double gradient = biasGradients[entry.Key];
                
                if (gradient == 0) {} //do nothing, since the weight is already at the minimum
                else if (gradient > 0) {
                    this.biases[entry.Key] += this.stepSize;
                }
                else {
                    this.biases[entry.Key] -= this.stepSize;
                } 

                biasGradients[entry.Key] = 0;
            }
        }
        */

        public void Learn(List<DataPoint> dataset) {
            var weightGradients = new Dictionary<string, double>{};
            var biasGradients = new Dictionary<string, double>{}; //keys are same format as network.weights and network.biases
            foreach (var entry in this.weights) {
                weightGradients[entry.Key] = 0;
            }
            foreach (var entry in this.biases) {
                biasGradients[entry.Key] = 0;
            }

            foreach (var data in dataset) {
                this.ForwardPropogate(data.inputs);

                var nodeValues = new Dictionary<string, double>{};

                var outputLayer = this.layers[this.layers.Count - 1];
                var previousLayer = this.layers[this.layers.Count - 2];
                for (var i = 0; i != outputLayer.neurons.Count; i += 1) {
                    var neuron = outputLayer.neurons[i];

                    var activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);
                    var expectedOutput = data.expectedOutputs[i];
                    var costDerivative = Neuron.NeuronCostDerivative(expectedOutput, neuron.value);

                    var nodeValue = activationDerivative * costDerivative;
                    nodeValues[neuron.id] = nodeValue;

                    this.CalculateWeightBiases(nodeValue, neuron, previousLayer, ref weightGradients, ref biasGradients);
                }

                for (var i = this.layers.Count - 2; i != 0; i -= 1) {
                    var nextHiddenLayer = this.layers[i + 1];
                    var layer = this.layers[i];
                    var previousHiddenLayer = this.layers[i - 1];

                    foreach (var neuron in layer.neurons) {
                        double sum = 0;
                        foreach (var nextNeuron in nextHiddenLayer.neurons) {
                            string weightKey = neuron.id + nextNeuron.id;
                            var weightBetweenNeurons = this.weights[weightKey];
                            double nextNeuronNodeValue = nodeValues[nextNeuron.id];
                            sum += (weightBetweenNeurons * nextNeuronNodeValue);
                        }

                        double activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);
                        double nodeValue = activationDerivative * sum;
                        nodeValues[neuron.id] = nodeValue;

                        this.CalculateWeightBiases(nodeValue, neuron, previousHiddenLayer, ref weightGradients, ref biasGradients);
                    }
                }
            }

            this.ApplyGradients(weightGradients, biasGradients);
        }
        private void CalculateWeightBiases(double nodeValue, Neuron currentNeuron, Layer previousLayer, ref Dictionary<string, double> weightGradients, ref Dictionary<string, double> biasGradients) {
            foreach (var previousNeuron in previousLayer.neurons) {
                double previousOutput = previousNeuron.value;
                double weightGradient = previousOutput * nodeValue;

                string weightKey = previousNeuron.id + currentNeuron.id;
                weightGradients[weightKey] += weightGradient;
            }

            double biasGradient = 1 * nodeValue;
            string biasKey = currentNeuron.id;
            biasGradients[biasKey] += biasGradient;
        }
        private void ApplyGradients(Dictionary<string, double> weightGradients, Dictionary<string, double> biasGradients) {
            foreach (var entry in this.weights) {
                double gradient = weightGradients[entry.Key];

                if (gradient == 0) {} //do nothing, since the weight is already at the minimum
                else if (gradient > 0) {
                    this.weights[entry.Key] += this.stepSize;
                }
                else {
                    this.weights[entry.Key] -= this.stepSize;
                }            

                //this.weights[entry.Key] += (gradient * this.stepSize); //By increasing the weights proportional to the gradient it seemed to fix the constant cost issue
                weightGradients[entry.Key] = 0;
            }

            foreach (var entry in this.biases) {
                double gradient = biasGradients[entry.Key];
                
                if (gradient == 0) {} //do nothing, since the weight is already at the minimum
                else if (gradient > 0) {
                    this.biases[entry.Key] += this.stepSize;
                }
                else {
                    this.biases[entry.Key] -= this.stepSize;
                } 

                biasGradients[entry.Key] = 0;
            }
        }

        public void Train(List<DataPoint> dataset, int epochCycles) {
            int i = 0;
            while (i != epochCycles) {
                var chunks = this.CreateChunks(dataset);

                foreach (var chunk in chunks) {
                    this.Learn(chunk);
                }

                Console.WriteLine(this.CalculateCost(dataset));

                i += 1;
            }
        }
        private List<List<DataPoint>> CreateChunks(List<DataPoint> dataset) {
            var duplicateList = new List<DataPoint>(dataset);
            duplicateList.Shuffle();
            return duplicateList.ChunkBy(this.miniBatchSize);
        }

    }
}

public static class ListExtensions
{
    //https://stackoverflow.com/questions/11463734/split-a-list-into-smaller-lists-of-n-size
    public static List<List<T>> ChunkBy<T>(this List<T> source, int chunkSize) 
    {
        return source
            .Select((x, i) => new { Index = i, Value = x })
            .GroupBy(x => x.Index / chunkSize)
            .Select(x => x.Select(v => v.Value).ToList())
            .ToList();
    }

    //https://stackoverflow.com/questions/273313/randomize-a-listt
    private static Random rng = new Random();
    public static void Shuffle<T>(this IList<T> list)  
    {  
        int n = list.Count;  
        while (n > 1) {  
            n--;  
            int k = rng.Next(n + 1);  
            T value = list[k];  
            list[k] = list[n];  
            list[n] = value;  
        }  
    }
}