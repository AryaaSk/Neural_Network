using System;
using System.Collections.Generic;

namespace NetworkCS
{
    class Program
    {
        static void Main(string[] args)
        {
            var network = new Network(new List<int>{2, 3, 2});

            var persistance = new Persistance();
            persistance.InitaliseWeights(ref network);
            persistance.InitialiseBiases(ref network);

            Console.WriteLine(network.biases[network.layers[1].neurons[0].id]);
        }
    }
}
