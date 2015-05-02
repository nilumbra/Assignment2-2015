var margin = {top: 20, right: 20, bottom: 100, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
var incomingData = {};

//define scale of x to be from 0 to width of SVG, with .1 padding in between
var scaleX = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

//define scale of y to be from the height of SVG to 0
var scaleY = d3.scale.linear()
  .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
  .scale(scaleX)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(scaleY)
  .orient("left");

 var controls = d3.select("body")
                 .append('div')
                 .attr("id", "controls");

var sort_btn = controls.append("button")
                .html("Sort data: ascending")
                .attr("state",0);


//create svg
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//get json object which contains media counts
d3.json('/igMediaCounts', function(error, data) {
  console.log(data);
  
 
  //set domain of x to be all the usernames contained in the data
  scaleX.domain(data.users.map(function(d) { return d.username; }));
  //set domain of y to be from 0 to the maximum media count returned
  scaleY.domain([0, d3.max(data.users, function(d) { return d.counts.media; })]);

  //set up x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-65)" 
    });

  //set up y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Photos");

  //enter()
  //set up bars in bar graph
  svg.selectAll(".bar")
    .data(data.users)
    .enter()
    .append("rect")
    .attr("class", "bar");

//update
  svg.selectAll(".bar")
    .attr("y", function(d) { return scaleY(d.counts.media); })
    .attr("height", function(d) { return height - scaleY(d.counts.media); })
    .attr("x", function(d) { return scaleX(d.username); })
    .attr("width", scaleX.rangeBand());

//exit()
  // svg.selectAll(".bar")
  //    .data(data.users.counts.media)
  //    .exit()
  //    .remove();

  // svg.selectAll(".bar")
  //    .data(data.users.username)
  //    .exit()
  //    .remove();

  var counts = data.users.map(function(d) { return d.counts.media;});

  sort_btn.on("click", function(){
    var self = d3.select(this);
  
    var state = +self.attr("state");
    var txt = "Sort data: ";
    if(state ===0){
     
      var x0 = scaleX.domain(data.users.sort(
                                function(a, b){return  a.counts.media - b.counts.media})
                .map(function(d){return d.username;}))
                .copy();

      var transition = svg.transition().duration(750);
      delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
      .delay(delay)
      .attr("x", function(d) { return x0(d.username); });

      transition.select(".x.axis")
                .call(xAxis)
                .selectAll("g")
                .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                  return "rotate(-65)" 
                })
                .delay(delay);


      state = 1;
      txt += "descending";
    }else if(state===1){
      
      var x0 = scaleX.domain(data.users.sort(
                                function(a, b) {return b.counts.media 
                                                       - a.counts.media;})
                .map(function(d){ return d.username}))
                .copy();

      var transition = svg.transition().duration(750),
      delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
      .delay(delay)
      .attr("x", function(d) { return x0(d.username); });

      transition.select(".x.axis")
                .call(xAxis)
                .selectAll("g")
                .selectAll("text")  
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                  return "rotate(-65)" 
                })
                .delay(delay);

      state = 0;
      txt+="ascending";
    }
    self.attr("state", state);
    self.html(txt);
    
    console.log(counts);
   })

// var x0 = x.domain(data.sort(this.checked
//       ? function(a, b) { return b.posts - a.posts; }
//       : function(a, b) { return d3.ascending(a.name, b.name); })
//     .map(function(d) { return d.name; }))
//     .copy();
 });



