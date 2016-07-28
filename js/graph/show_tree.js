var depth = 0;

var aa = $("#cytoscapeweb").outerWidth(true);
var ab = $("#cytoscapeweb").outerHeight(true);


// ************** Generate the tree diagram  *****************
var margin = {top: -10, right: -10, bottom: -10, left: -10},
    width =  aa + margin.right + margin.left,
    height = ab + margin.top + margin.bottom;
    
var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [ d.y, d.x]; });

var zoom = d3.behavior.zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", zoomed);

var svg1 = d3.select("#cytoscapeweb").insert("svg","svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);
    // .call(zoomListener);

var container = svg1.append("g");

var rect = container.insert("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");
   
function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}



function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = width - d.depth * 90 - 1000 ; });

  // Update the nodes…
  var node = container.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", click);


  nodeEnter.append("path")
    // .style("stroke", "black")
    // .style("fill", "white")
    .style("stroke", function(d) { return (d.role == "j") ? "#356244" : "steelblue";})
    .style("stroke-width", "3px")
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; })
    .attr("transform", "rotate(90)")
    .attr("d", d3.svg.symbol()
                 .size(600)
                 .type(function(d) { return (d.role == "j") ? "triangle-up" : "triangle";
                  })); 
  // nodeEnter.append("circle")
     //  .attr("r", 1e-6)
     //  .attr("stroke", function(d) { return (d.role == "j") ? "black" : "steelblue";})
     //  .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("text")
      // .attr("x", function(d) { return d.children || d._children ? + 30 : 13; }) // 텍스트의 위치, 자식인지아닌지 확인해서 알려줌
      // .attr("y", function(d) { return d.children || d._children ? - 20 : -20; })
      .attr("x", -10)
      .attr("y", 0)
      .attr("dy", ".35em")
      // .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return (d.role == "j" ) ? d.name : d.number; })
      .style("font-size", "100%")
      .style("fill-opacity", 1e-6);

  nodeEnter.append("text")
    .attr("class", "hover")
        .attr('transform', function(d){ 
            return 'translate(15, -15)';
    })
    .style("opacity", 0)
    .text(function(d) {return (d.role == "j" ) ? "" : d.name});



  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("rect")
      .attr("r", 50)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  nodeUpdate.select("labelText")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("rect")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);
  
  nodeExit.select("labelText")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = container.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

$('#btn_graphOnOff').click(function(){
    d3.selectAll("g.node").append("text")
        .attr("class", "hover")
        .attr('transform', function(d){ 
            return 'translate(15, -15)';
    })
    .data(function(d) { return d; })
    .text(d.name);
});
var state = 0;
function click(d) {
    if(state == 0) state = 1;
    else state = 0;
    d3.selectAll("g.node").select("text.hover")
    .style("opacity", state);
    // d3.selectAll("g.node").select("text.hover").remove();
}

function mouseover(d) {
    if(state != 1) d3.select(this).select("text.hover").style("opacity", 1);
}

// Toggle children on click.
function mouseout(d) {
    if(state != 1) d3.select(this).select("text.hover").style("opacity", 0);
}


function generating(treeData){

    root = treeData[0];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);
}