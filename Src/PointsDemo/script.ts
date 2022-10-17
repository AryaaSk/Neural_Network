interface DataPoint {
    inputs: number[];
    expectedOutputs: number[];
}

const STEP_SIZE = 0.01; //when the cost starts to fluctuate, just reduce the STEP_SIZE
const MINI_BATCH_SIZE = 100;


const Main = () => {
    const network = RetrieveNeuralNetwork([2, 3, 2]);
    Neuron.ActivationFunction = Sigmoid;
    Neuron.ActivationDerivative = SigmoidDerivative;

    CANVAS.linkCanvas("canvas");
    VisualiseData(CANVAS, DATA);
    VisualiseNeuralNetwork(CANVAS, network, 30);
    console.log("Cost: " + CalculateCost(network, DATA));

    const interval = setInterval(() => {
        CANVAS.clearCanvas();
        VisualiseData(CANVAS, DATA);
        VisualiseNeuralNetwork(CANVAS, network, 100);

        Train(network, DATA, 40, STEP_SIZE, MINI_BATCH_SIZE, () => {
            console.log("Cost: " + CalculateCost(network, DATA));
        });
    }, 1000);

    document.onkeydown = ($e) => {
        if ($e.key == " ") {
            clearInterval(interval);
        }
    }

    //clearInterval(interval);

    /*
    //Managed to bring cost down to 0.01941260931267366
    - Network: [2, 3, 3, 2] (Sigmoid Activation)
    - Bias data: [0,0,-5.38214000000005,6.136080000000381,-3.0229199999997847,-0.7808200000000335,0.004840000000000427,1.0280799999999584,-1.1979600000001118,1.1139000000001207]
    - Weight data: [0.005556855132202739,0.023981119762710806,0.00672402034274619,-0.025148655534003923,-0.007637768941736185,0.00837886903301327,-6.256584035851966,5.802006574277471,5.896808797464952,2.6402836635449067,-1.8937382791792197,-3.008323110778759,-3.927738817201862,1.7483417315772702,4.3901105034097645,-5.1998253851105645,5.292505405755149,4.096089169894945,-4.2166749862481385,8.063760569432295,-7.91241973733379]
    */
}
Main();



const Testing = () => {
    const network = RetrieveNeuralNetwork([2, 3, 3, 2]);

    const startTime = Date.now();
    Train(network, DATA, 1000, STEP_SIZE, MINI_BATCH_SIZE)
    const endTime = Date.now();

    console.log("Cost: " + CalculateCost(network, DATA));
    console.log("Time: " + ((endTime - startTime) / 1000) + " seconds");


    /*
    //Testing data:
    - Network: [2, 3, 3, 2]
    - Reset network (cleared storage data) for every test run

    //1000 cycles backpropogation:
    1. Cost: 0.19317093182300968, Time: 12.909 seconds
    2. Cost: 0.23131152956473486, Time: 12.915 seconds
    3. Cost: 0.25408447357964326, Time: 13.226 seconds
    4. Cost: 0.1616202893890289, Time: 12.692 seconds
    5. Cost: 0.20452779158951404, Time: 13.151 seconds

    //1000 cycles finite 
    1. Cost: 0.2426180347351767, Time: 116.649 seconds
    2. Cost: 0.25792476732363817, Time: 117.197 seconds
    3. Cost: 0.25070170031683264, Time: 116.087 seconds
    4. Cost: 0.25025190879449993, Time: 114.718 seconds
    5. Cost: 0.2346851979540269, Time: 117.151 seconds
    */
}
//Testing();