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
            var network = new Network(new List<int>{2, 3, 3, 2});

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

            network.stepSize = 0.1;
            network.miniBatchSize = 80;

            network.Train(POINTS_DATA, 10000, persistance);
            Console.WriteLine(network.CalculateCost(POINTS_DATA));

            //Can't seem to get the cost below 0.47, for some reason
            //Going to try and rebuild from the js version
        }
    }
}
