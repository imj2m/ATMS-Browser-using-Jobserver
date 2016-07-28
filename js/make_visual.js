 var depth = 0
 var aa = $("#cytoscapeweb").outerWidth(true);
 var ab = $("#cytoscapeweb").outerHeight(true);

    console.log(aa)
    // ************** Generate the tree diagram  *****************
    var margin = {top: 20, right: 0, bottom: 20, left: 0},
        width =  aa - margin.right - margin.left,
        height = ab - margin.top - margin.bottom;
        
    var i = 0,
        duration = 750,
        root;

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [ d.y, d.x]; });

    var svg = d3.select("#cytoscapeweb").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function makeJson(s1, s2, s3){
    var results = new Array();
    var parentObj = new Object() // 최상위 
    parentObj.name = s3  // 최상위 이름  
    var tmp = new Array() // 최상위 단계의 children array

    var justficationObj = new Object()  // 중간단계 즉 justfication 
    justficationObj.name = s1  // 중간단계 이름
    justficationObj.role = "j"  //롤설정
    
    var split_Ancedent = s2.split(',') // 최하위단계의 갯수때문에 스플릿
    var tmp2 = new Array() // 중간단계 children에 달릴 array
    for(var ii in split_Ancedent){ // 최하위 단계의 모든 것을 다추가하기 위해 for문
        var ancedentObj = new Object() // 최하위 단계의 한개의 노드
        ancedentObj.name = split_Ancedent[ii] // 최하위 단계의 한개의 노드의 이름
        ancedentObj.parent = s1 // 중간단계를 부모로 가짐
        tmp2.push(ancedentObj) // 중간단계 children의 array에 최하위단계 노드 추가 
    }
    justficationObj.children = tmp2; // 중간 단계 children 추가
    tmp.push(justficationObj) // 최상위 단계 array 에 중간단계 부탁
    parentObj.children = tmp; // array 부착
    results.push(parentObj); // 최상위 단계를 부착 

    return results;
} 

function makeTree(jsonArray, s1, s2, s3){
    if(jsonArray[0] == null){
        console.log("case1 d: " + depth)
        jsonArray = makeJson(s1, s2, s3)
    }
    else{ // 관련 justfication이 한개가아닐때 
        if(jsonArray[0].name == s3){ // concequent가 최상위 노드일때 
            console.log("case2 d: " + depth)
            var tmpArray = makeJson(s1, s2, s3)
            jsonArray[0].children.push(tmpArray[0].children[0]) // 최상위 단계 array 에 중간단계 부탁
        }
        else if(s2.indexOf(jsonArray[0].name.split("\"")) != -1){ // 새로 만드는 그래프의 하위 노드에 원래노드의 concequent가 있을때
            console.log("case3 d: " + depth)
            var tmpArray = makeJson(s1,s2,s3)
            for(var iiii in tmpArray[0].children[0].children){
                console.log("help"+iiii)

                if(tmpArray[0].children[0].children[iiii].name == jsonArray[0].name){
                    console.log("help")
                    tmpArray[0].children[0].children[iiii].children = jsonArray[0].children
                }
            }
            jsonArray = tmpArray;
        }
        else{ // 새로 만드는 그래프의 concequent 가 이미 있던 그래프의 antecendent에 있을때
            var tmpArray = makeJson(s1,s2,s3)
            for(var iii in jsonArray[0].children[0].children.length){
                console.log("case4 d: " + depth)
                if(jsonArray[0].children[0].children[iii].name == s3){
                    jsonArray[0].children[0].children[iii].children = tmpArray[0].children[0]
                }
            }
        }            
    }
    depth += 1
    console.log("makeTree")
    return jsonArray;
}


function update(source) {
  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = width - d.depth * 90 - depth * (width/3) ; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
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
      .text(function(d) { return d.name; })
      .style("font-size", "100%")
      .style("fill-opacity", 1e-6);



  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("rect")
      .attr("r", 50)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
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

  // Update the links…
  var link = svg.selectAll("path.link")
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

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function generating(treeData){
    root = treeData[0];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    d3.select(self.frameElement).style("height", "1000px");
}
