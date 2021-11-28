// Creamos objeto de recomendador
let recommender = new Recommender([], "", 3, "");

// Cogemos los datos del fichero introducido
const fileInput = document.getElementById('matrix');
fileInput.addEventListener('change', fileToMatrix);

// Cogemos el tipo de métrica seleccionada
const metricType = document.getElementById('selectMetric');
metricType.addEventListener('change', function(e) {
    recommender.setMetricType(e.target.value);
});

// Cogemos los vecinos seleccionados
const numberOfNeighbours = document.getElementById('neighbour');
numberOfNeighbours.addEventListener('change', function(e) {
    recommender.setNumberOfNeighbours(e.target.value);
});

// Cogemos el tipo de predicción seleccionada
const predictionType = document.getElementById('selectPrediction');
predictionType.addEventListener('change', function(e) {
    recommender.setPredictionType(e.target.value);
});

// Proceso de ejecución del programa al pulsar el botón
const result = document.getElementById('button');
    result.addEventListener('click', function(e) {

    recommender.setSimilarityMatrix();
    document.getElementById('utilityMatrix').innerHTML = '<h5>Matriz de Utilidad</h5>' + printMatrix(recommender.getUtilityMatrix());
    document.getElementById('similarityMatrix').innerHTML = '<h5>Matriz de Similaridad</h5>' + printMatrix(recommender.getSimilarityMatrix(), 'Usuario');
    document.getElementById('resultMatrix').innerHTML = '<h5>Matriz de Utilidad con Predicciones</h5>' + printMatrix(recommender.recommend(), 'Usuario', true, recommender.getUtilityMatrix());
    document.getElementById('closeNeighbours').innerHTML = '<div class="center"><h5>Vecinos seleccionados</h5></div>' + printNeighbours(recommender.getCloseNeighbours());
    document.getElementById('calculatePredictions').innerHTML = '<div class="center"><h5>Cálculos de predicciones</h5></div>' + printCalculatePredictions(recommender.getCalculatePredictions(), recommender.getMetricType());

    recommender.emptyCloseNeighbours();
    recommender.emptyCalculatePredictions();
});

// Método para pasar de fichero a matriz
function fileToMatrix(e) {
    if (e.target.files.length < 1) {
      alert("Tienes que subir un fichero de matriz de utilidad");
    }

    const file = fileInput.files[0];
    var reader = new FileReader();
    var matrix = [];
    reader.readAsText(file);

    reader.onload= function() {
        const content = reader.result;
        let arrayLines = content.split("\n");
        let arrayResult = [];
        for (let i = 0; i < arrayLines.length; i++) {
            arrayLines[i] = arrayLines[i].replace("\r", "");
        }
        for (let i = 0; i < arrayLines.length; i++) {
            arrayResult[i] = arrayLines[i].split(" ");
        }
        for (let i = 0; i < arrayResult.length; i++){
            for (let j = 0; j < arrayResult[i].length; j++){
                if (arrayResult[i][j] == "") {
                    arrayResult[i].splice(j,1);
                    j--;
                }
            }
            if (arrayResult[i].length == 0) arrayResult.splice(i,1);
        }
        recommender.setUtilityMatrix(arrayResult);
    }
    return matrix;
}

// Método para imprimir una matriz
function printMatrix(matrix, element = "Item", solution = false, utilityMatrix = []) {
    let table = '<div class="col s12" id="scrollTable"><table class="stripped"><thead><tr><th> </th>';

    for (let i = 0; i < matrix[0].length; i++) {
        table += '<th> ' + element + " " + (i + 1) + '</th>';
    }
    table += '</tr></thead><tbody>';

    for (let i = 0; i < matrix.length; i++) {
        table += '<tr><th> Usuario ' + (i + 1) + '</th>';
        for (let j = 0; j < matrix[i].length; j++) {
            if (solution == true && utilityMatrix[i][j] == '-') {
                table += '<td class="teal lighten-4">' + Math.round(Number((matrix[i][j]) + Number.EPSILON) * 100) / 100 + '</td>';
            } else if (matrix[i][j] == '-') {
                table += '<td class="teal lighten-4">' + '-' + '</td>';
            } else {
                table += '<td>' + Math.round((Number(matrix[i][j]) + Number.EPSILON) * 100) / 100 + '</td>';
            }
        }
        table += '</tr>';
    }
    table += '</tbody></table></div>';
    return table;
}

// Método para imprimir los vecinos cercanos de cada usuario
function printNeighbours(neighboursVector) {
    let print = '<div class="col s8 offset-s2">';
    for (let i = 0; i < neighboursVector.length; i++){
        print += '<p>Para el <b>Usuario '+ (neighboursVector[i][0] + 1) + '</b> con el <b>item ' + (neighboursVector[i][1] + 1) + '</b> los <b>vecinos seleccionados son: ';
        for (let j = 0; j < neighboursVector[i][2].length; j++) {
            if (j == neighboursVector[i][2].length - 1) print += (neighboursVector[i][2][j].index + 1) + '. </b></p>';
            else print += (neighboursVector[i][2][j].index + 1) + ', ';
        }
    }
    print += '</div>';
    return print;
}

// Método para imprimir los cálculos de predicciones de cada usuario
function printCalculatePredictions(predictionsVector, metricType) {
    let print = '<div class="col s8 offset-s2">';
    for (let i = 0; i < predictionsVector.length; i++){
        print += '<p>Cálculo de predicción del <b>Usuario '+ (predictionsVector[i][0] + 1) + '</b> con el <b>item ' + (predictionsVector[i][1] + 1) + '</b>: <b>';
        if (metricType == "Simple") {
            print += Math.round((parseFloat(predictionsVector[i][2]) + Number.EPSILON) * 100) / 100 + ' / ' +
            Math.round((parseFloat(predictionsVector[i][3]) + Number.EPSILON) * 100) / 100 + ' = ' + 
            Math.round((parseFloat(predictionsVector[i][4]) + Number.EPSILON) * 100) / 100 + '. </b></p>';
        }
        else {
            print += Math.round((parseFloat(predictionsVector[i][2]) + Number.EPSILON) * 100) / 100 + ' + (' + 
            Math.round((parseFloat(predictionsVector[i][3]) + Number.EPSILON) * 100) / 100 + ' / ' + 
            Math.round((parseFloat(predictionsVector[i][4]) + Number.EPSILON) * 100) / 100 + ')' + ' = ' +
            Math.round((parseFloat(predictionsVector[i][5]) + Number.EPSILON) * 100) / 100 + '. </b></p>';
        }
    }
    print += '</div>';
    return print;
}