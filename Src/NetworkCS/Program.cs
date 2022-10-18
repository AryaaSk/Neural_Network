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

            network.ForwardPropogate(new List<double>{0, 0});
            Console.WriteLine(network.layers[2].neurons[0].value);
        }
    }
}
