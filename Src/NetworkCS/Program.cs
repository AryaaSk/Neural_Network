using System;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace NetworkCS
{
    class Program
    {
        static void Main(string[] args)
        {
            //XORDemo();
            PointsDemo();
        }

        static void XORDemo() {
            var network = new Network(new List<int>{2, 3, 1});

            var persistance = new Persistance();
            persistance.InitaliseWeights(ref network);
            persistance.InitialiseBiases(ref network);

            var XOR_DATA = new List<DataPoint>{
                new DataPoint(new List<double>{0, 0}, new List<double>{0}),
                new DataPoint(new List<double>{1, 0}, new List<double>{1}),
                new DataPoint(new List<double>{0, 1}, new List<double>{1}),
                new DataPoint(new List<double>{1, 1}, new List<double>{0})
            };

            network.stepSize = 0.1;
            network.miniBatchSize = XOR_DATA.Count;

            //network.Train(XOR_DATA, 10000, persistance);
            //Console.WriteLine(network.CalculateCost(XOR_DATA));

            network.ForwardPropogate(new List<double>{1, 0});
            var output = network.layers[network.layers.Count - 1].neurons[0].value;
            Console.WriteLine(output);
        }

        static void PointsDemo() {
            var network = new Network(new List<int>{2, 20, 2}); //seems to be able to achieve lower cost values by increasing number of neuron in the singular hidden layer, rather than adding more hidden layeres

            var persistance = new Persistance();
            persistance.InitaliseWeights(ref network);
            persistance.InitialiseBiases(ref network);

            var POINTS_DATA = new List<DataPoint>{};
            var pointsJSON = File.ReadAllText("Data/points.txt");
            dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject(pointsJSON);
            foreach (var data in obj) {
                var inputs = data.inputs.ToObject<List<double>>();
                var expectedOutputs = data.expectedOutputs.ToObject<List<double>>();
                var dataPoint = new DataPoint(inputs, expectedOutputs);
                POINTS_DATA.Add(dataPoint);
            }

            network.stepSize = 0.0001;
            network.miniBatchSize = 100;

            while (true) {
                network.Train(POINTS_DATA, 40);
                double cost = network.CalculateCost(POINTS_DATA);

                persistance.SaveWeights(network);
                persistance.SaveBiases(network);

                if (cost <= 0.02) {
                    break;
                }
            }
            Console.WriteLine(network.CalculateCost(POINTS_DATA));
            
            /*
            //Comparing to JS version
            Console.WriteLine("BIASES");
            for (var i = 0; i != network.layers.Count; i += 1) {
                for (var a = 0; a != network.layers[i].neurons.Count; a += 1) {
                    Console.WriteLine($"Layer: {i}, Neuron: {a}, Bias: {network.biases[network.layers[i].neurons[a].id]}");
                }
            }

            Console.WriteLine("WEIGHTS");
            for (var i = 0; i != network.layers.Count - 1; i += 1) {
                var layer = network.layers[i];
                var nextLayer = network.layers[i + 1];
                for (var a = 0; a != layer.neurons.Count; a += 1) {
                    var neuron = layer.neurons[a];
                    for (var b = 0; b != nextLayer.neurons.Count; b += 1) {
                        var nextNeuron = nextLayer.neurons[b];
                        Console.WriteLine($"Layer: {i} -> {i + 1}, Neuron: {a} -> {b}, Weight: {network.weights[neuron.id + nextNeuron.id]}");
                    }
                }
            }

            //WEIGHTS AND BIASES ARE ALL THE SAME IN BOTH NETWORKS, NEXT I WILL RUN IT
            network.ForwardPropogate(new List<double>{450, 450});

            Console.WriteLine(network.CalculateCost(POINTS_DATA));
            */
        }
    }
}
