interface Pixel {
    r: number, 
    g: number, 
    b: number, 
    a: number
}

const GetImage = (path: string) => {
    const promise = new Promise((resolve) => {
        const image = new Image();
        image.src = path;
        image.onload = () => {
            resolve(image);
        }
    });
    return promise;
}

const GetImageData = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas')!;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    const imgData = ctx.getImageData(0, 0, 28, 28).data; //images are 28x28

    const pixels: Pixel[] = [];
    for (let i = 0; i != imgData.length; i += 4) {
        pixels.push({
            r: imgData[i],
            g: imgData[i + 1],
            b: imgData[i + 2],
            a: imgData[i + 3],
        })
    }
    return pixels;
}






const RandomID = () => {
    return String(Math.floor(Math.random() * (99999999999999 - 10000000000000 + 1) + 10000000000000));
}

class Neuron {
    id: string = ""
    //layer is set implicitly  
    value: number = 0;
    bias: number = 0;

    constructor(value?: number) {
        this.id = RandomID();

        if (value != undefined) {
            this.value = value;
        }
    }

    static SigmoidFunction(num: number) {
        return 1 / (1 + Math.E**-num);
    }
}

class Layer {
    id: string = "";
    neurons: Neuron[] = [];

    constructor(numOfNeurons?: number) {
        this.id = RandomID();

        if (numOfNeurons != undefined) {
            this.neurons = [];
            for (let _ = 0; _ != numOfNeurons; _ += 1) {
                this.neurons.push(new Neuron());
            }
        }
    }

    calculateValues(previousLayer: Layer) {
        for (let i = 0; i != this.neurons.length; i += 1) { //each neuron in this layer, is connected to every neuron in the previous layer
            const neuron = this.neurons[i];

            let sum = 0;
            for (let a = 0; a != previousLayer.neurons.length; a += 1) {
                const prevNeuron = previousLayer.neurons[a];
                const nodeWeight = WEIGHTS[JSON.stringify([previousLayer.id, this.id, prevNeuron.id, neuron.id])];
                sum += prevNeuron.value * nodeWeight
            }
            neuron.value = Neuron.SigmoidFunction(sum + neuron.bias);
        }
    }

    calculateCost(correctNeuronIndex: number) {
        let cost = 0;
        for (let i = 0; i != this.neurons.length; i += 1) {
            const neuron = this.neurons[i];
            const difference = (i == correctNeuronIndex) ? 1 - neuron.value : 0 - neuron.value;
            const differenceSquared = difference**2;
            cost += differenceSquared;
        }
        return cost;
    }
}

const CreateInputLayer = (pixels: Pixel[]) => {
    //convert each pixel to greyscale, then create a neuron with that value, add it to an array, and create a layer with those neurons
    const neurons: Neuron[] = [];

    for (const pixel of pixels) {
        let lum = 0.2126 * pixel.r + 0.7152 * pixel.g + 0.0722 * pixel.b; // https://stackoverflow.com/questions/45152358/best-rgb-combination-to-convert-image-into-black-and-white-threshold
        neurons.push(new Neuron(lum));
    }
    const layer = new Layer();
    layer.neurons = neurons;
    return layer;
}

let WEIGHTS: { [k: string] : number } = {}; //k: JSON.stringify([layer1ID, layer2ID, neuron1ID, neuron2ID])
const InitaliseWeights = (layers: Layer[]) => {

    const weightData = localStorage.getItem("weightData");
    let weightArray = (weightData == undefined) ? undefined : JSON.parse(weightData);

    const weightFunction = () => {
        const randomNumber = -1 + Math.random() + Math.random(); //random number from -1 to 1
        return randomNumber;
    }

    let counter = 0;
    for (let i = 1; i != layers.length; i += 1) {
        const [layer1, layer2] = [layers[i - 1], layers[i]];
        
        for (let a = 0; a != layer1.neurons.length; a += 1) {
            for (let b = 0; b != layer2.neurons.length; b += 1) {
                const [neuron1, neuron2] = [layer1.neurons[a], layer2.neurons[b]];

                const key = JSON.stringify([layer1.id, layer2.id, neuron1.id, neuron2.id]);

                if (weightArray == undefined) { //if weight array is undefined then create random value
                    WEIGHTS[key] = weightFunction();
                }
                else {
                    WEIGHTS[key] = weightArray[counter];
                }

                counter += 1;
            }   
        }
    }

    if (weightArray == undefined) { //save to local storage so it can be persisted
        SaveWeights();
    }
}
const SaveWeights = () => {
    const array: number[] = [];
    for (const key in WEIGHTS) {
        array.push(WEIGHTS[key]);
    }
    localStorage.setItem("weightData", JSON.stringify(array));
}






const Main = async () => {
    let totalCost = 0;

    const images = [
        "0/1",
        "1/3",
        "2/5",
        "3/7",
        "4/2",
        "5/0",
        "6/13",
        "7/15",
        "8/17",
        "9/4",
    ]

    for (let counter = 0; counter != images.length; counter += 1) {
        const inputImagePath = `/mnist_png/training/${images[counter]}.png`;
        const image = <HTMLImageElement> await GetImage(inputImagePath);
        const pixels = GetImageData(<HTMLImageElement>image);

        const inputLayer = CreateInputLayer(pixels);
        const hiddenLayer1 = new Layer(16);
        const hiddenLayer2 = new Layer(16);
        const outputLayer = new Layer(10);
        InitaliseWeights([inputLayer, hiddenLayer1, hiddenLayer2, outputLayer]);
        
        hiddenLayer1.calculateValues(inputLayer);
        hiddenLayer2.calculateValues(hiddenLayer1);
        outputLayer.calculateValues(hiddenLayer2);

        const cost = outputLayer.calculateCost(counter % 10); //0 is first neuron, and is also training image
        totalCost += cost;
    }

    const averageCost = totalCost / images.length;
    console.log(averageCost); //we need to find a way to reduce average cost
}
Main();