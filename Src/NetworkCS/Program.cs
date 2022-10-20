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
            var network = new Network(new List<int>{2, 10, 2}); //seems to be able to achieve lower cost values by increasing number of neuron in the singular hidden layer, rather than adding more hidden layeres

            var persistance = new Persistance();
            persistance.InitaliseWeights(ref network);
            persistance.InitialiseBiases(ref network);

            var POINTS_DATA = new List<DataPoint>{};
            var pointsJSON = File.ReadAllText("Data/points1.txt");
            dynamic obj = Newtonsoft.Json.JsonConvert.DeserializeObject(pointsJSON);
            foreach (var data in obj) {
                var inputs = data.inputs.ToObject<List<double>>();
                var expectedOutputs = data.expectedOutputs.ToObject<List<double>>();
                var dataPoint = new DataPoint(inputs, expectedOutputs);
                POINTS_DATA.Add(dataPoint);
            }

            network.stepSize = 0.001;
            network.miniBatchSize = 100;

            while (true) {
                network.Train(POINTS_DATA, 40);

                double cost = network.CalculateCost(POINTS_DATA);
                Console.WriteLine(cost);

                persistance.SaveWeights(network);
                persistance.SaveBiases(network);

                if (cost <= 0.1) {
                    break;
                }
            }
            Console.WriteLine(network.CalculateCost(POINTS_DATA));

            /*
            //Parallel vs Single threaded speed testing (Network config: [2, 10 ,2], DATA: 'Data/points1.txt', Step Size: 0.01, Mini Batch Size: 100)
            Average time of Train() function (40 epoch cycles), repeated until cost <= 0.15

            Single threaded:
            - 3112.7ms
            - 3086.9ms
            - 3126.5ms

            Parallel:
            - 597.4ms
            - 602.8ms
            - 592.4ms

            Parallel is much faster which is expected
            */
        }
    }
}
