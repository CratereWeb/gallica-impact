
// Requête API Gallica
//! Fetch n'est pas supportée par Node.js pour le moment.
//* Les requêtes HTTP sont faites grâce au module Axios.

const fs = require("fs");

module.exports = {
    getData: async function (requestedAuthor) {
        console.log(`getting wiki for : ${requestedAuthor}`);
        
        
        try {
            var wiki;

            const file = fs.readFileSync('../server/data/wiki.json', 'utf8');
            const json = JSON.parse(file);
            json.forEach(authorWiki => {
                if(authorWiki.name === requestedAuthor) {
                    wiki = authorWiki;
                }
            });
        
            return wiki;

        } catch(err) { console.log(err); } 

        

    }
}