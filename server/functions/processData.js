// const { json } = require('express');
const fs = require('fs');
// const path = require('path');

module.exports = {
    getDeweyData: async function (rawData) {

        console.log('start processing raw data...');
        // console.log('rawData', rawData);

        /*
            A chaque oeuvre est attribuée un indice dewey (de 0 à 9) qui la classe dans un domaine de la littérature, ainsi qu'un indice sub-dewey (de 000 à 999) qui la classe dans un sous-domaine au sein de cette catégorie dewey.
            
            Pour plus d'informations sur la classification Dewey : https://fr.wikipedia.org/wiki/Liste_des_classes_de_la_Classification_d%C3%A9cimale_de_Dewey
    
            La réponse de l'API Gallica nous dit combien de fois l'auteur choisi a été cité dans les oeuvres de telle et telle sous-catégorie sub-dewey.
            
            On veut rendre compte des catégories dewey. 
            Si l'indice sub-dewey est 572 - Biochimie , 
            l'oeuvre appartient à la catégorie dewey 5 - Sciences de la nature et Mathématiques.
            
            Il nous suffit de cumuler le nombre de citations dans chaque sous-catégorie sous-dewey appartenant à la même catégorie dewey, pour obtenir le nombre de citations de l'auteur dans chaque catégorie dewey.
    
        */


        // filtrer les données pour ne garder que les données concernant les sdeweys
        let sdeweysData = rawData
            // Extraction des données concernant les catégories sdeweys
            .filter(data => data.value === 'sdewey')
            // Réordonner les catégories sdewey dans l'ordre numérique croissant
            // "cleanValue": indice subdewey de la donnée
            .sort((a, b) => parseFloat(a.cleanValue) - parseFloat(b.cleanValue));

        console.log("Sous-catégories sdeweys des données récupérées.");
        //* console.log(sdeweysData);



        // initialise un tableau pour les 10 catégories Dewey.
        let orderedDeweysCounts = Array(10).fill(0, 0); 
        console.log("Tableau pour les deweys initialisé.");
        //* console.log(orderedDeweysCounts);

        // Un forEach parcoure le tableau des sous-catégories sdeweys et cumule les valeurs appartenant à la même catégorie dewey dans le tableau initialisé.
        sdeweysData.forEach(sdeweyData => {
            let dewey = Number(sdeweyData.cleanValue.charAt(0));
            let sdewey = Number(sdeweyData.cleanValue);
            let quotesCount = Number(sdeweyData.howMany);

            //* console.log(dewey, ' => ', sdewey, ': ', quotesCount, ' occurrences.');

            // incrémenter les valeurs dans le tableau qui compte les citations dans chaque catégorie Dewey.
            orderedDeweysCounts[dewey] += quotesCount;

        })
        console.log("Tableau des citations dans chaque dewey rempli.")
        console.log(orderedDeweysCounts);


        // Total des citations
        let quotesTotal = orderedDeweysCounts.reduce((prev, current) => {
            return prev + current;
        }, 0);
        console.log('Total des citations: ', quotesTotal)



        // Injection des données récupérées via l'API dans une copie du modèle
        function injectDeweyDataToJson(model, quotesTotal, orderedDeweysCounts) {

            let json = JSON.parse(model);

            // injecter le total des citations
            json['value'] = quotesTotal;
            
            // injecter le total des citations pour chaque catégorie dewey
            for (let i = 0; i < orderedDeweysCounts.length; i++) {
                json['children'][i]['value'] = orderedDeweysCounts[i];
            }

            return json;

        }


        // Chargement du modèle Dewey qui servira à charger les informations dans le DOM, une fois les données injectées
        const DEWEYS_MODEL = fs.readFileSync('../server/data/deweys.json', 'utf8');

        
        const processedData = injectDeweyDataToJson(DEWEYS_MODEL, quotesTotal, orderedDeweysCounts);

        return processedData;
    }
}