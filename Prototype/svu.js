var gender = "all", age = "all", rating = "all", appearances = "all", person = null, personName = "";
var personApp = null, personRating = null;
const root = "../Pipeline"
const rootN = "../PipelineNetwork"

const currpath = () => {
    console.log(`${gender} ${age} ${appearances} ${rating}`)
    return `${root}/gender_${gender}/age_${age}/${appearances}_apps/${rating}_rating`;
}

const currpathN = () => {
    console.log(`${gender} ${age} ${appearances} ${rating}`)
    return `${rootN}/gender_${gender}/age_${age}/${appearances}_apps/${rating}_rating`;
}

/* BUTTONS */

function setGender(newGender, update = true) {
    gender = setFilter("gender", newGender, gender, undefined, !update);
    if (update) updateVis();
}

function setAge(newAge, update = true) {
    age = setFilter("age", newAge, age, undefined, !update);
    if (update) updateVis();
}

function setAppearances(newApp, update = true) {
    appearances = setFilter("appearances-css", newApp, appearances, "a-", !update);
    if (update) updateVis();
}

function setRating(newRating, update = true) {
    rating = setFilter("rating-css", newRating, rating, "r-", !update);
    if (update) updateVis();
}

function setPerson(newPerson, update = true, updateNetwork = true) {
    person = newPerson;
    if (!person) { //se nao ha pessoa nova, apaga antiga
        document.getElementById("selected-person-txt").innerHTML = "None selected";
        document.getElementById("selected-person").classList.toggle("active", false);
        personRating = null;
        personApp = null;
    } else {
        document.getElementById("selected-person-txt").innerHTML = personName;
        document.getElementById("selected-person").classList.toggle("active", true);
        setGender('all', false);
        setAge('all', false);
        setAppearances('all', false);
        setRating('all', false);
    }
    if (update) updateVis(updateNetwork);
}

function setFilter(className, newV, currV, more = "", inchain = false) {
    let value = newV == currV ? "all" : newV;
    let els = document.getElementsByClassName(className);

    Array.from(els).forEach((el) => {
        el.classList.toggle("active", false)
    })
    if (value != "all")
        document.getElementById(`${more}${value}`).classList.toggle("active", true);
    if (!inchain) setPerson(null, false);
    return value;
}

function setPersonFilter(className, value, more) {
    let els = document.getElementsByClassName(className);

    Array.from(els).forEach((el) => {
        el.classList.toggle("disabled", false)
    })
    if (value != null) {
        Array.from(els).forEach((el) => {
            el.classList.toggle("disabled", true)
        })
        document.getElementById(`${more}${value}`).classList.toggle("disabled", false);
    }
}

var pieChart, groupYear, meanRatings, network;

var peopleDetails, peopleTimeline;

var dispatch = d3.dispatch("upTimeline", "upPie", "upTreemap", "upNetwork");

/* LOAD DATA */
async function loadTimeline() {
    if (!person) {
        groupYear = await d3.json(`${currpath()}/stats_freq_rating.json`);
    } else {
        groupYear = peopleTimeline[person];
    }
    dispatch.call("upTimeline");
}

function timeline() {
    var w = 600;
    var h = 200;
    var toppadding = 10;
    var bottompadding = 35;
    var padding = bottompadding + toppadding;
    var maxheight = h - padding;
    var hscale = d3.scaleLinear()
        .domain([0, 100])
        .range([maxheight + toppadding, toppadding]);
    var xscale = d3.scaleLinear()
        .domain([groupYear[0].year, groupYear[groupYear.length - 1].year])
        .range([60, w - toppadding * 2]); // we are adding our padding to our width scale

    var cscale = d3.scaleOrdinal(d3.schemeDark2)
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    var svg = d3.select("#timeline")
        .append("svg") // we are appending an svg to the div 'the_chart'
        .attr("width", w)
        .attr("height", h);

    var yaxis = d3.axisLeft() // we are creating a d3 axis
        .scale(hscale) // fit to our scale
        .tickFormat(d3.format("d"));
    svg.append("g") // we are creating a 'g' element to match our yaxis
        .attr("transform", "translate(" + 40 + ", 0)") // 30 is the padding
        .attr("class", "yaxis") // we are giving it a css style
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .style("fill", "black")
        .attr("y", -30)
        .attr("x", -5)
        .text("Work Frequency");

    var xaxis = d3.axisBottom() // we are creating a d3 axis
        .scale(xscale) // we are adding our padding
        .ticks(groupYear.length);
    svg.append("g") // we are creating a 'g' element to match our x axis
        .attr("transform", "translate(0," + (maxheight + toppadding) + ")")
        .attr("class", "xaxis") // we are giving it a css style
        .style("fill", "white")
        .call(xaxis)
        .append("text")
        .style("text-anchor", "end")
        .style("fill", "black")
        .attr("y", 28)
        .attr("x", 580)
        .text("Year related to SVU appearance");
    /*
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
    
            var y = d3.scaleLinear()
            .domain([0, 10])
            .range([ maxheight - 0, maxheight - maxheight]);
    svg.append("g")
      .call(d3.axisRight(y))
      .attr("transform", "translate(" + (w - padding) + ",0)")
      .append("text")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .style("fill", "black")
      .text("Work Frequency");*/
    // Lines
    svg.selectAll("myline")
        .data(groupYear)
        .enter()
        .append("line")
        .attr("x1", (d, i) => xscale(d.year))
        .attr("x2", (d, i) => xscale(d.year))
        .attr("y1", d => hscale(d.freq))
        .attr("y2", hscale(0))
        .attr("stroke", "grey")
        .attr("class", "lolilines")

    // Circles
    radius = 12
    svg.selectAll("mycircle")
        .data(groupYear)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xscale(d.year))
        .attr("cy", d => hscale(d.freq))
        .attr("r", radius)
        .style("fill", d => cscale(Math.round(d.freq / 10)))
        .attr("class", "lolicircles")

    svg.selectAll(".chartLineText")
        .data(groupYear)
        .enter()
        .append('text')
        .attr("class", "chartLineText")
        .style("fill", "white")
        .style("text-anchor", "middle")
        //.attr("transform", "translate(" + 30 + ",-2)")
        .attr("x", (d, i) => xscale(d.year))
        .text(function (d) { return Math.round(d.freq) / 10 })
        .attr("y", function (d) { return hscale(d.freq) + radius / 2 - 1; })
        .style("font-size", radius * 1.1 + "px");

    dispatch.on("upTimeline", (d) => { // click event
        svg.selectAll(".lolilines") // same code, but now we only change values
            .data(groupYear)
            .transition() // add a smooth transition
            .duration(1500)
            .attr("x1", (d, i) => xscale(d.year))
            .attr("x2", (d, i) => xscale(d.year))
            .attr("y1", d => hscale(d.freq))
            .attr("y2", hscale(0))
            .attr("stroke", "grey");

        svg.selectAll(".lolicircles") // same code, but now we only change values
            .data(groupYear)
            .transition() // add a smooth transition
            .duration(1500)
            .attr("cx", (d, i) => xscale(d.year))
            .attr("cy", d => hscale(d.freq))
            .attr("r", radius)
            .style("fill", d => cscale(Math.round(d.freq / 10)))

        svg.selectAll(".chartLineText")
            .data(groupYear)
            .transition()
            .duration(1500)
            .attr("x", (d, i) => xscale(d.year))
            .text(function (d) { return Math.round(d.freq) / 10 })
            .attr("y", function (d) { return hscale(d.freq) + radius / 2 - 1; })
            .style("font-size", radius * 1.2 + "px");
        /*  xaxis.scale(d3.scaleLinear()
              .domain([groupYear[0].year, groupYear[groupYear.length - 1].year])
              // values from movies' years
              .range([padding + barwidth / 2, w - padding - barwidth / 2])) // we are adding our padding
          d3.select(".xaxis")
              .call(xaxis);*/
    });
}








async function loadAppearances() {
    pieChart = await d3.json(`${currpath()}/pie_chart_persondetails.json`);
    if (person) {
        for (p in peopleDetails) {
            pdet = peopleDetails[p]
            if (pdet.id == person) {
                personApp = pdet["number_of_appearances"];
                break;
            }
        }
    }
    dispatch.call("upPie");
}

function appearancesPie() {
    // set the dimensions and margins of the graph
    var width = 500
    var height = 200
    var margin = 10

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#pie")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // set the color scale
    var color = d3.scaleOrdinal(d3.schemeDark2)
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .sort(null) // Do not sort group by size
        .value(d => d.value)
    var dataReady = pie(d3.entries(pieChart))

    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5)         // This is the size of the donut hole
        .outerRadius(radius * 0.8)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg.selectAll('allSlices')
        .data(dataReady)
        .enter()
        .append('path')
        .attr('d', arc)
        .each(d => { this._current = d; }) // store the initial angles
        .attr('fill', d => color(parseInt(d.data.key)))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .attr("id", d => `a-${d.data.key}`) // we are giving it a css style
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

    function arcTween(d) {
        var i = d3.interpolate(this._current, d);
        this._current = i(0);
        return function (t) {
            return arc(i(t))
        }
    }

    dispatch.on("upPie", (d) => { // click event
        dataReady = pie(d3.entries(pieChart))

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg.selectAll('path')
            .data(dataReady)
            .transition()
            .duration(1500)
            .attrTween('d', arcTween); // redraw the arcs

        // Add the polylines between chart and labels:
        svg.selectAll('polyline')
            .data(dataReady)
            .transition()
            .duration(1500)
            .attr('points', d => {
                var posA = arc.centroid(d) // line insertion in the slice
                var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                var posC = outerArc.centroid(d); // Label position = almost the same as posB
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })
            .style('opacity', d => d.data.value ? 1 : 0)

        // Add the polylines between chart and labels:
        svg.selectAll('text')
            .data(dataReady)
            .transition() // add a smooth transition
            .duration(1500)
            .attr('transform', d => {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('opacity', d => d.data.value ? 1 : 0)
            .style('text-anchor', d => {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
        setPersonFilter("appearances-css", personApp, "a-");
    });
}




async function loadTreeMap() {
    meanRatings = await d3.json(`${currpath()}/tree_map_persondetails.json`);
    if (person) {
        for (p in peopleDetails) {
            pdet = peopleDetails[p]
            if (pdet.id == person) {
                personRating = pdet["mean_rating"];
                break;
            }
        }
    }
    dispatch.call("upTreemap");
}

function treemap() {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 300 - margin.left - margin.right,
        height = window.innerHeight * (5 / 9) - margin.top - margin.bottom,
        color = d3.scaleOrdinal(d3.schemeDark2)
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);


    var svg = d3.select("#treemap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var root = d3.hierarchy(meanRatings).sum(function (d) { return Math.pow(d.size, 0.5) }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .padding(2)
        (root)

    // use this information to add rectangles:
    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .style("fill", d => color(parseInt(d.data.name)))
        .attr("id", d => `r-${d.data.name}`) // we are giving it a css style
        .attr("class", "rating-css") // we are giving it a css style
        .on("click", (d) => {
            setRating(`${d.data.name}`)
        })

    // and to add the text labels
    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
        .text(function (d) { return `${d.data.name}.0/10` })
        //.attr("font-size", "15px")
        .attr("fill", "white")
        .style("opacity", d => d.data.size ? '1' : '0')

    // A function that create / update the plot for a given variable:
    dispatch.on("upTreemap", (d) => { // click event
        root = d3.hierarchy(meanRatings).sum(function (d) { return Math.pow(d.size, 0.5) }) // Here the size of each leave is given in the 'value' field in input data

        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([width, height])
            .padding(2)
            (root);

        svg.selectAll("rect")
            .data(root.leaves())
            .transition()
            .duration(1500)
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr("stroke", "white")
            .style("stroke-width", "1px")
            .style("fill", d => color(parseInt(d.data.name)))

        // and to add the text labels
        svg.selectAll("text")
            .data(root.leaves())
            .transition()
            .duration(1500)
            .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) { return `${d.data.name}.0/10` })
            .style("opacity", d => d.data.size ? '1' : '0')

        setPersonFilter("rating-css", personRating, "r-");
    })
}


/* LOAD DATA */
async function loadRelations() {
    network = await d3.json(`${currpathN()}/network_chart_persondetails.json`);
    dispatch.call("upNetwork");
}

function relations() {
    var width = window.innerWidth - 10;
    var height = window.innerHeight - 70;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var canvas = document.getElementsByTagName('canvas')[0]
    canvas.width = width; canvas.height = height;
    var context = canvas.getContext("2d")

    var transform = d3.zoomIdentity,
        currentZoom;

    dispatch.on("upNetwork", (d) => {
        var nodes = network.nodes
        var nodess = network.nodes.map(e => parseInt(e.id))
        var links = network.links.map(e => {
            return ({
                "source": nodess.indexOf(parseInt(e.source)),
                "target": nodess.indexOf(parseInt(e.target)),
                "count": 1
            })
        }
        )

        var label = {
            'nodes': [],
            'links': []
        };

        network.nodes.forEach(function (d, i) {
            label.nodes.push({ node: d });
            label.nodes.push({ node: d });
            label.links.push({
                source: i * 2,
                target: i * 2 + 1
            });
        });

        var adjlist = [];

        network.links.forEach(function (d) {
            //console.log("qq", d, d.source)
            adjlist[d.source + "-" + d.target] = true;
            adjlist[d.target + "-" + d.source] = true;
        });
        console.log("hh", adjlist)


        function neigh(a, b) {
            return a == b || adjlist[a + "-" + b];
        }

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulation
            .nodes(network.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(network.links);

        function ticked() {
            //clear canvas
            context.save();
            context.clearRect(0, 0, width, height);
            context.translate(transform.x, transform.y);
            context.scale(transform.k, transform.k);

            //draw all links
            context.beginPath();
            network.links.forEach(drawLink);
            context.strokeStyle = "#c6c6c6";
            context.stroke();

            //draw all nodes
            context.fillStyle = "#4682B4";
            context.beginPath();
            network.nodes.forEach(drawNode);
            context.fill();
            context.strokeStyle = "#fff";
            context.stroke();

            //if node clicked
            if (selected) {
                //fade all links
                context.beginPath();
                network.links.forEach(drawLink);
                context.strokeStyle = "#ffffff";
                context.stroke();

                //color node selected and his neighbours
                console.log("clsndd", closeNode)
                context.fillStyle = "#ff0000"
                context.beginPath();
                drawNode(closeNode)
                neighs.forEach(drawNode)
                context.fill();
                context.strokeStyle = "#ff0000";
                context.stroke();

                //color links between node selected and neighbours
                context.beginPath();
                linksNeighs.forEach(drawLink);
                context.strokeStyle = "#ff0000";
                context.stroke();

                //fade all other nodes
                context.fillStyle = "rgba(220, 220, 220,1)";
                context.beginPath();
                notNeighs.forEach(drawNode)
                context.fill();
                context.strokeStyle = "rgba(220, 220, 220,1)";
                context.stroke();

            }
            context.restore();

        }


        var closeNode;
        var neighs = [];
        var notNeighs = [];
        var x = neigh(133047, 3541)
        var linksNeighs = []
        var selected = false
        //debugger
        d3.select("canvas").on("click", function (d) {
            var p = d3.mouse(this);
            currentZoom = transform;
            /*
            closeNode = simulation.find(
                p[0] * currentZoom.k + currentZoom.x,
              p[1] * currentZoom.k + currentZoom.y
             );
             */
            //console.lncurrentZoom)
            var zp = transform.invert(p);

            neighs = []
            linksNeighs = []
            notNeighs = []
            selected = false
            closeNode = simulation.find(zp[0], zp[1])
            var nodeX = closeNode.x
            var nodeY = closeNode.y
            var mouseX = zp[0]
            var mouseY = zp[1]
            var delta = 5
            var diffX = Math.abs(nodeX - mouseX)
            var diffY = Math.abs(nodeY - mouseY)

            console.log("cN", closeNode)
            if (diffX < delta && diffY < delta) {
                //alert('clicked an element');
                selected = true
                personName = closeNode.name;
                setPerson(closeNode.id, true, false);
            }

            if (selected) {
                network.nodes.forEach(function (n) {
                    if (neigh(closeNode.id, n.id)) {
                        neighs.push(n)
                        link = {
                            "source": closeNode.id,
                            "target": n.id
                        }
                        linksNeighs.push(link)
                    }
                    else {
                        notNeighs.push(n)
                    }
                })
                //console.log(closeNode);
                simulation.force("link")
                    .links(linksNeighs);
                d3.select('#tooltip')
                    .style('opacity', 0.8)
                    .style('top', d3.event.pageY + 5 + 'px')
                    .style('left', d3.event.pageX + 5 + 'px')
                    .html(closeNode.name);
            } else {
                d3.select('#tooltip')
                    .style('opacity', 0)
            }

            ticked();
        }).call(d3.zoom().scaleExtent([2 / 10, 8]).on("zoom", zoomed));

        function drawLink(d) {
            context.moveTo(d.source.x, d.source.y);
            context.lineTo(d.target.x, d.target.y);
        }

        function drawNode(d) {
            context.moveTo(d.x + 3, d.y);
            context.arc(d.x, d.y, 3, 0, 2 * Math.PI);
        }

        function zoomed() {
            transform = d3.event.transform;
            ticked();

        }
    });
}

/*var nodes = graph.nodes
    var nodess = graph.nodes.map(e => parseInt(e.id))
    var links = graph.links.map(e => {
        return ({
            "source": nodess.indexOf(parseInt(e.source)),
            "target": nodess.indexOf(parseInt(e.target)),
            "count": 1
        })
    }
    )

    var label = {
        'nodes': [],
        'links': []
    };

    graph.nodes.forEach(function (d, i) {
        label.nodes.push({ node: d });
        label.nodes.push({ node: d });
        label.links.push({
            source: i * 2,
            target: i * 2 + 1
        });
    });

    var labelLayout = d3.forceSimulation(label.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(label.links).distance(0).strength(2));

    var graphLayout = d3.forceSimulation(graph.nodes)
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3.forceLink(graph.links).id(function (d) { return d.id; }).distance(50).strength(1))
        .on("tick", ticked);

    var adjlist = [];

    graph.links.forEach(function (d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
    });

    function neigh(a, b) {
        return a == b || adjlist[a + "-" + b];
    }

    var svg = d3.select("#network").attr("width", width).attr("height", height);
    var container = svg.append("g");

    svg.call(
        d3.zoom()
            .scaleExtent([.1, 4])
            .on("zoom", function () { container.attr("transform", d3.event.transform); })
    );

    var link = container.append("g").attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "1px");

    var node = container.append("g").attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", function (d) { return color(d.group); })

    node.on("mouseover", focus).on("mouseout", unfocus);

    node.call(
        d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
    );

    var labelNode = container.append("g").attr("class", "labelNodes")
        .selectAll("text")
        .data(label.nodes)
        .enter()
        .append("text")
        .text(function (d, i) { return i % 2 == 0 ? "" : d.node.id; })
        .style("fill", "#555")
        .style("font-family", "Arial")
        .style("font-size", 12)
        .style("opacity", 0)
        .style("pointer-events", "none"); // to prevent mouseover/drag capture
    node.on("mouseover", focus).on("mouseout", unfocus);

    function ticked() {

        node.call(updateNode);
        link.call(updateLink);

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function (d, i) {
            if (i % 2 == 0) {
                d.x = d.node.x;
                d.y = d.node.y;
            } else {
                var b = this.getBBox();

                var diffX = d.x - d.node.x;
                var diffY = d.y - d.node.y;

                var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                var shiftX = b.width * (diffX - dist) / (dist * 2);
                shiftX = Math.max(-b.width, Math.min(0, shiftX));
                var shiftY = 16;
                this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");
            }
        });
        labelNode.call(updateNode);

    }

    function fixna(x) {
        if (isFinite(x)) return x;
        return 0;
    }

    function focus(d) {
        var index = d3.select(d3.event.target).datum().index;
        node.style("opacity", function (o) {
            return neigh(index, o.index) ? 1 : 0.1;
        });
        labelNode.style("opacity", function (o) {
            return neigh(index, o.node.index) ? 1 : 0;
        });
        link.style("opacity", function (o) {
            return o.source.index == index || o.target.index == index ? 1 : 0.1;
        });
    }

    function unfocus() {
        labelNode.style("opacity", 0);
        node.style("opacity", 1);
        link.style("opacity", 1);
    }

    function updateLink(link) {
        link.attr("x1", function (d) { return fixna(d.source.x); })
            .attr("y1", function (d) { return fixna(d.source.y); })
            .attr("x2", function (d) { return fixna(d.target.x); })
            .attr("y2", function (d) { return fixna(d.target.y); });
    }

    function updateNode(node) {
        node.attr("transform", function (d) {
            return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
        });
    }

    function dragstarted(d) {
        d3.event.sourceEvent.stopPropagation();
        if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) graphLayout.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }*/
//});


function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        if (val.length < 3) return;
        for (i = 0; i < arr.length; i++) {
            let name = arr[i].name;
            let pid = arr[i].pid
            /*check if the item starts with the same letters as the text field value:*/
            if (name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + name.substr(0, val.length) + "</strong>";
                b.innerHTML += name.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + name + "' pid='" + pid + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    let id = parseInt(this.getElementsByTagName("input")[0].getAttribute("pid"))
                    console.log(id)
                    /*insert the value for the autocomplete text field:*/
                    personName = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    setPerson(id);
                    inp.value = "";
                });
                a.appendChild(b);
            }
        }
    });
    document.getElementById("selected-person").addEventListener("click", () => setPerson(null));
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

async function loadGuests() {
    peopleDetails = await d3.json(`${root}/person_details.json`);
    peopleTimeline = await d3.json(`${root}/freq_plus_rating.json`);
    return peopleDetails.map(a => ({
        name: a["name"],
        pid: a["id"]
    }
    ))
}


loadGuests().then(people => { autocomplete(document.getElementById("myInput"), people) })
loadRelations().then(relations)
loadTimeline().then(timeline)
loadAppearances().then(appearancesPie)
loadTreeMap().then(treemap)

function updateVis(updateNetwork = true) {
    loadTimeline()
    loadAppearances()
    loadTreeMap()
    if (updateNetwork) loadRelations()
}

window.setTimeout(() => dispatch.call("upNetwork"), 500)