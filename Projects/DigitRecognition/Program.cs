using NetworkCS;
using System;
using System.Collections.Generic;
using System.Text.Json;

namespace DigitRecognition
{
    class Program
    {
        static void Main(string[] args)
        {
            var network = new Network(new List<int>{784, 300, 10});
            network.stepSize = 0.01;
            network.miniBatchSize = 1000;
            
            var persistance = new Persistance();
            persistance.InitaliseWeights(ref network);
            persistance.InitialiseBiases(ref network);

            //Create List<DataPoint> of training data
            var trainingData = new List<DataPoint>{};
            foreach (var image in MnistReader.ReadTrainingData()) {
                var bytes = image.Data;
                var inputs = new List<double>{};
                foreach (var b in bytes) {
                    inputs.Add(Convert.ToDouble(b));
                }

                var expectedOutputs = new List<double>{
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                };
                int labelIndex = image.Label;
                expectedOutputs[labelIndex] = 1;

                trainingData.Add(new DataPoint(inputs, expectedOutputs));
            }

            Console.WriteLine("Created training data");

            while (true) {
                network.Train(trainingData, 1);

                var cost = network.CalculateCost(trainingData);
                Console.WriteLine($"Cost: {cost}");

                if (cost <= 0.5) {
                    break;
                }
            }
            var finalCost = network.CalculateCost(trainingData);
            Console.WriteLine($"Final Cost: {finalCost}");


            //THIS MAY WORK HOWEVER IT IS TOO SLOW, I NEED TO MOVE TO A NEURAL NETWORK LIBRARY TO GET ACCESS TO GPU PROCESSING AND THEREFORE MUCH HIGHER SPEEDS
            //CURRENTLY WITH PURE CPU IT IS TOO SLOW (DIDN'T EVEN FINISH A SINGLE EPOCH CYCLE)
        }
    }
}
