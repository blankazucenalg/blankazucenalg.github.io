---
layout: post
title: "D3 color linear scales"
date: 2019-04-11
author: Blanca López
categories: dataviz
tags: [javascript, d3, front-end, dataviz, color scales]
---

Dentro de las bondades de d3.js, además de generar escalas lineales con valores númericos, también nos es posible generar escalas de colores, que nos ayudarán a visualizar los valores de los datos que vamos a representar gráficamente.

<!--more-->

<style type="text/css"> 
  @import url('https://raw.githubusercontent.com/Caged/d3-tip/master/examples/example-styles.css');
  .square-grid {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }
</style>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.9.1/d3-tip.js"></script>

## Escala lineal

```javascript
var data = [4, 5, 9, 11, 16, 18, 27, 31, 32, 58, 59, 100, 225];
var colors = ["#D0BBEF", "#583A5E"];
```

```javascript
var colorScaleLinear = d3
  .scaleLinear()
  .range(colors)
  .domain(d3.extent(data));

d3.select("#linear-scale")
  .selectAll(".rect")
  .data(data)
  .enter()
  .append("div")
  .style("width", d => `${widthScale(d)}%`)
  .style("height", "25px")
  .style("margin-bottom", "7px")
  .style("background-color", d => colorScaleLinear(d));
```

<div class="relative">
  <div class="linear-scale-square square-grid"></div>
  <div class="linear-scale"></div>
</div>

## Escala lineal con punto de quiebre en la media (promedio)

```javascript
var data = [4, 5, 9, 11, 16, 18, 27, 31, 32, 58, 59, 100, 225];
var colors = ["#D0BBEF", "#795DA0", "#583A5E"];
```

```javascript
var colorScaleLinearMean = d3
  .scaleLinear()
  .range([colors[0], colors[4], colors[9]])
  .domain([d3.min(data), d3.mean(data), d3.max(data)]); // [4, 45.76923076923077, 225]

d3.select("#linear-scale-mean")
  .selectAll(".rect")
  .data(data)
  .enter()
  .append("div")
  .style("width", d => `${widthScale(d)}%`)
  .style("height", "25px")
  .style("margin-bottom", "7px")
  .style("background-color", d => colorScaleLinearMean(d));
```

<div class="relative">
  <div class="linear-scale-mean-square square-grid"></div>
  <div class="linear-scale-mean"></div>
</div>

## Escala lineal con punto de quiebre en la mediana

```javascript
var data = [4, 5, 9, 11, 16, 18, 27, 31, 32, 58, 59, 100, 225];
var colors = ["#D0BBEF", "#795DA0", "#583A5E"];
```

```javascript
var colorScaleLinearMedian = d3
  .scaleLinear()
  .range([colors[0], colors[4], colors[9]])
  .domain([d3.min(data), d3.median(data), d3.max(data)]); // [4, 27, 225]

d3.select("#linear-scale-median")
  .selectAll(".rect")
  .data(data)
  .enter()
  .append("div")
  .style("width", d => `${widthScale(d)}%`)
  .style("height", "25px")
  .style("margin-bottom", "7px")
  .style("background-color", d => colorScaleLinearMedian(d));
```

<div class="relative">
  <div class="linear-scale-median-square square-grid"></div>
  <div class="linear-scale-median"></div>
</div>

## Escala lineal con dominio cuantizado

![Color scale](/assets/images/image-20190411134822497.png)

[https://hihayk.github.io/scale/#7/3/47/58/-74/-35/33/-14/806FC1/128/111/193](https://hihayk.github.io/scale/#7/3/47/58/-74/-35/33/-14/806FC1/128/111/193)

```javascript
var data = [4, 5, 9, 11, 16, 18, 27, 31, 32, 58, 59, 100, 225];
var colors = [
  "#583A5E",
  "#63436E",
  "#6C4C7E",
  "#73558F",
  "#795DA0",
  "#7D66B0",
  "#806FC1",
  "#8077D2",
  "#AA98E2",
  "#D0BBEF"
].reverse();
```

```javascript
var n = 10;
var quantiles = d3.range(n).map(d => {
  return d3.quantile(data, d / (n - 1));
});
// [4, 6.333333333333333, 10.333333333333332, 16, 20.999999999999996,
// 29.666666666666668, 32, 58.333333333333336, 86.33333333333331, 225]
var colorScaleQuantiles = d3
  .scaleLinear()
  .range(colors)
  .domain(quantiles);

d3.select("#linear-scale-quantiles")
  .selectAll(".rect")
  .data(data)
  .enter()
  .append("div")
  .style("width", d => `${widthScale(d)}%`)
  .style("height", "25px")
  .style("margin-bottom", "7px")
  .style("background-color", d => colorScaleQuantiles(d));
```

<div class="relative">
  <div class="linear-scale-quantiles-square square-grid"></div>
  <div class="linear-scale-quantiles"></div>
</div>

## Comparación

<div class="row">
  <div class="col s12 m6">
    <div class="linear-scale-square square-grid"></div>
    <div class="linear-scale"></div>
  </div>
  <div class="col s12 m6">
    <div class="linear-scale-mean-square square-grid"></div>
    <div class="linear-scale-mean"></div>
  </div>
  <div class="col s12 m6">
    <div class="linear-scale-median-square square-grid"></div>
    <div class="linear-scale-median"></div>
  </div>
  <div class="col s12 m6">
    <div class="linear-scale-quantiles-square square-grid"></div>
    <div class="linear-scale-quantiles"></div>
  </div>
</div>
<script type="text/javascript">
var data = [4, 5, 9, 11, 16, 18, 27, 31, 32, 58, 59, 100, 225];
var colors = ['#583A5E', '#63436E', '#6C4C7E', '#73558F', '#795DA0', 
  '#7D66B0', '#806FC1', '#8077D2', '#AA98E2', '#D0BBEF'].reverse();
// https://hihayk.github.io/scale/
var n = 10;
var quantiles = d3
  .range(n)
  .map(d => {
    return d3.quantile(data, d / (n - 1));
  });
var widthScale = d3
  .scaleLinear()
  .range([0, 100])
  .domain([0, d3.max(data)]);
var colorScaleLinear = d3
  .scaleLinear()
  .range([colors[0], colors[9]])
  .domain(d3.extent(data));
var colorScaleLinearMedian = d3
  .scaleLinear()
  .range([colors[0], colors[4], colors[9]])
  .domain([d3.min(data), d3.median(data), d3.max(data)]);
var colorScaleLinearMean = d3
  .scaleLinear()
  .range([colors[0], colors[4], colors[9]])
  .domain([d3.min(data), d3.mean(data), d3.max(data)]);
var colorScaleQuantiles = d3
  .scaleLinear()
  .range(colors)
  .domain(quantiles);
// color scales
d3.selectAll('.linear-scale-square')
  .selectAll('.square')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${100 / data.length}%`)
  .style('height', '40px')
  .style('border', 'solid 1px white')
  .style('background-color', d => colorScaleLinear(d));
d3.selectAll('.linear-scale-median-square')
  .selectAll('.square')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${100 / data.length}%`)
  .style('height', '40px')
  .style('border', 'solid 1px white')
  .style('background-color', d => colorScaleLinearMedian(d));
d3.selectAll('.linear-scale-mean-square')
  .selectAll('.square')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${100 / data.length}%`)
  .style('height', '40px')
  .style('border', 'solid 1px white')
  .style('background-color', d => colorScaleLinearMean(d));
d3.selectAll('.linear-scale-quantiles-square')
  .selectAll('.square')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${100 / data.length}%`)
  .style('height', '40px')
  .style('border', 'solid 1px white')
  .style('background-color', d => colorScaleQuantiles(d));
// barcharts
d3.selectAll('.linear-scale')
  .selectAll('.rect')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${widthScale(d)}%`)
  .style('height', '25px')
  .style('margin-bottom', '7px')
  .style('background-color', d => colorScaleLinear(d));
d3.selectAll('.linear-scale-median')
  .selectAll('.rect')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${widthScale(d)}%`)
  .style('height', '25px')
  .style('margin-bottom', '7px')
  .style('background-color', d => colorScaleLinearMedian(d));
d3.selectAll('.linear-scale-mean')
  .selectAll('.rect')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${widthScale(d)}%`)
  .style('height', '25px')
  .style('margin-bottom', '7px')
  .style('background-color', d => colorScaleLinearMean(d));
d3.selectAll('.linear-scale-quantiles')
  .selectAll('.rect')
  .data(data)
  .enter()
  .append('div')
  .style('width', d => `${widthScale(d)}%`)
  .style('height', '25px')
  .style('margin-bottom', '7px')
  .style('background-color', d => colorScaleQuantiles(d));
</script>
