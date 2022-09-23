
// Requête API Gallica
//! Fetch n'est pas supportée par Node.js pour le moment.
//* Les requêtes HTTP sont faites grâce au module Axios.

const axios = require("axios");

module.exports = {
    getData: async function (author) {
        console.log(`getting Gallica data for : ${author}`);

        try {
            const response = await axios.get(`https://gallica.bnf.fr/services/Categories?SRU=(gallica%20all%20%22${author.replace(' ', '%20')}%22)`);
            const rawData = await response.data;
            
            // console.log(data);
            // console.log(`Données concernant ${author} : récupérées sur l'API Gallica.`);
            return rawData;

        } catch(err) { console.log(err); } 

    }
}