export default function draw(authorData) {
    console.log(`start drawing for : ${authorData.wiki.name}`);

    document.getElementById("dataviz").textContent= "";

    let gallicaData = authorData.gallica;


    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
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


    // Give the data to this cluster layout:
    const root = d3.hierarchy(gallicaData).sum(function (d) { return d.value + 280 }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .tile(d3.treemapSquarify.ratio(gallicaData))
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
        .attr("x", function (d) { return d.x0 + 10 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 40 })    // +20 to adjust position (lower)
        .text(function (d) { return d.data.value + ' ' })
        .attr("font-size", "40px")
        .attr("fill", "white")
}


