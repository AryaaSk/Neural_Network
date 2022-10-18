using System;
using System.Collections.Generic;

namespace NetworkCS {

    class Neuron {
        public string id;
        public int rawValue;
        public int value;

        public Neuron() {
            this.rawValue = 0;
            this.value = 0;
            this.id = Guid.NewGuid().ToString();
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

    class Network {
        public List<Layer> layers;
        public Dictionary<string, decimal> weights; //key: neuron1Id + neuron2Id
        public Dictionary<string, decimal> biases; //key: neuronId

        public Network(List<int> config) {
            //create new network using config
            this.layers = new List<Layer>{};
            foreach (var neuronCount in config) {
                this.layers.Add(new Layer(neuronCount));
            }

            this.weights = new Dictionary<string, decimal>{};
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

            this.biases = new Dictionary<string, decimal>{};
            foreach (var layer in this.layers) {
                foreach (var neuron in layer.neurons) {
                    string biasKey = neuron.id;
                    this.biases[biasKey] = 0;
                }
            }
        }
    }
}