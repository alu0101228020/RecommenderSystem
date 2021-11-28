# Práctica de Gestión del Conocimiento en las Organizaciones

## Sistemas de recomendación

### Autor: Dayana Armas Alonso (alu0101228020)

Ejecución del programa del sistema de recomendación: https://alu0101228020.github.io/RecommenderSystem/

####1. Introducción

En este repositorio esta la práctica de Sistemas de recomendación que tiene como propósito realizar un sistema recomendador que implemente filtrado colaborativo basado en usuarios.

Para desarrollar esta práctica he utilizado el lenguaje de **JavaScript**, **CSS* y **HTML**. También se ha utilizado el framework de **Materialize** para darle mejor estilo al código HTML.

####2. Estructura de directorios

Dentro de la carpeta **docs** contamos con los siguientes directorios y ficheros:

- examples: Es un directorio que incluye diferentes ejemplos de matrices de utilidad con las que se puede comprobar el correcto funcionamiento del programa.

- src: Es un directorio que almacena el fichero **form.js** que permite mostrar el formulario donde el usuario debe introducir los datos para que luego se le muestre los resultados y el fichero **recommender.js** que define la clase Recommender que implementa el sistema de recomendación.

- index.html: Es el fichero en HTML que permite crear la página web.

- style.css: Es la hoja de estilo style.css que define el estilo de presentación del documento HTML.

####3. Descripción del código desarrollado

####Clase Recommender (fichero recommender.js)

Esta clase corresponde a la clase del sistema de recomendador donde contamos con los siguientes atributos:

- utilityMatrix: Corresponde a la matriz de utilidad del fichero introducido donde tenemos como fila los usuarios y como columnas las valoraciones numéricas y las valoraciones vacías representadas como '-'.

- metricType: Corresponde a una cadena de texto con el tipo de métrica seleccionada que puede ser Pearson, Coseno y Euclidea.

- numberOfNeighbours: Corresponde al número de vecinos más cercanos que se ha seleccionado que es de tipo numérico.

- predictionType: Corresponde a una cadena de texto con el tipo de predicción seleccionada que puede ser Simple o Media.

- similarityMatrix: Corresponde a la matriz de similitud que ha sido calculada y almacenada donde tenemos tanto en las filas como en las columnas los valores de similitud entre usuarios.

- closeNeighbours: Corresponde a una matriz con los valores de usuario, ítem de valoración y un vector con los vecinos cercanos a ese usuario. Esto nos servirá para imprimir los vecinos seleccionados en el proceso de predicción.

- calculatePredictions: Corresponde a una matriz con los cálculos de las predicciones con los valores de usuario, ítem de valoración, resultado superior de la ecuación de predicción, resultado inferior de la ecuación de la predicción, la media de usuario (solo en el caso de la ecuación de la predicción Media) y el resultado final de dicha predicción.
