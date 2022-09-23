import getDataFromServer from "./getDataFromServer.js";
// import processData from './processData.js';
import injectWikiData from "./injectWikiData.js";
import emptyData from "./emptyData.js";

import draw from './draw.js';

const selectOptions = document.querySelectorAll('#author-sel option');



async function getData(author) {
    // Récupération des données obtenues par le serveur
    let authorData = await getDataFromServer(author);
    console.log(author, authorData); 
    return authorData;
}



// Écouteurs de clics
selectOptions.forEach(option => {
    option.addEventListener('click', (event) => {
        let author = event.target.value;

        if(author == "0") {
            
            emptyData();
            document.querySelector('#please-select').textContent = "Sélectionnez un auteur dans la liste";   
        
        } else {
            
            let authorData = getData(author)
            .then(authorData => {
                injectWikiData(authorData)
                draw(authorData)
            });
        }
        
        
    });
});