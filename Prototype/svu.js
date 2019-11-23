var gender = "all", age = "all", rating = "all";

function setGender(newGender) {
    gender = setFilter("gender", newGender, gender);
}

function setAge(newAge) {
    age = setFilter("age", newAge, age);
}

function setFilter(className, newV, currV) {
    let value = newV == currV ? "all" : newV;
    let els = document.getElementsByClassName(className);

    Array.from(els).forEach((el) => {
        el.classList.toggle("active", false)
    })
    if (value != "all")
        document.getElementById(value).classList.toggle("active", true);
    return value;
}

var groupYearFrequency, groupYearRating, groupYear = [];
d3.json("../Data/group_work_frequency.json")
    .then(data => groupYearFrequency = data)
    .then(() => {
        d3.json("../Data/group_work_rating.json")
            .then(function (data) {
                groupYearRating = data;
                for (year in groupYearRating)
                    groupYear.push({
                        year: year,
                        rating: groupYearRating[year],
                        frequency: groupYearFrequency[year]
                    });
                groupYear.sort((a, b) => Number(a.year) - Number(b.year));
                console.log(groupYear)
                genTimeline();
                genAppearences();
            })
    })


function genTimeline() {
    var w = 800;
    var h = 400;
    var padding = 30;
    var barwidth = Math.floor((w - padding * 2) / groupYear.length) - 1;
    var maxheight = h - padding;
    var hscale = d3
        .scaleLinear()
        .domain([0, 100])
        .range([maxheight - 0, maxheight - maxheight]);
    var xscale = d3
        .scaleLinear()
        .domain([0, groupYear.length])
        .range([padding, w - padding]); // we are adding our padding to our width scale

    var cscale = d3.scaleLinear() // let us create a new scale for color
        .domain([
            d3.min(groupYear, d => d.frequency),
            d3.max(groupYear, d => d.frequency)
        ])
        .range(["white", "black"]);

    var svg = d3
        .select("#the_chart")
        .append("svg") // we are appending an svg to the div 'the_chart'
        .attr("width", w)
        .attr("height", h);

    var yaxis = d3.axisLeft() // we are creating a d3 axis
        .scale(hscale) // fit to our scale
        .tickFormat(d3.format("d"));
    svg.append("g") // we are creating a 'g' element to match our yaxis
        .attr("transform", "translate(30,0)") // 30 is the padding
        .attr("class", "yaxis") // we are giving it a css style
        .call(yaxis);

    var xaxis = d3.axisBottom() // we are creating a d3 axis
        .scale(d3.scaleLinear()
            .domain([groupYear[0].year, groupYear[groupYear.length - 1].year])
            // values from movies' years
            .range([padding + barwidth / 2, w - padding - barwidth / 2])) // we are adding our padding
    svg.append("g") // we are creating a 'g' element to match our x axis
        .attr("transform", "translate(0," + maxheight + ")")
        .attr("class", "xaxis") // we are giving it a css style
        .call(xaxis);

    svg.selectAll("rect")
        .data(groupYear)
        .enter().append("rect")
        .attr("width", Math.floor((w - padding * 2) / groupYear.length) - 1)
        .attr("height", d => maxheight - hscale(d.rating) // this was inverted
        )
        .attr("fill", (d, i) => cscale(d.frequency) // fill chosen by scale
        )
        .attr("x", (d, i) => xscale(i))
        .attr("y", d => hscale(d.rating) // this was inverted
        );

    svg.selectAll("rect").append("title") // adding a title for each bar
        .data(groupYear)
        .text(d => d.title);
}

function genAppearences() {
    // set the dimensions and margins of the graph
    var width = 450
    var height = 450
    var margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#second_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    var data = { a: 9, b: 20, c: 30, d: 8, e: 12, f: 3, g: 7, h: 14 }

    // set the color scale
    var color = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
        .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(function (d) { return d.value; })
    var data_ready = pie(d3.entries(data))

    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('allSlices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) { return (color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
}