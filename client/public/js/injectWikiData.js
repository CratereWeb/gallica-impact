export default function injectWikiData(authorData) {
    
    document.querySelector('#please-select').textContent = "";   
    
    document.querySelector('#total-score').textContent = authorData.gallica.value;

    document.querySelector('#author-name').textContent = authorData.wiki.name;

    document.querySelector('#author-img').src = authorData.wiki.portrait;

    document.querySelector('#author-dates').textContent = `(${authorData.wiki.bornin} - ${authorData.wiki.diedin})`;

}