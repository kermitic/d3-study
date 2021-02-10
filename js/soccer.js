function createSoccerViz() {
  d3.csv("./data/worldcup.csv").then((data) => {
    overallTeamViz(data);
  });

  function overallTeamViz(data) {
    console.log(data);

    d3.select("svg")
      .append("g")
      .attr("id", "teamsG")
      .attr("transform", "translate(50, 300)")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "overallG")
      .attr("transform", (d, i) => `translate(${i * 50}, 0)`);

    var teamG = d3.selectAll("g.overallG");
    teamG
      .append("circle")
      .style("fill", "#eee")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("r", 0)
      .transition()
      .delay((d, i) => i * 100)
      .duration(500)
      .attr("r", 40)
      .transition()
      .duration(500)
      .attr("r", 20);

    teamG
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", 30)
      .style("font-size", "9px")
      .text((d) => d.team);

    teamG.on("mouseover", highlightRegion).on("mouseout", () => {
      d3.selectAll("g.overallG").select("circle").style("fill", "#eee");
    });

    var dataKeys = d3
      .keys(data[0])
      .filter((el) => el !== "team" && el !== "region");

    d3.select("#controls")
      .selectAll("button.teams")
      .data(dataKeys)
      .enter()
      .append("button")
      .on("click", buttonClick)
      .html((d) => d);

    function buttonClick(dataPoint) {
      var maxValue = d3.max(data, (d) => parseFloat(d[dataPoint]));
      var radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);
      d3.selectAll("g.overallG")
        .select("circle")
        .transition()
        .duration(500)
        .attr("r", (d) => radiusScale(d[dataPoint]));
    }

    function highlightRegion(d) {
      d3.selectAll("g.overallG")
        .select("circle")
        .style("fill", (p) => (p.region === d.region ? "dodgerblue" : "gray"));
    }
  }
}
