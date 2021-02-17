function createSoccerViz() {
  d3.csv('../data/worldcup.csv').then(data => {
    overallTeamViz(data);
  });

  function overallTeamViz(data) {
    d3.select('svg')
      .append('g')
      .attr('id', 'teamsG')
      .attr('transform', 'translate(50, 300)')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'overallG')
      .attr('transform', (_, i) => `translate(${i * 50}, 0)`);

    const teamG = d3.selectAll('g.overallG');
    teamG
      .append('circle')
      .attr('r', 0)
      .transition()
      .delay((_, i) => i * 100)
      .duration(500)
      .attr('r', 40)
      .transition()
      .duration(500)
      .attr('r', 20);

    teamG
      .append('text')
      .attr('y', 30)
      .text(d => d.team);

    teamG.select('text').style('pointer-events', 'none');

    // teamG
    //   .insert('image', 'text')
    //   .attr('xlink:href', d => `../images/${d.team}.png`)
    //   .attr('width', '45px')
    //   .attr('height', '20px')
    //   .attr('x', '-22')
    //   .attr('y', '-10');

    teamG
      .on('mouseover', highlightRegion)
      .on('mouseout', unhighlightRegion)
      .on('click', teamClick);

    d3.xml('../resources/modal.html').then(d =>
      d3
        .select('body')
        .append('div')
        .attr('id', 'modal')
        .html(new XMLSerializer().serializeToString(d)),
    );

    d3.xml('../resources/icon.svg').then(function (svgData) {
      d3.selectAll('g').each(function () {
        const tenColorScale = d3
          .scaleOrdinal(d3.schemeCategory10)
          .domain(['UEFA', 'CONMEBOL', 'CAF', 'AFC']);

        const gParent = this;
        d3.select(svgData)
          .selectAll('path')
          .each(function () {
            gParent.appendChild(this.cloneNode(true));
          });

        d3.selectAll('g.overallG').each(function (d) {
          d3.select(this)
            .selectAll('path')
            .datum(d)
            .style('fill', p => tenColorScale(p.region))
            .style('stroke', 'black')
            .style('stroke-width', '2px');
        });
      });
      // d3.select(svgData)
      //   .selectAll('path')
      //   .each(function () {
      //     d3.select('svg').node().appendChild(this);
      //   });
      // d3.selectAll('path').attr('transform', 'translate(50, 50)');
    });

    const dataKeys = Object.keys(data[0]).filter(
      el => el !== 'team' && el !== 'region',
    );

    d3.select('#controls')
      .selectAll('button.teams')
      .data(dataKeys)
      .enter()
      .append('button')
      .on('click', buttonClick)
      .html(d => d);

    function buttonClick() {
      const key = this.__data__;
      const maxValue = d3.max(data, d => parseFloat(d[key]));
      const colorQuantize = d3
        .scaleQuantize()
        .domain([0, maxValue])
        .range(colorbrewer.Blues[3]);
      const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([2, 20]);
      d3.selectAll('g.overallG')
        .select('circle')
        .transition()
        .duration(300)
        .style('fill', d => colorQuantize(parseFloat(d[key])))
        .attr('r', d => radiusScale(parseFloat(d[key])));
    }

    const teamColor = d3.rgb('#78b4f0');

    function highlightRegion() {
      const selectedRegion = this.__data__.region;
      teamG.classed('active', d =>
        d.region === selectedRegion ? true : false,
      );
      teamG
        .select('circle')
        .style('fill', d =>
          d.region === selectedRegion
            ? teamColor.darker(0.75)
            : teamColor.brighter(0.5),
        );
      d3.select(this).select('text').style('font-size', '30px').attr('y', 10);
      this.parentElement.appendChild(this);
    }

    function unhighlightRegion() {
      teamG
        .classed('active', false)
        .select('text')
        .style('font-size', '10px')
        .attr('y', 30);

      teamG.select('circle').style('fill', teamColor);
    }

    function teamClick() {
      const selectData = this.__data__;
      d3.selectAll('td.data')
        .data(Object.values(selectData))
        .html(d => d);
    }
  }
}
