var gender = "all", age = "all", rating = "all", appearances = "all", person = null;
const root = "../Pipeline"
const currpath = () => {
    console.log(`${gender} ${age} ${appearances} ${rating}`)
    return `${root}/gender_${gender}/age_${age}/${appearances}_apps/${rating}_rating`;
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

function setPerson(newPerson, update = true) {
    person = newPerson;
    if (!person) {
        document.getElementById("selected-person-txt").innerHTML = "None selected";
        document.getElementById("selected-person").classList.toggle("active", false);
    } else {
        document.getElementById("selected-person-txt").innerHTML = person;
        document.getElementById("selected-person").classList.toggle("active", true);
        setGender('all', false);
        setAge('all', false);
        setAppearances('all', false);
        setRating('all', false);
    }
    if (update) updateVis();
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

var pieChart, groupYear, meanRatings;

var dispatch = d3.dispatch("upTimeline", "upPie", "upTreemap");

/* LOAD DATA */
async function loadTimeline() {
    groupYear = await d3.json(`${currpath()}/stats_freq_rating.json`);
    dispatch.call("upTimeline");
}

function timeline() {
    var w = 600;
    var h = 200;
    var padding = 30;
    var barwidth = Math.floor((w - padding * 2) / groupYear.length) - 1;
    var maxheight = h - padding;
    var hscale = d3.scaleLinear()
        .domain([0, 100])
        .range([maxheight - 0, maxheight - maxheight]);
    var xscale = d3.scaleLinear()
        .domain([groupYear[0].year, groupYear[groupYear.length - 1].year])
        .range([padding, w - padding]); // we are adding our padding to our width scale

    var cscale = d3.scaleLinear() // let us create a new scale for color
        .domain([
            d3.min(groupYear, d => d.freq),
            d3.max(groupYear, d => d.freq)
        ])
        .range(["yellow", "orange"]);

    var svg = d3.select("#timeline")
        .append("svg") // we are appending an svg to the div 'the_chart'
        .attr("width", w)
        .attr("height", h);

    var yaxis = d3.axisLeft() // we are creating a d3 axis
        .scale(hscale) // fit to our scale
        .tickFormat(d3.format("d"));
    svg.append("g") // we are creating a 'g' element to match our yaxis
        .attr("transform", "translate(30,0)") // 30 is the padding
        .attr("class", "yaxis") // we are giving it a css style
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .style("fill", "black")
        .attr("y", -23)
        .attr("x", -5)
        .text("Work Frequency");

    var xaxis = d3.axisBottom() // we are creating a d3 axis
        .scale(xscale) // we are adding our padding
        .ticks(groupYear.length);
    svg.append("g") // we are creating a 'g' element to match our x axis
        .attr("transform", "translate(0," + maxheight + ")")
        .attr("class", "xaxis") // we are giving it a css style
        .call(xaxis);
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
    radius = 10
    svg.selectAll("mycircle")
        .data(groupYear)
        .enter()
        .append("circle")
        .attr("cx", (d, i) => xscale(d.year))
        .attr("cy", d => { console.log(hscale(0)); return hscale(d.freq); })
        .attr("r", radius)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .attr("class", "lolicircles")

    svg.selectAll(".chartLineText")
        .data(groupYear)
        .enter()
        .append('text')
        .attr("class", "chartLineText")
        .style("color", "#000")
        .style("text-anchor", "middle")
        //.attr("transform", "translate(" + 30 + ",-2)")
        .attr("x", (d, i) => xscale(d.year))
        .text(function (d) { return Math.round(d.freq) / 10 })
        .attr("y", function (d) { return hscale(d.freq) + radius / 2; })
        .style("font-size", radius * 1.2 + "px");

    dispatch.on("upTimeline", (d) => { // click event
        cscale.domain([
            d3.min(groupYear, d => d.freq),
            d3.max(groupYear, d => d.freq)
        ])
        svg.selectAll(".lolilines") // same code, but now we only change values
            .data(groupYear)
            .transition() // add a smooth transition
            .duration(1500)
            .attr("x1", (d, i) => { console.log("hereee"); return xscale(d.year) })
            .attr("x2", (d, i) => xscale(d.year))
            .attr("y1", d => hscale(d.freq))
            .attr("y2", hscale(0))
            .attr("stroke", "grey");
        console.log("heree")

        svg.selectAll(".lolicircles") // same code, but now we only change values
            .data(groupYear)
            .transition() // add a smooth transition
            .duration(1500)
            .attr("cx", (d, i) => xscale(d.year))
            .attr("cy", d => { console.log(hscale(0)); return hscale(d.freq); })
            .attr("r", radius)
            .style("fill", "#69b3a2")
            .attr("stroke", "black")

        svg.selectAll(".chartLineText")
            .data(groupYear)
            .transition()
            .duration(1500)
            .attr("x", (d, i) => xscale(d.year))
            .text(function (d) { return Math.round(d.freq) / 10 })
            .attr("y", function (d) { return hscale(d.freq) + radius / 2; })
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
    var color = d3.scaleOrdinal()
        .domain([2, 6])
        .range(d3.schemeDark2);

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
        .attr('fill', d => color(d.data.key))
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
    });
}




async function loadTreeMap() {
    //pieChart = await d3.json(`${currpath()}/pie_chart_persondetails.json`);
    meanRatings = {
        "name": "cluster",
        "children": [
            { "name": "2", "size": 19 },
            { "name": "3", "size": 1 },
            { "name": "4", "size": 7 },
            { "name": "5", "size": 5 }
        ]
    }
    dispatch.call("upTreemap");
}

function treemap() {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 300 - margin.left - margin.right,
        height = window.innerHeight * (5 / 9) - margin.top - margin.bottom,
        color = d3.scaleOrdinal()
            .range(d3.schemeDark2);

    var svg = d3.select("#treemap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var root = d3.hierarchy(meanRatings).sum(function (d) { return d.size }) // Here the size of each leave is given in the 'value' field in input data

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
        .style("fill", d => color(d.data.name))
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
        .text(function (d) { return d.data.name })
        .attr("font-size", "15px")
        .attr("fill", "white")

    // A function that create / update the plot for a given variable:
    dispatch.on("upTreemap", (d) => { // click event

        meanRatings = {
            "name": "cluster",
            "children": [
                { "name": "2", "size": 1 },
                { "name": "3", "size": 7 },
                { "name": "4", "size": 17 },
                { "name": "5", "size": 20 }
            ]
        }
        root = d3.hierarchy(meanRatings).sum(function (d) { return d.size }) // Here the size of each leave is given in the 'value' field in input data

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
            .style("fill", d => color(d.data.name))

        // and to add the text labels
        svg.selectAll("text")
            .data(root.leaves())
            .transition()
            .duration(1500)
            .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) { return d.data.name })
            .attr("font-size", "15px")
            .attr("fill", "white")
    })
}







var width = window.innerWidth - 10;
var height = window.innerHeight - 70;
var color = d3.scaleOrdinal(d3.schemeCategory10);


d3.json("network.json").then(function (graph) {
    var nodes = graph.nodes
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
    }
    /*
    var groups = netClustering.cluster(nodes, links);
    debugger
    console.log(JSON.stringify(groups))







    var width = 960,     // svg width
    height = 600,     // svg height
    dr = 4,      // default point radius
    off = 15,    // cluster hull offset
    expand = {}, // expanded clusters
    data, net, force, hullg, hull, linkg, link, nodeg, node;

var curve = d3.line()
    .curve(d3.curveBasis)


var fill = d3.scaleOrdinal().range(d3.schemeCategory10);

function noop() { return false; }

function nodeid(n) {
  return n.size ? "_g_"+n.cluster : n.name;
}

function linkid(l) {
  var u = nodeid(l.source),
      v = nodeid(l.target);
  return u<v ? u+"|"+v : v+"|"+u;
}

function getGroup(n) { return n.cluster; }

// constructs the network to visualize
function network(data, prev, index, expand) {
  expand = expand || {};
  var gm = {},    // group map
      nm = {},    // node map
      lm = {},    // link map
      gn = {},    // previous group nodes
      gc = {},    // previous group centroids
      nodes = [], // output nodes
      links = []; // output links

  // process previous nodes for reuse or centroid calculation
  if (prev) {
    prev.nodes.forEach(function(n) {
      var i = index(n), o;
      if (n.size > 0) {
        gn[i] = n;
        n.size = 0;
      } else {
        o = gc[i] || (gc[i] = {x:0,y:0,count:0});
        o.x += n.x;
        o.y += n.y;
        o.count += 1;
      }
    });
  }

  // determine nodes
  for (var k=0; k<data.nodes.length; ++k) {
    var n = data.nodes[k],
        i = index(n),
        l = gm[i] || (gm[i]=gn[i]) || (gm[i]={cluster:i, size:0, nodes:[]});

    if (expand[i]) {
      // the node should be directly visible
      nm[n.name] = nodes.length;
      nodes.push(n);
      if (gn[i]) {
        // place new nodes at cluster location (plus jitter)
        n.x = gn[i].x + Math.random();
        n.y = gn[i].y + Math.random();
      }
    } else {
      // the node is part of a collapsed cluster
      if (l.size == 0) {
        // if new cluster, add to set and position at centroid of leaf nodes
        nm[i] = nodes.length;
        nodes.push(l);
        if (gc[i]) {
          l.x = gc[i].x / gc[i].count;
          l.y = gc[i].y / gc[i].count;
        }
      }
      l.nodes.push(n);
    }
  // always count group size as we also use it to tweak the force graph strengths/distances
    l.size += 1;
  n.group_data = l;
  }

  for (i in gm) { gm[i].link_count = 0; }

  // determine links
  for (k=0; k<data.links.length; ++k) {
    var e = data.links[k],
        u = index(e.source),
        v = index(e.target);
  if (u != v) {
    gm[u].link_count++;
    gm[v].link_count++;
  }
    u = expand[u] ? nm[e.source.name] : nm[u];
    v = expand[v] ? nm[e.target.name] : nm[v];
    var i = (u<v ? u+"|"+v : v+"|"+u),
        l = lm[i] || (lm[i] = {source:u, target:v, size:0});
    l.size += 1;
  }
  for (i in lm) { links.push(lm[i]); }

  return {nodes: nodes, links: links};
}

function convexHulls(nodes, index, offset) {
  var hulls = {};

  // create point sets
  for (var k=0; k<nodes.length; ++k) {
    var n = nodes[k];
    if (n.size) continue;
    var i = index(n),
        l = hulls[i] || (hulls[i] = []);
    l.push([n.x-offset, n.y-offset]);
    l.push([n.x-offset, n.y+offset]);
    l.push([n.x+offset, n.y-offset]);
    l.push([n.x+offset, n.y+offset]);
  }

  // create convex hulls
  var hullset = [];
  for (i in hulls) {
    hullset.push({cluster: i, path: d3.geom.hull(hulls[i])});
  }

  return hullset;
}

function drawCluster(d) {
  return curve(d.path); // 0.8
}

// --------------------------------------------------------

var body = d3.select("#net-container");

var vis = body.append("svg")
   .attr("width", width)
   .attr("height", height);

//d3.json("miserables.json", function(json) {
  //data = json;
  data = {"links": links, "nodes": nodes};
  for (var i=0; i<data.links.length; ++i) {
    o = data.links[i];
    o.source = data.nodes[o.source];
    o.target = data.nodes[o.target];
  }

  hullg = vis.append("g");
  linkg = vis.append("g");
  nodeg = vis.append("g");

  init();

  vis.attr("opacity", 1e-6)
    .transition()
      .duration(1000)
      .attr("opacity", 1);
//});

function init() {
  if (force) force.stop();

  net = network(data, net, getGroup, expand);

  force = d3.forceSimulation(net.nodes)
      .force("link", d3.forceLink(net.links).distance(function(l, i) {
      var n1 = l.source, n2 = l.target;
    // larger distance for bigger groups:
    // both between single nodes and _other_ groups (where size of own node group still counts),
    // and between two group nodes.
    //
    // reduce distance for groups with very few outer links,
    // again both in expanded and grouped form, i.e. between individual nodes of a group and
    // nodes of another group or other group node or between two group nodes.
    //
    // The latter was done to keep the single-link groups ('blue', rose, ...) close.
    return 30 +
      Math.min(20 * Math.min((n1.size || (n1.cluster != n2.cluster ? n1.group_data.size : 0)),
                             (n2.size || (n1.cluster != n2.cluster ? n2.group_data.size : 0))),
           -30 +
           30 * Math.min((n1.link_count || (n1.cluster != n2.cluster ? n1.group_data.link_count : 0)),
                         (n2.link_count || (n1.cluster != n2.cluster ? n2.group_data.link_count : 0))),
           100);
      //return 150;
    }))
    /*.linkStrength(function(l, i) {
    return 1;
    })
    .gravity(0.05)   // gravity+charge tweaked to ensure good 'grouped' view (e.g. green group not smack between blue&orange, ...
    .charge(-600)    // ... charge is important to turn single-linked groups to the outside
    .friction(0.5)   // friction adjusted to get dampened display: less bouncy bouncy ball [Swedish Chef, anyone?]
      .start();

  hullg.selectAll("path.hull").remove();
  hull = hullg.selectAll("path.hull")
      .data(convexHulls(net.nodes, getGroup, off))
    .enter().append("path")
      .attr("class", "hull")
      .attr("d", drawCluster)
      .style("fill", function(d) { return fill(d.cluster); })
      .on("click", function(d) {
console.log("hull click", d, arguments, this, expand[d.cluster]);
      expand[d.cluster] = false; init();
    });

  link = linkg.selectAll("line.link").data(net.links, linkid);
  link.exit().remove();
  link.enter().append("line")
      .attr("class", "link")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      .style("stroke-width", function(d) { return d.size || 1; });

  node = nodeg.selectAll("circle.node").data(net.nodes, nodeid);
  node.exit().remove();
  node.enter().append("circle")
      // if (d.size) -- d.size > 0 when d is a group node.
      .attr("class", function(d) { return "node" + (d.size?"":" leaf"); })
      .attr("r", function(d) { return d.size ? d.size + dr : dr+1; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", function(d) { return fill(d.cluster); })
      .on("click", function(d) {
console.log("node click", d, arguments, this, expand[d.cluster]);
        expand[d.cluster] = !expand[d.cluster];
    init();
      });

  //node.call(force.drag);
  node.call(
    d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
);

function dragstarted(d) {
    console.log("ds")

    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    console.log("d")
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    console.log("de")

    if (!d3.event.active) force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

  force.on("tick", function() {
    if (!hull.empty()) {
      hull.data(convexHulls(net.nodes, getGroup, off))
          .attr("d", drawCluster);
    }

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
}

*/







});


var countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre &amp; Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts &amp; Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad &amp; Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks &amp; Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];
autocomplete(document.getElementById("myInput"), countries);


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
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    setPerson(inp.value);
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




loadTimeline().then(timeline)
loadAppearances().then(appearancesPie)
loadTreeMap().then(treemap)

function updateVis() {
    loadTimeline()
    loadAppearances()
    loadTreeMap()
}

function prepareSearch() {
    var actor_names = []
    d3.json("../Pipeline/person_details.json").then(function (person_details) {
        person_details.forEach(function (actor) {
            actor_names.push(actor["name"]);
        });
    })
    actor_names.sort((a, b) => a.local)
    console.log(actor_names)
}
prepareSearch()