export default async function getDataFromServer(author) {
    
    // requête au serveur 
    try {
        //- Requête vers la route /author/:author
        const response = await fetch(`http://localhost:5000/author/${author}`);

        if (!response.ok) {
            const message = `Une erreur est survenue : ${response.statusText}`;
            window.alert(message);
            return;
        }

        const data = await response.json();

        //- une fois les données reçues
        console.log("Les données sont arrivées côté client.");
        // console.log(data);

        return data;

    } catch (err) {
        console.log(err)
    }



}