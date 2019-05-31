---
layout: post
title: "D3 ejemplo: Sistema Solar"
date: 2019-03-27
author: Blanca López
categories: dataviz
tags: [javascript, d3, front-end, dataviz]
---

<!-- ![alt text](assets/images/solar_system.png "Wallpaper") -->
<style type="text/css"> 
  @import url('https://raw.githubusercontent.com/Caged/d3-tip/master/examples/example-styles.css');
  @import url("/css/solar_system.css");
</style>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.js"></script>
<div class="relative">
  <div id="info-planet"></div>
  <div id="planets"></div>
</div>
<script type="text/javascript">
  const width = 900;
  const height = 900;
  const sunx = 200;
  const suny = 200;
  const sunr = 50;
  const diag = Math.sqrt(2 * (500 * 500));
  const t0    = new Date().setHours(0,0,0,0);
  const delta = (Date.now() - t0);
  const tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(d => d.planet);
  const svg = d3.select('#planets')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('width', '100%')
    .style('height', 'auto')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');
  svg.call(tip);
  svg.append('circle')
    .classed('sun', true)
    .attr('cx', sunx)
    .attr('cy', suny)
    .attr('r', sunr)
    .attr('fill', 'gold');
  d3.csv('/assets/data/planetas.csv', d => {
      return {
        planet: d.planeta,
        distance: +d.kmDistanciaAlSol,
        diameter: +d.diametroKm,
        radius: +d.diametroKm / 2,
        speed: +d['speed km/s']
        };
      }).then(data4 => {
        const maxDistance = d3.max(data4, d => d.distance); // Obtiene la mayor  distancia de los planetas con respecto al Sol
        // Crea una escala lineal para las distancias de los planetas
        const distance = d3.scaleLinear()
          .range( [ sunr, diag - 25])
          // Establece el dominio de la escala
          .domain([ 0, maxDistance]);
        const minSize = d3.min(data4, d => d.radius);
        const maxSize = d3.max(data4, d => d.radius);
        // Obtén el tamaño más grande de todos los planetas (d3.max(data4, function(d) { //Qué propiedad quieres? });
        const size = d3.scaleLinear()
          .range( [0, 2, 20])
          .domain([0, minSize, maxSize]);
        console.log(size(695510));
        const color = d3.scaleOrdinal()
          .range(['#424E4C', '#7C5531', '#7BBBF0', '#CC522C', '#A67845', '#EBA340', '#75D6F1', '#2C73A9'])
          .domain(data4.map(d => d.planet));
          // Establece el dominio de la escala ordinal con la lista de los nombres de los planetas
        // data4.map(function(objeto){ return PROPIEDAD QUE QUIERES; })
        // Dibuja circulos para cada planeta dentro del svg (Ve el ejemplo de los eventos)
        const grupoPlaneta = svg.selectAll('.planet-group')
          .data(data4, d => d.planet)
            .enter()
              .append('g')
              .attr('class', 'planet-group')
              .attr('x', d => {
                c = distance(d.distance);
                return c / Math.sqrt(2);
              })
              .attr('y', d => {
                c = distance(d.distance);
                return c / Math.sqrt(2);
              });
        grupoPlaneta.append('circle')
          .attr('cx', d => {
            c = distance(d.distance);
            return c / Math.sqrt(2);
          })
          .attr('cy', d => {
            c = distance(d.distance);
            return c / Math.sqrt(2);
          })
          .attr('r', d => size(d.radius))
          .attr('fill', d => color(d.planet))
          .style('cursor', 'pointer')
          .on('mouseover', function(d) {
            tip.show(d, this);
          })
          .on('mouseout', function(d) {
            tip.hide(d, this);
          })
          .on('click', d => {
            const earth = data4.find(o => o.planet === 'Tierra');
            const distanceFromEarth = Math.abs(d.distance - earth.distance);
            const percRadius = d.radius / earth.radius;
            const format = d3.format(',.0f');
            const format2 = d3.format(',.2f');
            d3.select('#info-planet')
              .html(`<div class="cont"><p><b>${d.planet}</b> es un planeta del Sistema Solar,
              está a <span class="datum">${format(d.distance)}</span> km del Sol,
              y tiene un diámetro de <span class="datum">${format(d.diameter)}</span> km.</p>
              <p>En comparación con la Tierra se encuentra a
              <span class="datum">${format(distanceFromEarth)}</span> km y su radio es <span class="datum">${format2(percRadius)}</span>
              veces el de la Tierra</p></div>`);
          });
        setInterval(function(){
          var delta = (Date.now() - t0);
          svg.selectAll(".planet-group").attr("transform", function(d) {
            return `translate(${sunx},${suny})rotate(${(0 + (delta * (d.speed/800)))})`;
          });
        }, 40);
      });
</script>
