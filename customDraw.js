const authors = [
  {
    "name": "Charles Baudelaire",
    "bornin": 1821,
    "diedin": 1867,
    "portrait": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/%C3%89tienne_Carjat%2C_Portrait_of_Charles_Baudelaire%2C_circa_1862.jpg/284px-%C3%89tienne_Carjat%2C_Portrait_of_Charles_Baudelaire%2C_circa_1862.jpg",
  },
  {
    "name": "Emile Zola",
    "bornin": 1840,
    "diedin": 1902,
    "portrait": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Emile_Zola_1902.jpg/173px-Emile_Zola_1902.jpg"
  },
  {
    "name": "Jules Verne",
    "bornin": 1828,
    "diedin": 1905,
    "portrait": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/F%C3%A9lix_Nadar_1820-1910_portraits_Jules_Verne.jpg/284px-F%C3%A9lix_Nadar_1820-1910_portraits_Jules_Verne.jpg?uselang=fr"
  },
  {
    "name": "Jack London",
    "bornin": 1876,
    "diedin": 1916,
    "portrait": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Jack_London_young.jpg/284px-Jack_London_young.jpg?uselang=fr"
  },
  {
    "name": "Ernest Hemingway",
    "bornin": 1899,
    "diedin": 1961,
    "portrait": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/284px-ErnestHemingway.jpg?uselang=fr"
  },
  {
    "name": "Charles Bukowski",
    "bornin": 1920,
    "diedin": 1994,
    "portrait": "https://www.apar.tv/wp-content/uploads/2020/05/o-bukowski014sj5-facebook.jpg"
  },
  {
    "name": "Charles Bukowski",
    "bornin": 1920,
    "diedin": 1994,
    "portrait": "https://www.apar.tv/wp-content/uploads/2020/05/o-bukowski014sj5-facebook.jpg"
  },
]

let authorImg = document.getElementById('author-img');
let authorName = document.getElementById('author-name');
let authorDates = document.getElementById('author-dates');
let totalScore = document.querySelector('#total-score');

/*
    La constante dataPattern est le modèle des données utilisées par la Treemap,
    C'est dans ce tableau d'objets qu'on va injecter les valeurs extraites de la réponse API Gallica.
*/
const DATA_PATTERN = {
  "name": "Oeuvres",
  "value": 11565,
  "children": [
        {
            "name": "Généralités",
            "group": "0",
            "value": 560,
            "colname": "0",
            "color": "#A6D7F2"
        },
        {
            "name": "Philosophie et psychologie",
            "group": "1",
            "value": 200,
            "colname": "1",
            "color": "#436AF1"
        },
        {
            "name": "Religion",
            "group": "2",
            "value": 50,
            "colname": "2",
            "color": "#994CFB"
        },
        {
            "name": "Économie et société",
            "group": "3",
            "value": 120,
            "colname": "3",
            "color": "#F8E434"
        },
        {
            "name": "Langues",
            "group": "4",
            "value": 200,
            "colname": "4",
            "color": "#FDBDDC"
        },
        {
            "name": "Sciences",
            "group": "5",
            "value": 415,
            "colname": "5",
            "color": "#B0DA08"
        },
        {
            "name": "Techniques",
            "group": "6",
            "value": 548,
            "colname": "6",
            "color": "#F0950D"
        },
        {
            "name": "Arts et loisirs",
            "group": "7",
            "value": 121,
            "colname": "7",
            "color": "#FF22A7"
        },
        {
            "name": "Littérature",
            "group": "8",
            "value": 2540,
            "colname": "8",
            "color": "#CC0B0B"
        },
        {
            "name": "Histoire et géographie",
            "group": "9",
            "value": 2575,
            "colname": "9",
            "color": "#17AF8A"
        }
    ]
}


function authorToQuery(author) {
  authorImg.src = "";
  authorName.textContent = "";
  authorDates.textContent = "";
  totalScore.textContent = "00000";
  let req = `https://gallica.bnf.fr/services/Categories?SRU=(gallica%20all%20%22${author}%22)`;
  document.getElementById('dataviz').innerHTML = '';
  getDataThenDraw(req)
  getAuthorPortrait(author)
}

function getAuthorPortrait(author) {
  // console.log(author)
  
  authors.forEach(aut => {
    if(aut['name'] === author) {
      authorImg.src = aut['portrait'];
      // console.log('changed portrait')
      authorName.textContent = aut['name'];
      // console.log('changed name')
      authorDates.textContent = `(${aut['bornin']}-${aut['diedin']})`;
      // console.log('changed dates')
    }
  })  
}

function getDataThenDraw(req) {
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1300 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);


          
    let res = fetch(req)
      .then(function(res) {
          // Récupère et formate la réponse complète à la requête API
          return res.json();
      })
      .then(function(apiData) {
          console.log("Réponse API brute", apiData);
                                  // Extrait de la réponse les données concernant les catégories sdewey
          let sdeweys = apiData   .filter(data => data.value === 'sdewey')
                                  // réordonne les catégories sdewey dans l'ordre numérique croissant (de 0xx à 9xx)
                                  // "cleanValue" : indice sdewey de la donnée.
                                  .sort((a,b) => parseFloat(a.cleanValue) - parseFloat(b.cleanValue))
          console.log("Sous-catégories sdewey", sdeweys);

          
          // Cumuler les sous-catégories sdeweys appartenant à la même catégorie dewey (de 0 à 9).
          // Un forEach parcoure le tableau des sous-catégories sdeweys et cumule les valeurs appartenant à la même catégorie dewey.
          // L'itérateur deweyIndex s'incrémente à chaque fois que la catégorie dewey change.
          let deweyIndex = 0;
          let deweys = [];
          let total = 0;
          sdeweys.forEach(sdewey => {
              let dewey = sdewey.cleanValue.charAt(0);
              
              if(dewey >= deweyIndex) {
                console.log('NEW DEWEY : ' + dewey);
                console.log(sdewey.cleanValue + ' : ' + sdewey.howMany);
                deweys[dewey.toString()] = sdewey.howMany;
                deweyIndex++;
              } else {
                console.log(sdewey.cleanValue + ' : ' + sdewey.howMany);
                deweys[dewey.toString()] += sdewey.howMany;
              }
              
              if(deweys[deweyIndex.toString()] === undefined){
                deweys[deweyIndex.toString()] = 0;
              }
              
              total += sdewey.howMany;

          })
        deweys.pop(deweys.length)
        console.log(deweys)
        totalScore.textContent = total;
        console.log('TOTAL : ' + total)

        
        // injectDataToJson(deweys)
        
        /*
        0: 1004
        1: 515
        2: 0
        3: 572
        4: 0
        5: 181
        6: 204
        7: 234
        8: 5465
        9: 2578
        */
        let finalData = DATA_PATTERN;
        // console.log(finalData)
        for(let i=0; i < deweys.length; i++){
          finalData['children'][i]['value'] = deweys[i];
        }
        // console.log(finalData)
        drawDataviz(finalData)
        
        
    })

// function injectDataToJson(data, pattern) {
  
//   console.log(data);

//   console.log(pattern)

//   drawDataviz(pattern)
  
// }


function drawDataviz(finalData) {
  // read json data
  // d3.json('./data-pattern.json').then(function(data) {

  // Give the data to this cluster layout:
  const root = d3.hierarchy(finalData).sum(function(d){ return d.value +280}) // Here the size of each leave is given in the 'value' field in input data

  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .tile(d3.treemapSquarify.ratio(finalData))
    .size([width, height])
    .padding(2)
    (root)

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .join("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
    //   .style("stroke", "black")
      .style("fill", function (d) { /*console.log(d);*/ return d.data.color; })

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .join("text")
      .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+40})    // +20 to adjust position (lower)
      .text(function(d){ return d.data.value + ' '})
      .attr("font-size", "40px")
      .attr("fill", "white")
  }
}

// }
    
function drawDatavizDeweys(deweys) {
  console.log("DEWEYS ", deweys);
  
}
function drawDatavizSubDeweys(sdeweys) {
  console.log("SUB-DEWEYS ", sdeweys);
  
}

document.querySelectorAll('#author-sel option').forEach(opt => {
  console.log(opt.value)
  opt.addEventListener('click', () => {
    console.log(opt.value)
    authorToQuery(opt.value)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  authorToQuery('Charles Baudelaire');
});