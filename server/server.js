
const express = require('express');
const app = express();

const axios = require('axios');
const cors = require('cors');
// const router = express.Router();
const path = require('path');

const gallica = require('./functions/gallica');
const wiki = require('./functions/wiki');
const processData = require('./functions/processData');

// PORT 
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('../client/public'));


// ROUTES
app.get('/', (req, res) => {
    console.log('Connexion utilisateur au chemin /')
    res.send('index.html');
});

app.get('/author/:author', (req, res) => {
    let author = req.params.author
    console.log('author: '+author);

    let authorData = {};
    let authorDataWiki = wiki.getData(author).then(wiki => authorData.wiki = wiki); // Object: { wiki: {...} }
    let authorDataFromGallica = gallica.getData(author)
        .then(rawGallicaData => {
            console.log('\nLes données brutes sont arrivées au fichier server.js', '\nTraitement des données pour extraire les catégories dewey citées...');
                       
            return processData.getDeweyData(rawGallicaData); 
 
        })
        .then(processedGallicaData => {
            // console.log(processedData);
            authorData.gallica = processedGallicaData; 
            console.log(authorData); // Object: { wiki: {...}, gallica: {...}}
            console.log("Envoi des données au front...");
            res.send(authorData); //- L'objet contenant toutes les données relatives à l'auteur est envoyé au front
        })
});

// LANCEMENT DU SERVEUR SUR LE PORT
app.listen(port, () => {
    console.log(`Serveur lancé sur le port ${port}`);
});