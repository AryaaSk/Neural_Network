using System;
using System.Collections.Generic;

namespace NetworkCS
{
    class Program
    {
        static void Main(string[] args)
        {
            XORDemo();
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
    }
}
