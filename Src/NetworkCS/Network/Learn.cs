using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace NetworkCS {

    class DataPoint {
        public List<double> inputs;
        public List<double> expectedOutputs;

        public DataPoint(List<double> inputs, List<double> expectedOutputs) {
            this.inputs = inputs;
            this.expectedOutputs = expectedOutputs;
        }
    }

    partial class Network {

        public double stepSize;
        public int miniBatchSize;

        public double CalculateCost(List<DataPoint> dataset) {
            double totalCost = 0;
            foreach (var data in dataset) {

                this.ForwardPropogate(data.inputs);
                var outputLayer = this.layers[this.layers.Count - 1];

                double totalLayerCost = 0;
                for (var i = 0; i != outputLayer.neurons.Count; i += 1) {
                    double expectedOutput = data.expectedOutputs[i];
                    double neuronCost = Neuron.NeuronCost(expectedOutput, outputLayer.neurons[i].value);
                    totalLayerCost += neuronCost;
                }

                totalCost += totalLayerCost;
            }

            double averageCost = totalCost / dataset.Count;
            return averageCost;
        }

        public void Learn(List<DataPoint> dataset) {
            //first need to find gradients of weights/biases across all datapoints in the dataset
            var weightGradients = new Dictionary<string, double>{};
            var biasGradients = new Dictionary<string, double>{}; //keys are same format as network.weights and network.biases
            foreach (var entry in this.weights) {
                weightGradients[entry.Key] = 0;
            }
            foreach (var entry in this.biases) {
                biasGradients[entry.Key] = 0;
            }

            System.Threading.Tasks.Parallel.ForEach(dataset, (data) => {
                var threadNetwork = this.Copy(); //Create copy of network, otherwise all the different threads would be trying to forward propogate on the same network at the same time
                threadNetwork.ForwardPropogate(data.inputs);

                var nodeValues = new Dictionary<string, double>{}; //key = neuron.id

                //d[NC]/d[Weight] = [PreviousOutput] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
                //Node value is just the partial derivatives of activation * cost, since those do not require any other neurons to be calculated

                var outputLayer = threadNetwork.layers[threadNetwork.layers.Count - 1];
                for (var i = 0; i != outputLayer.neurons.Count; i += 1) {
                    var neuron = outputLayer.neurons[i];
                    double expectedOutput = data.expectedOutputs[i];
                    double costDerivative = Neuron.NeuronCostDerivative(expectedOutput, neuron.value);
                    double activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);

                    double nodeValue = activationDerivative * costDerivative;
                    nodeValues[neuron.id] = nodeValue;
                }

                //Use node value to calculate gradients of weights between output and previous layer, and biases in output layer
                CalculateGradients(outputLayer, threadNetwork.layers[threadNetwork.layers.Count - 2], nodeValues, ref weightGradients, ref biasGradients);

                //Backpropogate throughout all layers
                for (var i = threadNetwork.layers.Count - 2; i != 0; i -= 1) {
                    var layer = threadNetwork.layers[i];
                    var nextLayer = threadNetwork.layers[i + 1]; //need nextLayer's node values to calculate current layer's node values

                    foreach (var neuron in layer.neurons) {
                        //d[NC]/d[WeightPrev] = [PreviousPreviousOutput] * (1 - Sigmoid(ROp))Sigmoid(ROp) * [Weight] * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
                        double sum = 0;
                        foreach (var nextNeuron in nextLayer.neurons) {
                            double nextNeuronNodeValue = nodeValues[nextNeuron.id];
                            string weightKey = neuron.id + nextNeuron.id;
                            double weight = threadNetwork.weights[weightKey];
                            sum += (weight * nextNeuronNodeValue);
                        }

                        double activationDerivative = Neuron.ActivationDerivative(neuron.rawValue);
                        double nodeValue = activationDerivative * sum;
                        nodeValues[neuron.id] = nodeValue;
                    }

                    //Update weight and bias gradients with these new node values
                    var previousLayer = threadNetwork.layers[i - 1];
                    CalculateGradients(layer, previousLayer, nodeValues, ref weightGradients, ref biasGradients);
                }
            });

            //We now have all the weight gradients and biases, we just need to apply them
            ApplyGradients(weightGradients, biasGradients);
        }

        private void CalculateGradients(Layer layer, Layer previousLayer, Dictionary<string, double> nodeValues, ref Dictionary<string, double> weightGradients, ref Dictionary<string, double> biasGradients) {
            //Calculates the actual gradients of the corresponding weights between the 2 layers, by multiplying previousOutput by the nodeValue of the next neuron
            foreach (var neuron in layer.neurons) {
                double nodeValue = nodeValues[neuron.id];

                foreach (var previousNeuron in previousLayer.neurons) {
                    double previousOutput = previousNeuron.value;
                    double weightGradient = previousOutput * nodeValue;

                    string weightKey = previousNeuron.id + neuron.id;
                    weightGradients[weightKey] += weightGradient; //Not using locks since it didn't seem like a problem and it drastically increased the speed, however I am not sure how safe this is
                }

                //d[NC]/d[Bias] = 1 * (1 - Sigmoid(RO))Sigmoid(RO) * 2([ExpectedOutput] - [O])
                double biasGradient = 1 * nodeValue;
                string biasKey = neuron.id;
                biasGradients[biasKey] += biasGradient;
            }
        }

        private void ApplyGradients(Dictionary<string, double> weightGradients, Dictionary<string, double> biasGradients) {
            foreach (var entry in this.weights) {
                double gradient = weightGradients[entry.Key];

                if (gradient == 0) {} //do nothing, since the weight is already at the minimum
                else if (gradient > 0) {
                    this.weights[entry.Key] += this.stepSize;
                }
                else {
                    this.weights[entry.Key] -= this.stepSize;
                }            

                //this.weights[entry.Key] += (gradient * this.stepSize); //By increasing the weights proportional to the gradient it seemed to fix the constant cost issue
                weightGradients[entry.Key] = 0;
            }

            foreach (var entry in this.biases) {
                double gradient = biasGradients[entry.Key];
                
                if (gradient == 0) {} //do nothing, since the weight is already at the minimum
                else if (gradient > 0) {
                    this.biases[entry.Key] += this.stepSize;
                }
                else {
                    this.biases[entry.Key] -= this.stepSize;
                } 

                biasGradients[entry.Key] = 0;
            }
        }

        public void Train(List<DataPoint> dataset, int epochCycles) {
            int i = 0;
            while (i != epochCycles) {
                var chunks = this.CreateChunks(dataset);
                
                foreach (var chunk in chunks) {
                    this.Learn(chunk);
                }

                i += 1;
            }
        }
        private List<List<DataPoint>> CreateChunks(List<DataPoint> dataset) {
            var duplicateList = new List<DataPoint>(dataset);
            duplicateList.Shuffle();
            return duplicateList.ChunkBy(this.miniBatchSize);
        }

    }
}

public static class ExtensionMethods
{
    //https://stackoverflow.com/questions/11463734/split-a-list-into-smaller-lists-of-n-size
    public static List<List<T>> ChunkBy<T>(this List<T> source, int chunkSize) 
    {
        return source
            .Select((x, i) => new { Index = i, Value = x })
            .GroupBy(x => x.Index / chunkSize)
            .Select(x => x.Select(v => v.Value).ToList())
            .ToList();
    }

    //https://stackoverflow.com/questions/273313/randomize-a-listt
    private static Random rng = new Random();
    public static void Shuffle<T>(this IList<T> list)  
    {  
        int n = list.Count;  
        while (n > 1) {  
            n--;  
            int k = rng.Next(n + 1);  
            T value = list[k];  
            list[k] = list[n];  
            list[n] = value;  
        }  
    }

    //https://github.com/Burtsev-Alexey/net-object-deep-copy/blob/master/ObjectExtensions.cs
    private static readonly MethodInfo CloneMethod = typeof(Object).GetMethod("MemberwiseClone", BindingFlags.NonPublic | BindingFlags.Instance);
    public static bool IsPrimitive(this Type type) {
        if (type == typeof(String)) return true;
        return (type.IsValueType & type.IsPrimitive);
    }
    public static Object Copy(this Object originalObject) {
        return InternalCopy(originalObject, new Dictionary<Object, Object>(new ReferenceEqualityComparer()));
    }
    private static Object InternalCopy(Object originalObject, IDictionary<Object, Object> visited) {
        if (originalObject == null) return null;
        var typeToReflect = originalObject.GetType();
        if (IsPrimitive(typeToReflect)) return originalObject;
        if (visited.ContainsKey(originalObject)) return visited[originalObject];
        if (typeof(Delegate).IsAssignableFrom(typeToReflect)) return null;
        var cloneObject = CloneMethod.Invoke(originalObject, null);
        if (typeToReflect.IsArray) {
            var arrayType = typeToReflect.GetElementType();
            if (IsPrimitive(arrayType) == false) {
                Array clonedArray = (Array)cloneObject;
                clonedArray.ForEach((array, indices) => array.SetValue(InternalCopy(clonedArray.GetValue(indices), visited), indices));
            }

        }
        visited.Add(originalObject, cloneObject);
        CopyFields(originalObject, visited, cloneObject, typeToReflect);
        RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect);
        return cloneObject;
    }
    private static void RecursiveCopyBaseTypePrivateFields(object originalObject, IDictionary<object, object> visited, object cloneObject, Type typeToReflect) {
        if (typeToReflect.BaseType != null){
            RecursiveCopyBaseTypePrivateFields(originalObject, visited, cloneObject, typeToReflect.BaseType);
            CopyFields(originalObject, visited, cloneObject, typeToReflect.BaseType, BindingFlags.Instance | BindingFlags.NonPublic, info => info.IsPrivate);
        }
    }
    private static void CopyFields(object originalObject, IDictionary<object, object> visited, object cloneObject, Type typeToReflect, BindingFlags bindingFlags = BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.FlattenHierarchy, Func<FieldInfo, bool> filter = null) {
        foreach (FieldInfo fieldInfo in typeToReflect.GetFields(bindingFlags)) {
            if (filter != null && filter(fieldInfo) == false) continue;
            if (IsPrimitive(fieldInfo.FieldType)) continue;
            var originalFieldValue = fieldInfo.GetValue(originalObject);
            var clonedFieldValue = InternalCopy(originalFieldValue, visited);
            fieldInfo.SetValue(cloneObject, clonedFieldValue);
        }
    }
    public static T Copy<T>(this T original) {
        return (T)Copy((Object)original);
    }
    public static void ForEach(this Array array, Action<Array, int[]> action) {
        if (array.LongLength == 0) return;
        ArrayTraverse walker = new ArrayTraverse(array);
        do action(array, walker.Position);
        while (walker.Step());
    }
    internal class ArrayTraverse {
        public int[] Position;
        private int[] maxLengths;
        public ArrayTraverse(Array array) {
            maxLengths = new int[array.Rank];
            for (int i = 0; i < array.Rank; ++i)
            {
                maxLengths[i] = array.GetLength(i) - 1;
            }
            Position = new int[array.Rank];
        }

        public bool Step() {
            for (int i = 0; i < Position.Length; ++i) {
                if (Position[i] < maxLengths[i]) {
                    Position[i]++;
                    for (int j = 0; j < i; j++) {
                        Position[j] = 0;
                    }
                    return true;
                }
            }
            return false;
        }
    }
    public class ReferenceEqualityComparer : EqualityComparer<Object> {
        public override bool Equals(object x, object y) {
            return ReferenceEquals(x, y);
        }
        public override int GetHashCode(object obj) {
            if (obj == null) return 0;
            return obj.GetHashCode();
        }
    }
}