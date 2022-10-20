using System;
using System.Collections.Generic;

namespace NetworkCS {

    class Neuron {
        public string id;
        public double rawValue;
        public double value;

        public Neuron() {
            this.rawValue = 0;
            this.value = 0;
            this.id = Guid.NewGuid().ToString();
        }

        public static double NeuronCost(double expectedOutput, double actualOutput) {
            return Math.Pow(expectedOutput - actualOutput, 2);
        }
        public static double NeuronCostDerivative(double expectedOutput, double actualOutput) {
            return 2 * (expectedOutput - actualOutput);
        }

        public static double Activation(double num) {
            return 1.0f / (1.0f + (float) Math.Exp(-num));
        }
        public static double ActivationDerivative(double num) {
            return (1 - Neuron.Activation(num)) * Neuron.Activation(num);
        }
    }

    class Layer {
        public List<Neuron> neurons;

        public Layer(int neuronCount) {
            this.neurons = new List<Neuron>{};
            for (int _ = 0; _ != neuronCount; _ += 1) {
                this.neurons.Add(new Neuron());
            }
        }
    }

    partial class Network {
        private List<int> config;
        public List<Layer> layers;
        public Dictionary<string, double> weights; //key: neuron1Id + neuron2Id
        public Dictionary<string, double> biases; //key: neuronId

        public Network(List<int> config) {
            this.config = config;

            //create new network using config
            this.layers = new List<Layer>{};
            foreach (var neuronCount in config) {
                this.layers.Add(new Layer(neuronCount));
            }

            this.weights = new Dictionary<string, double>{};
            for (var i = 0; i != this.layers.Count - 1; i += 1) {
                var layer = this.layers[i];
                var nextLayer = this.layers[i + 1];

                foreach (var neuron in layer.neurons) {
                    foreach (var nextNeuron in nextLayer.neurons) {
                        string weightKey = neuron.id + nextNeuron.id;
                        this.weights[weightKey] = 0; //Initalise all weights as 0, will be restored later by persistance object
                    }
                }
            }

            this.biases = new Dictionary<string, double>{};
            foreach (var layer in this.layers) {
                foreach (var neuron in layer.neurons) {
                    string biasKey = neuron.id;
                    this.biases[biasKey] = 0;
                }
            }
        }



        public void ForwardPropogate(List<double> inputs) {
            var inputLayer = this.layers[0];

            for (var i = 0; i != inputLayer.neurons.Count; i += 1) {
                inputLayer.neurons[i].rawValue = inputs[i];
                //inputLayer.neurons[i].value = Neuron.Activation(inputLayer.neurons[i].rawValue);
                inputLayer.neurons[i].value = inputLayer.neurons[i].rawValue;
            }

            for (var i = 1; i != this.layers.Count; i += 1) {
                var previousLayer = this.layers[i - 1];
                var layer = this.layers[i];

                foreach (var neuron in layer.neurons) {
                    double rawValue = 0;
                    foreach (var previousNeuron in previousLayer.neurons) {
                        string weightKey = previousNeuron.id + neuron.id;
                        double weight = this.weights[weightKey];
                        double previousValue = previousNeuron.value;
                        rawValue += (previousValue * weight);
                    }

                    string biasKey = neuron.id;
                    double bias = this.biases[biasKey];
                    rawValue += bias;

                    neuron.rawValue = rawValue;
                    neuron.value = Neuron.Activation(rawValue);
                }
            }
        }
    }
}