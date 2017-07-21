(function() {
  'use strict';

  $(document).ready(function(){
    $('.parallax').parallax();
    $('.pushpin-demo-nav').each(function() {
      var $this = $(this);
      var $target = $('#' + $(this).attr('data-target'));
      $this.pushpin({
        top: $target.offset().top,
        bottom: $target.offset().top + $target.outerHeight() - $this.height()
      });
    });

    var github = d3.select('#github-viz');
    console.log(github);
    $.get('https://api.github.com/users/blankazucenalg/events', function(data) {
      console.log(data);
      data.forEach(function(d) {
        d.created_at = new Date(d.created_at);
      });
      var nestedData = d3.nest()
        .key(function(d){ return d.created_at.getFullYear() + '-' + d.created_at.getMonth() + '-' + d.created_at.getDate(); })
        .entries(data);

      console.log(nestedData);

      var today = new Date();
      var first = data[data.length - 1].created_at;
      var daysDiff = Math.round((today-first)/(1000*60*60*24));
      var size = 30;

      var width = $(github.node()).width();
      var height = Math.ceil(daysDiff / Math.floor(width / size));
      var svg = github.append('svg')
        .attr('width', width)
        .attr('height', height);
      console.log(width, height);

      var tip = d3.tip().attr('class','d3-tip').html(function(d){
        console.log(d);
        return '<p>' + d.type + '</p><p>' + d.created_at + '</p>';
      });
      svg.call(tip);

      
      var scaleX = d3.scaleLinear()
        .range([0, width])
        .domain([0, Math.floor(width / size)])

      var scaleY = d3.scaleLinear()
        .range([0, height])
        .domain([0, Math.ceil(height / size)])
      // Math.ceil(data.length / Math.floor(width / size))

      

      for (var i = 0; i < daysDiff; i++) {
        svg.append('rect')
          .attr('fill', '#eee')
          .attr('x', function(d,i) { return scaleX(i); })
          .attr('y', function(d,i) { return scaleY(Math.floor(i / Math.floor(width / size))); } )
          .attr('width', size)
          .attr('height', size)
      }
      svg.selectAll('.event')
        .data(data)
        .enter()
        .append('rect')
          .attr('class', 'event')
          .attr('x', function(d,i) { return scaleX(i); })
          .attr('y', function(d,i) { return scaleY(Math.floor(i / Math.floor(width / size))); } )
          .attr('width', size)
          .attr('height', size)
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide)
    });
  });
})();