
// Multi-class Perceptron 
// @author Pierre Maldera
// https://github.com/pmaldera

var maxIterations = 9999; // Max amount of iteration with errors.
const eta = 0.7; // Learning rate
var weight = [ // Weights for each class.
    [10, 0, -4],
    [9,1,-1],
    [8,1,-1]
];

/*
| #  | $V_0$ | $V_1$ | $V_2$ | Class  | Base  |
|----|-------|-------|-------|--------|-------|
| 4  | 1     | 6     | 4     | $C_1$  | Learn |
| 5  | 1     | 7     | 5     | $C_1$  | Learn |
| 2  | 1     | 2     | 16    | $C_2$  | Learn |
| 6  | 1     | 8     | 15    | $C_2$  | Learn |
| 8  | 1     | 11    | 16    | $C_3$  | Learn |
| 9  | 1     | 14    | 11    | $C_3$  | Learn |
*/

const baseLearn=  [ // Learning base with v0, v1, v2, desired class
    [1,6,4,1], //element 4, class 1
    [1,7,5,1], // element 5, class 1
    [1,2,16,2], // element 2, class 2
    [1,8,15,2], // element 6, class 2
    [1,11,16,3], // element 8, class 3
    [1,14,11,3], // element 9, class 3
]

/*
| #  | $V_0$ | $V_1$ | $V_2$ | Class  | Base |
|----|-------|-------|-------|--------|------|
| 7  | 1     | 9     | 9     | $C_1$  | Test |
| 1  | 1     | 1     | 2     | $C_2$  | Test |
| 3  | 1     | 4     | 9     | $C_2$  | Test |
| 10 | 1     | 16    | 5     | $C_3$  | Test |
*/

const baseTest =  [
    [1,9,9,1], //element 7, class 1
    [1,1,2,2], // element 1, class 2
    [1,4,9,2], // element 3, class 2
    [1,16,5,3], // element 10, class 3
]

console.log("");
console.log("Learning");
console.log("----------------");

var y; // Containing the class found of the tested value.
var iterationBase; // Row number in the base
var xWithoutDesiredValue; // Values array of the base without the desired class.
var desiredValue; // Desired class id for the values
var errors = 0; // Amount of error for each learn step (every values of the learningBase)
var results; // Results for each row.

for(var it = 0; it < maxIterations; it++) {
    results = [];
    iterationBase = it % baseLearn.length; // Getting current row to calculate.
    desiredValue = baseLearn[iterationBase][baseLearn[0].length-1]; // Getting the desired class for the row.
    xWithoutDesiredValue = baseLearn[iterationBase].slice(); 
    xWithoutDesiredValue.splice(baseLearn[0].length-1,1); // Gettins the row values without the desired class.
    for(var w = 0; w<weight.length; w++) {
        results.push(prodScal(xWithoutDesiredValue, weight[w])); // Calculating
    }
    y = results.indexOf(Math.max(...results)); // Getting index of the max value
    if(y+1 !== desiredValue) { // If the obtained class (index+1) is different than the desired one we adjust
        errors++;
        weight[desiredValue-1] = addVects(weight[desiredValue-1],realMultiplyVect(eta,xWithoutDesiredValue));
        weight[y] = addVects(weight[y],realMultiplyVect(-eta,xWithoutDesiredValue));
    }

    // No more errors ? Finish.
    if(errors === 0 && iterationBase === baseLearn.length-1) {
        break;
    }
}

console.log("Final weights")
console.table(weight);

console.log("----------------");
console.log("");
console.log("Testing");
console.log("----------------");
var confusionMatrix = zeros([weight.length, weight.length]); // Generating confusion matrix

for(var it = 0; it < baseTest.length; it++) {
    results = [];
    desiredValue = baseTest[it][baseTest[0].length-1];
    xWithoutDesiredValue = baseTest[it].slice();
    xWithoutDesiredValue.splice(baseTest[0].length-1,1);
    for(var w = 0; w<weight.length; w++) {
        results.push(prodScal(xWithoutDesiredValue, weight[w]));
    }
    y = results.indexOf(Math.max(...results));
    confusionMatrix[desiredValue-1][y] ++; // Filling confusion matrix
}

var precisions = new Array(weight.length); // Generating precisions table.
var callback = new Array(weight.length); // Generating callback table.
var sumRow; // Sum of the current confusion matrix row;
var sumCol; // Sum of the current confusion matrix column;

for(var i = 0 ; i < weight.length; i ++) {
    sumRow = 0;
    sumCol = 0;
    for(var p = 0; p < weight.length; p ++) {
        sumRow+= confusionMatrix[i][p];
        sumCol+= confusionMatrix[p][i];
    }
    precisions[i] = confusionMatrix[i][i] / sumRow;
    callback[i] = confusionMatrix[i][i] / sumCol;
}

console.log("Confusion Matrix");
console.table(confusionMatrix);
console.log("Accuracy : " + sumDiag(confusionMatrix)/baseTest.length);
console.log("Precisions");
console.log(precisions);
console.log("callback");
console.log(callback);
console.log("----------------")


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

function zeros(dimensions) { // Generate matrix of dimesions[0] * dimensions[1]
    var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }

    return array;
}

function sumDiag(matrix) { // Diagonal sum of any x*x matrix
    var sum = 0;

    for(var i = 0; i<matrix.length; i++) {
        sum+=matrix[i][i];
    }

    return sum;
}
