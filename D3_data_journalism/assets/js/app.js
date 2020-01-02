// Code for Chart is Wrapped Inside a Function That Automatically Resizes the Chart
function makeResponsive() {
    
  // If SVG Area is not Empty When Browser Loads, Remove & Replace with a Resized Version of Chart
      var svgArea = d3.select("body").select("svg");
    
  // Clear SVG is Not Empty
      if (!svgArea.empty()) {
        svgArea.remove();
      }
      
  // Setup Chart Parameters/Dimensions
  var svgWidth = 800;
  var svgHeight = 500;
  
  // Set SVG Margins
  var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
  // Define Dimensions of the Chart Area
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  
  // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  
  // Chart group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  
  // Import Data
  d3.csv("assets/data/data.csv").then(function(censusData) {
      
  
  // Parse Data/Cast as numbers
      censusData.forEach(function(data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
      });
  
  
  // Create Scale Functions
      var xLinearScale = d3.scaleLinear()
          .domain([d3.min(censusData, d=>d.poverty)*.9, 
              d3.max(censusData, d => d.poverty)*1.05])
          .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
          .domain([0, d3.max(censusData, d => d.healthcare)*1.1])
          .range([height, 0]);
  
  
  // Create axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
  
  // Append Axes to the chart
      chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .style("font-size", "18px")
          .call(bottomAxis);
  
      chartGroup.append("g")
          .style("font-size", "18px")
          .call(leftAxis);
    
  
  // Create Circles
      chartGroup.selectAll("circle")
          .data(censusData)
          .enter()
          .append("circle")
          .attr("cx", d => xLinearScale(d.poverty))
          .attr("cy", d => yLinearScale(d.healthcare))
          .attr("r", 12)
          .attr("fill", "lightblue")
  
  
  // Add text in circles
      chartGroup.selectAll("text.text-circles")
          .data(censusData)
          .enter()
          .append("text")
          .classed("text-circles",true)
          .text(d => d.abbr)
          .attr("x", d => xLinearScale(d.poverty))
          .attr("y", d => yLinearScale(d.healthcare))
          .attr("dy",5)
          .attr("fill", "white")
          .attr("text-anchor","middle")
          .attr("font-size","12px");
  
  
  // Create axes labels
      chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 30 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .classed("aText", true)
          .text("Lacks Healthcare (%)");
  
      chartGroup.append("text")
          .attr("y", height + margin.bottom/2 - 10)
          .attr("x", width / 2)
          .attr("dy", "1em")
          .classed("aText", true)
          .text("In Poverty (%)");
  });
  }
  // When Browser Loads, makeResponsive() is Called
  makeResponsive();
  
  // When Browser Window is Resized, makeResponsive() is Called
  d3.select(window).on("resize", makeResponsive);