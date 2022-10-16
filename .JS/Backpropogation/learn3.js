"use strict";
const Learn3 = (network, stepSize, dataset) => {
    const data = dataset[0];
    RunNetwork(network, [data.x, data.y]);
    //Literally just want to see the effect of each weight on the final output
};
