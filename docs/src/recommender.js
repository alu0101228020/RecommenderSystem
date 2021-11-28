class Recommender {
    constructor(utilityMatrix, metricType, numberOfNeighbours, predictionType) {
        this.utilityMatrix= utilityMatrix; // Matriz de utilidad
        this.metricType = metricType; // Tipo de métrica
        this.numberOfNeighbours = numberOfNeighbours; // Número de vecinos
        this.predictionType = predictionType; // Tipo de predicción
        this.similarityMatrix = []; // Matriz de similitud
        this.closeNeighbours = []; // Vecinos más cercanos
        this.calculatePredictions = []; // Cálculos de predicciones
    }
    // Getter de matriz de utilidad
    getUtilityMatrix() {
        return this.utilityMatrix;
    }
    // Getter de matriz de similitud
    getSimilarityMatrix(){
        return this.similarityMatrix;
    }
    // Getter de vecinos cercanos
    getCloseNeighbours() {
        return this.closeNeighbours;
    }
    // Getter de tipo de métrica
    getMetricType() {
        return this.predictionType;
    }
    // Getter de cálculos de predicciones
    getCalculatePredictions() {
        return this.calculatePredictions;
    }
    // Setter de matriz de utilidad
    setUtilityMatrix(utilityMatrix) {
        this.utilityMatrix = utilityMatrix;
    }
    // Setter de matriz de similitud que nos permite realizar la matriz de similitud según la métrica seleccionada
    setSimilarityMatrix() {
        let similarityMatrix = [];
        for (let i = 0; i < this.utilityMatrix.length; i++){
            similarityMatrix.push([]);
            for (let k = 0; k < this.utilityMatrix.length; k++) {
                if (this.metricType == 'Pearson') {
                    similarityMatrix[i][k] = this.pearson(i, k);
                }
                if (this.metricType  == 'Coseno') {
                    similarityMatrix[i][k] = this.cosine(i, k);
                }
                if (this.metricType  == 'Euclidea') {
                    similarityMatrix[i][k] = this.euclidean(i, k);
                }
            }
        }
        this.similarityMatrix = similarityMatrix;
    }
    // Setter de tipo de métrica
    setMetricType(metricType) {
        this.metricType = metricType;
    }
    // Setter de número de vecinos
    setNumberOfNeighbours(numberOfNeighbours) {
        this.numberOfNeighbours = numberOfNeighbours;
    }
    // Setter de tipo de predicción
    setPredictionType(predictionType) {
        this.predictionType = predictionType;
    }
    // Método para vaciar el atributo de vecinos cercanos
    emptyCloseNeighbours() {
        this.closeNeighbours = [];
    }
    // Método para vaciar el atributo de cálculos de predicciones
    emptyCalculatePredictions() {
        this.calculatePredictions = [];
    }
    // Método que nos permite encontrar los items no calificados, es decir, los guiones
    emptyItem() {
        let items = [];
        for (let i = 0; i < this.utilityMatrix.length; i++) {
            for (let j = 0; j < this.utilityMatrix[0].length; j++) {
                if (this.utilityMatrix[i][j] === '-') {
                    items.push([i,j]);
                }
            }
        }
        return items;
    }
    // Método que nos permite obtener la matriz resultante de utilidad con las predicciones según el tipo de predicción seleccionada
    recommend() {
        let predictionMatrix = [];
        let users = this.emptyItem();
        for (let i = 0; i < this.utilityMatrix.length; i++) {
            predictionMatrix[i] = this.utilityMatrix[i].slice();
        }
        for (let i = 0; i < users.length; i++){
            if (this.predictionType == 'Simple'){
                predictionMatrix[users[i][0]][users[i][1]] = this.simplePrediction(users[i][0], users[i][1]);
            }
            if (this.predictionType == 'Media'){
                predictionMatrix[users[i][0]][users[i][1]] = this.averagePrediction(users[i][0], users[i][1]);
            }
        }
        return predictionMatrix;
    }
    // Método que nos permite calcular los vecinos cercanos de cada usuario según el número de vecinos seleccionado
    calculateNeighbours(u,i) {
        let neighbours = [];
        let neighboursSelection= [];

        for (let j = 0; j < this.utilityMatrix.length; j++){
            if (u != j) neighbours.push({index: j, sim: this.similarityMatrix[u][j]});
        }

        if ((this.metricType == "Pearson") || (this.metricType == "Coseno")) neighbours.sort((a, b) => b.sim - a.sim);
        else neighbours.sort((a, b) => a.sim - b.sim);

        let j = 0;
        while(neighboursSelection.length < this.numberOfNeighbours && j < neighbours.length){
            if (this.utilityMatrix[neighbours[j].index][i] != '-') {
                neighboursSelection.push(neighbours[j]);
            }
            j++;
        }
        this.closeNeighbours.push([u,i,neighboursSelection]);
        return neighboursSelection;
    }
    // Método que nos permite realizar la media de items de un usuario
    getUserMean(i){
        const userCalifications = this.utilityMatrix[i];
        let numOfCalifications = 0;
        let sumCalifications = 0;

        for (let j = 0; j < userCalifications.length; j++) {
            if (userCalifications[j] != '-') {
                sumCalifications = sumCalifications + Number(userCalifications[j]);
                numOfCalifications++;
            }
        }
        return sumCalifications / numOfCalifications;
    }
    // Método que calcula la correlación de Pearson entre dos usuarios
    pearson(u,v) {
        let uMean = this.getUserMean(u);
        let vMean = this.getUserMean(v);

        let superiorResult = 0;
        let lowerResult1 = 0;
        let lowerResult2 = 0;

        for (let i = 0; i < this.utilityMatrix[v].length; i++) {
            let user = this.utilityMatrix[u][i];
            let neighbour = this.utilityMatrix[v][i];
            if ((user != '-') && (neighbour != '-')) {
                superiorResult += (user - uMean)*(neighbour - vMean);
                lowerResult1 += Math.pow((user - uMean),2);
                lowerResult2 += Math.pow((neighbour - vMean),2);
            }
        }
        let finalResult = superiorResult / (Math.sqrt(lowerResult1) * Math.sqrt(lowerResult2));
        // standardization(finalResult);
        return finalResult;
    }
    // Método que calcula la Distancia Coseno entre dos usuarios
    cosine(u,v) {
        let superiorResult = 0;
        let lowerResult1 = 0;
        let lowerResult2 = 0;

        for (let i = 0; i < this.utilityMatrix[v].length; i++) {
            let user = this.utilityMatrix[u][i];
            let neighbour = this.utilityMatrix[v][i];
            if ((user != '-') && (neighbour != '-')) {
                superiorResult += (user * neighbour);
                lowerResult1 += Math.pow(user,2);
                lowerResult2 += Math.pow(neighbour,2);
            }
        }

        let finalResult = superiorResult / (Math.sqrt(lowerResult1) * Math.sqrt(lowerResult2));
        return finalResult;
    }
    // Método que calcula la Distancia Euclídea entre dos usuarios
    euclidean(u,v) {
        let resultSuperior = 0;

        for (let i = 0; i < this.utilityMatrix[v].length; i++) {
            let user = this.utilityMatrix[u][i];
            let neighbour = this.utilityMatrix[v][i];
            if ((user != '-') && (neighbour != '-')) {
                resultSuperior += Math.pow((user - neighbour),2);
            }
        }

        let finalResult = Math.sqrt(resultSuperior);
        return finalResult;
    }
    /*standardization(result) {
        let xMin = -1;
        let xMax = 1;
        let a = 0;
        let b = 5;
        return (result = a + ((result - xMin) * (b - a)) / (xMax - xMin));
    }*/
    // Método de cálculo de predicción Simple
    simplePrediction(u,i) {
        let numberOfNeighbours = this.calculateNeighbours(u,i);
        let resultSuperior = 0;
        let lowerResult = 0;

        for (let z = 0; z < numberOfNeighbours.length; z++) {
            let item = this.utilityMatrix[numberOfNeighbours[z].index][i];
            resultSuperior += numberOfNeighbours[z].sim * item;
            lowerResult += Math.abs(numberOfNeighbours[z].sim);
        }

        let finalResult = resultSuperior / lowerResult;
        this.calculatePredictions.push([u, i, resultSuperior, lowerResult, finalResult]);
        return finalResult;
    }
    // Método de cálculo de predicción con la media
    averagePrediction(u,i) {
        let numberOfNeighbours = this.calculateNeighbours(u,i);
        let uMean = this.getUserMean(u);
        let vMean = 0;
        let resultSuperior = 0;
        let lowerResult = 0;

        for (let z = 0; z < numberOfNeighbours.length; z++) {
            vMean = this.getUserMean(numberOfNeighbours[z].index);
            let item = this.utilityMatrix[numberOfNeighbours[z].index][i];
            resultSuperior += numberOfNeighbours[z].sim * (item - vMean);
            lowerResult += Math.abs(numberOfNeighbours[z].sim);
        }

        let finalResult = uMean + (resultSuperior / lowerResult);
        this.calculatePredictions.push([u, i, uMean, resultSuperior, lowerResult, finalResult]);
        return finalResult;
    }
}