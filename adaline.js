
// ADALINE for logic AND
// @author Pierre Maldera
// https://github.com/pmaldera

var e; // Adjustment variable
var iterationBase; // Row number in the base
var delta; // Difference with expected result
var xWithoutDesiredValue; // Values array of the base without the desired value.
const eta = 0.1; // // Learning rate
var weight = [0.3, 0.8, 0.4]; // Weights
var maxIterations = 400; // Number of iterations.

const base = [ // Learning base with v0, v1, v2, desired value
    [1,1,1,1],
    [1,1,-1,-1],
    [1,-1,1,-1],
    [1,-1,-1,-1]
]
console.log("");
console.log("Weights:");
console.log(weight);
console.log("");
console.log("Learning");
console.log("");
for(var it = 0; it < maxIterations; it++) {
    iterationBase = it % base.length; // Getting current row to calculate.
    xWithoutDesiredValue = base[iterationBase].slice(); // Getting the values without the desired one.
    xWithoutDesiredValue.splice(base[0].length-1,1);
    e = base[iterationBase][base[0].length-1] - prodScal(xWithoutDesiredValue, weight); // Calculating adjustment var.
    delta = realMultiplyVect(-2*e, xWithoutDesiredValue);
    weight = addVects(weight, realMultiplyVect(-eta, delta)); // Adjusting weights
}
console.log("Final Weights");
console.log(weight);
console.log("");

function prodScal(a,b) { // Scalar Product
    var res = 0;
    for(var i = 0; i < a.length; i++) {
        res += a[i]*b[i];
    }
    return res;
}

function realMultiplyVect(real, vect) { // Real multiply vector
    var res = Array(vect.length);
    for(var i = 0; i < vect.length; i++) {
        res[i] = vect[i]*real;
    }
    return res;
}

function addVects(v1,v2) { // Add Vectors
    var res = Array(v1.length);
    for(var i = 0; i < v1.length; i++) {
        res[i] = v1[i] + v2[i];
    }
    return res;
}
