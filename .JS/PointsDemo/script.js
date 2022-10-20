"use strict";
const STEP_SIZE = 0.01; //when the cost starts to fluctuate, just reduce the STEP_SIZE
const MINI_BATCH_SIZE = 100;
const Main = () => {
    const network = RetrieveNeuralNetwork([2, 10, 10, 10, 2]);
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
    };
    clearInterval(interval); //to stop it from running whenever you view the page
};
Main();
const TestingDifferentLearningMethods = () => {
    const network = RetrieveNeuralNetwork([2, 3, 3, 2]);
    const startTime = Date.now();
    Train(network, DATA, 1000, STEP_SIZE, MINI_BATCH_SIZE);
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

    //1000 cycles finite gradient:
    1. Cost: 0.2426180347351767, Time: 116.649 seconds
    2. Cost: 0.25792476732363817, Time: 117.197 seconds
    3. Cost: 0.25070170031683264, Time: 116.087 seconds
    4. Cost: 0.25025190879449993, Time: 114.718 seconds
    5. Cost: 0.2346851979540269, Time: 117.151 seconds
    */
};
//TestingDifferentLearningMethods();
