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




        var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ maxheight - 0, maxheight - maxheight]);
svg.append("g")
  .call(d3.axisRight(y))
  .attr("transform", "translate(" + (w - padding) + ",0)")
  .append("text")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "end")
  .style("fill", "black")
  .text("Work Frequency");
    // Lines
svg.selectAll("myline")
  .data(groupYear)
  .enter()
  .append("line")
    .attr("x1", (d, i) => xscale(i))
    .attr("x2", (d, i) => xscale(i))
    .attr("y1", d => y(d.freq))
    .attr("y2", y(0))
    .attr("stroke", "grey")

// Circles
radius = 8
svg.selectAll("mycircle")
  .data(groupYear)
  .enter()
  .append("circle")
    .attr("cx", (d, i) => xscale(i))
    .attr("cy", d =>{console.log( y(0)); return y(d.freq);})
    .attr("r", radius)
    .style("fill", "#69b3a2")
    .attr("stroke", "black")

    svg.selectAll(".chartLineText")
    .data(groupYear)
    .enter()
    .append('text')
    .attr("class", "chartLineText")
    .style("color", "#000")
    .style("text-anchor", "middle")
    //.attr("transform", "translate(" + 30 + ",-2)")
    .attr("x", (d, i) => xscale(i))
    .text(function (d) { return Math.round(d.freq) })
    .attr("y", function (d) { return y(d.freq)+radius/2; })
    .style("font-size", radius*1.5+"px");
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


    var width = 800;
  var height = 600;
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  
  
  d3.json("miserables.json").then(function(graph) {
  
      var label = {
          'nodes': [],
          'links': []
      };
      
      graph.nodes.forEach(function(d, i) {
          label.nodes.push({node: d});
          label.nodes.push({node: d});
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
          .force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(1))
          .on("tick", ticked);
      
      var adjlist = [];
      
      graph.links.forEach(function(d) {
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
              .on("zoom", function() { container.attr("transform", d3.event.transform); })
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
          .attr("fill", function(d) { return color(d.group); })
      
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
          .text(function(d, i) { return i % 2 == 0 ? "" : d.node.id; })
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
          labelNode.each(function(d, i) {
              if(i % 2 == 0) {
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
          node.style("opacity", function(o) {
              return neigh(index, o.index) ? 1 : 0.1;
          });
          labelNode.style("opacity", function(o) {
            return neigh(index, o.node.index) ? 1 : 0;
          });
          link.style("opacity", function(o) {
              return o.source.index == index || o.target.index == index ? 1 : 0.1;
          });
      }
      
      function unfocus() {
         labelNode.style("opacity", 0);
         node.style("opacity", 1);
         link.style("opacity", 1);
      }
      
      function updateLink(link) {
          link.attr("x1", function(d) { return fixna(d.source.x); })
              .attr("y1", function(d) { return fixna(d.source.y); })
              .attr("x2", function(d) { return fixna(d.target.x); })
              .attr("y2", function(d) { return fixna(d.target.y); });
      }
      
      function updateNode(node) {
          node.attr("transform", function(d) {
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
      
      });

timelineProps = loadTimeline().then(genTimeline)
appearancesProps = loadAppearances().then(genAppearances)

function updateVis() {
    timelineProps = loadTimeline().then(updateTimeline)
    appearancesProps = loadAppearances().then(updateAppearances)
}