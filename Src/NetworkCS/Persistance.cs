using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace NetworkCS {
    class Persistance {

        private Random rand = new Random();
        private double WeightFunction() {
            var randomNumber = rand.NextDouble();
            randomNumber *= 2;
            randomNumber -= 1;
            return randomNumber; //between -1 and 1
        }

        public void InitaliseWeights(ref Network network) {
            var weightList = new List<double>{};

            //Find weight data from file
            try {
                string json = File.ReadAllText("NetworkData/weightData.txt");
                weightList = JsonSerializer.Deserialize<List<double>>(json);
            }
            catch {
                //file doesn't exist, create random weights, then save file
                for (var _ = 0; _ != network.weights.Count; _ += 1) {
                    var randomWeight = this.WeightFunction();
                    weightList.Add(randomWeight);
                }

                var json = JsonSerializer.Serialize(weightList);
                Directory.CreateDirectory("NetworkData");
                File.WriteAllText("NetworkData/weightData.txt", json);
            }

            //we have a flat list of weights, which we need to apply to all the weights in the network
            //it is important that we do this process in the same order as is used in the saving weights function, otherwise the weights will not be restored to their correct locations
            int counter = 0;
            for (var i = 0; i != network.layers.Count - 1; i += 1) {
                var layer = network.layers[i];
                var nextLayer = network.layers[i + 1];
                foreach (var neuron in layer.neurons) {
                    foreach (var nextNeuron in nextLayer.neurons) {
                        string weightKey = neuron.id + nextNeuron.id;
                        network.weights[weightKey] = weightList[counter];
                        counter += 1;
                    }
                }
            }
        }

        public void SaveWeights(ref Network network) {
            var weightList = new List<double>{};

            for (var i = 0; i != network.layers.Count - 1; i += 1) {
                var layer = network.layers[i];
                var nextLayer = network.layers[i + 1];
                foreach (var neuron in layer.neurons) {
                    foreach (var nextNeuron in nextLayer.neurons) {
                        string weightKey = neuron.id + nextNeuron.id;
                        double weight = network.weights[weightKey];
                        weightList.Add(weight);
                    }
                }
            }

            var json = JsonSerializer.Serialize(weightList);
            File.WriteAllText("NetworkData/weightData.txt", json);
        }

        public void InitialiseBiases(ref Network network) {
            var biasList = new List<double>{};

            try {
                string json = File.ReadAllText("NetworkData/biasData.txt");
                biasList = JsonSerializer.Deserialize<List<double>>(json);
            }
            catch {
                //file doesn't exist, create list of biases = 0
                foreach (var _ in network.biases) {
                    biasList.Add(0);
                }

                var json = JsonSerializer.Serialize(biasList);
                Directory.CreateDirectory("NetworkData");
                File.WriteAllText("NetworkData/biasData.txt", json);
            }

            int counter = 0;
            foreach (var layer in network.layers) {
                foreach (var neuron in layer.neurons) {
                    string biasKey = neuron.id;
                    network.biases[biasKey] = biasList[counter];
                    counter += 1;
                }
            }
        }

        public void SaveBiases(ref Network network) {
            var biasList = new List<double>{};

            foreach (var layer in network.layers) {
                foreach (var neuron in layer.neurons) {
                    string biasKey = neuron.id;
                    double bias = network.biases[biasKey];
                    biasList.Add(bias);
                }
            }

            var json = JsonSerializer.Serialize(biasList);
            File.WriteAllText("NetworkData/biasData.txt", json);
        }

        public Persistance() {
        }
    }
}