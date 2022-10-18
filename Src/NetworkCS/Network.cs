using System;
using System.Collections.Generic;

namespace NetworkCS {

    class Neuron {
        public int rawValue;
        public int value;

        public Neuron() {
            this.rawValue = 0;
            this.value = 0;
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

        public Network(List<int> config) {
            //create new network using config
            this.layers = new List<Layer>{};
            foreach (var neuronCount in config) {
                this.layers.Add(new Layer(neuronCount));
            }
        }
    }
}