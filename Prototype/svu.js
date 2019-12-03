var gender = "all", age = "all", rating = "all", appearances = "all";
const root = "../Pipeline"

const currpath = () => {
    console.log(`${gender} ${age} ${appearances} ${rating}`)
    return `${root}/gender_${gender}/age_${age}/${appearances}_apps/${rating}_rating`;
}

/* BUTTONS */

function setGender(newGender) {
    gender = setFilter("gender", newGender, gender);
    updateVis();
}

function setAge(newAge) {
    age = setFilter("age", newAge, age);
    updateVis();
}

function setAppearances(newApp) {
    appearances = setFilter("appearances-css", newApp, appearances);
    updateVis();
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

var timelineProps = {}, appearancesProps = {};

/* LOAD DATA */
async function loadTimeline() {
    var props = await timelineProps;

    props.groupYear = await d3.json(`${currpath()}/stats_freq_rating.json`);

    //groupYear.sort((a, b) => Number(a.year) - Number(b.year));
    return props
}

function genTimeline(props) {
    var { groupYear } = props;
    var w = props.w = 800;
    var h = props.h = 400;
    var padding = props.padding = 30;
    var barwidth = props.barwidth = Math.floor((w - padding * 2) / groupYear.length) - 1;
    var maxheight = props.maxheight = h - padding;
    var hscale = props.hscale = d3.scaleLinear()
        .domain([0, 100])
        .range([maxheight - 0, maxheight - maxheight]);
    var xscale = props.xscale = d3.scaleLinear()
        .domain([0, groupYear.length])
        .range([padding, w - padding]); // we are adding our padding to our width scale

    var cscale = props.cscale = d3.scaleLinear() // let us create a new scale for color
        .domain([
            d3.min(groupYear, d => d.freq),
            d3.max(groupYear, d => d.freq)
        ])
        .range(["yellow", "orange"]);

    var svg = props.svg = d3.select("#the_chart")
        .append("svg") // we are appending an svg to the div 'the_chart'
        .attr("width", w)
        .attr("height", h);

    var yaxis = props.yaxis = d3.axisLeft() // we are creating a d3 axis
        .scale(hscale) // fit to our scale
        .tickFormat(d3.format("d"));
    svg.append("g") // we are creating a 'g' element to match our yaxis
        .attr("transform", "translate(30,0)") // 30 is the padding
        .attr("class", "yaxis") // we are giving it a css style
        .call(yaxis);

    var xaxis = props.xaxis = d3.axisBottom() // we are creating a d3 axis
        .scale(d3.scaleLinear()
            .domain([groupYear[0].year, groupYear[groupYear.length - 1].year])
            // values from movies' years
            .range([padding + barwidth / 2, w - padding - barwidth / 2])) // we are adding our padding
        .ticks(groupYear.length);
    svg.append("g") // we are creating a 'g' element to match our x axis
        .attr("transform", "translate(0," + maxheight + ")")
        .attr("class", "xaxis") // we are giving it a css style
        .call(xaxis);

    svg.selectAll("rect")
        .data(groupYear)
        .enter().append("rect")
        .attr("width", Math.floor((w - padding * 2) / groupYear.length) - 1)
        .attr("height", d => maxheight - hscale(d.rating)) // this was inverted
        .attr("fill", (d, i) => cscale(d.freq)) // fill chosen by scale
        .attr("x", (d, i) => xscale(i))
        .attr("y", d => hscale(d.rating)); // this was inverted

    svg.selectAll("rect").append("title") // adding a title for each bar
        .data(groupYear)
        .text(d => d.title);

    return props
}

function updateTimeline(props) { // click event
    var { groupYear, w, h, padding, maxheight, barwidth, svg, cscale, xscale, hscale, xaxis } = props;
    cscale.domain([
        d3.min(groupYear, d => d.freq),
        d3.max(groupYear, d => d.freq)
    ])
    svg.selectAll("rect") // same code, but now we only change values
        .data(groupYear)
        .transition() // add a smooth transition
        .duration(1000)
        .attr("height", d => maxheight - hscale(d.rating)) // this was inverted
        .attr("fill", (d, i) => cscale(d.freq)) // fill chosen by scale
        .attr("x", (d, i) => xscale(i))
        .attr("y", d => hscale(d.rating)) // this was inverted
        .select("title")
        .text(d => d.title);
    xaxis.scale(d3.scaleLinear()
        .domain([groupYear[0].year, groupYear[groupYear.length - 1].year])
        // values from movies' years
        .range([padding + barwidth / 2, w - padding - barwidth / 2])) // we are adding our padding
    d3.select(".xaxis")
        .call(xaxis);

    return props;
}

async function loadAppearances() {
    var props = await appearancesProps;

    props.data = await d3.json(`${currpath()}/pie_chart_persondetails.json`);

    return props;
}

function genAppearances(props) {
    // set the dimensions and margins of the graph
    var width = props.width = 450
    var height = props.height = 300
    var margin = props.margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = props.radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = props.svg = d3.select("#second_chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // set the color scale
    var color = props.color = d3.scaleOrdinal()
        .domain([2, 6])
        .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = props.pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d.value)
    var dataReady = props.dataReady = pie(d3.entries(props.data))

    // The arc generator
    var arc = props.arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = props.outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('allSlices')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.key))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .attr("id", d => `${d.data.key}`) // we are giving it a css style
        .attr("class", "appearances-css") // we are giving it a css style
        .on("click", (d) => {
            setAppearances(`${d.data.key}`)
        })
    // Add the polylines between chart and labels:
    svg.selectAll('allPolylines')
        .data(dataReady)
        .enter()
        .append('polyline')
        .attr("stroke", "black")
        .style("fill", "none")
        .attr("stroke-width", 1)
        .attr('points', d => {
            var posA = arc.centroid(d) // line insertion in the slice
            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg.selectAll('allLabels')
        .data(dataReady)
        .enter()
        .append('text')
        .text(d => `${d.data.key} appearances`)
        .attr('transform', d => {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', d => {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

    return props
}

function updateAppearances(props) {
    var { width, height, radius, margin, barwidth, svg, color, arc, outerArc } = props;

    // set the color scale
    var color = props.color = d3.scaleOrdinal()
        .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
        .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    var pie = props.pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d.value)
    var dataReady = props.dataReady = pie(d3.entries(props.data))

    // The arc generator
    var arc = props.arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = props.outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('path')
        .data(dataReady)
        .transition() // add a smooth transition
        .duration(1000)
        .attr('d', arc)

    // Add the polylines between chart and labels:
    svg.selectAll('polyline')
        .data(dataReady)
        .transition()
        .duration(1000)
        .attr('points', d => {
            var posA = arc.centroid(d) // line insertion in the slice
            var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            var posC = outerArc.centroid(d); // Label position = almost the same as posB
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
        })

    // Add the polylines between chart and labels:
    svg.selectAll('text')
        .data(dataReady)
        .transition() // add a smooth transition
        .duration(1000)
        .attr('transform', d => {
            var pos = outerArc.centroid(d);
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
        })
        .style('text-anchor', d => {
            var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
        })

    return props
}

timelineProps = loadTimeline().then(genTimeline)
appearancesProps = loadAppearances().then(genAppearances)

function updateVis() {
    timelineProps = loadTimeline().then(updateTimeline)
    appearancesProps = loadAppearances().then(updateAppearances)
}