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

    var container = d3.select('#github-viz');
    console.log(container);
    $.get('https://api.github.com/users/blankazucenalg/events', function(github) {
      $.ajax({
        type: "GET",
        beforeSend: function(request) {
          request.setRequestHeader("PRIVATE-TOKEN", '5TNYhcMkdkBn7RAh3qPK');
        },
        url: "https://gitlab.com/api/v4/users/blankazucenalg/events",
        success: function(gitlab) {
        var data = [];
        for (var i = github.length - 1; i >= 0; i--) {
          data.push(github[i]);
        }
        for (var i = gitlab.length - 1; i >= 0; i--) {
          console.log(gitlab[i])
          data.push(gitlab[i]);
        }
        console.log(data);
        data.forEach(function(d) {
          d.created_at = moment(d.created_at);
        });
        data.sort(function(a,b) {
          return b.created_at - a.created_at;
        })

        var nestedData = d3.nest()
          .key(function(d){ return moment(d.created_at).format('Y/MM/D') })
          .entries(data);

        console.log(nestedData);

        var today = moment();
        var first = moment(data[data.length - 1].created_at);

        d3.select('#first-date').text(moment(first).format('YYYY/MM/DD'));
        d3.select('#today-date').text(moment(today).format('YYYY/MM/DD'));

        var daysDiff = Math.round((today-first)/(1000*60*60*24));
        var width = $(container.node()).width();
        var height = 30;
        var size = width / daysDiff;

        var scale = d3.scaleLinear()
          .range([0, width - size])
          .domain([first, today]);

        var svg = container.append('svg')
          .attr('width', width)
          .attr('height', height);
        console.log(width, height);

        var tip = d3.tip().attr('class','d3-tip').html(function(d){
          console.log(d);
          var html = '<span>' + d.values.length + ' events</span><br>'
          d.values.forEach(function(o){
            html += ''; //<span>' + (o.type || o.action_name) + '</span><br>'
          })
          html += '<span>' + moment(d.created_at).format('DD/MM/YYYY') + '</span>';
          return html;
        });

        svg.call(tip);

        svg.append('rect')
          .attr('fill', '#eee')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', size);

        var nested = d3.nest()
          .key(function(d) { return moment.tz(d.created_at, 'America/Mexico_City').format('YYYY/MM/DD'); })
          .entries(data);

        var eventsQuantity = d3.extent(nested, function(leave) { return leave.values.length; });
        var opacity = d3.scaleLinear()
          .range([0.3,1])
          .domain(eventsQuantity);

        console.log(nested);
        
        svg.selectAll('.event')
          .data(nested)
          .enter()
          .append('rect')
            .attr('class', 'event')
            .attr('x', function(d,i) { return scale(moment(d.key)); })
            .attr('y', 0)
            .attr('width', size)
            .attr('height', height)
            .attr('opacity', function(d){ return opacity(d.values.length); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on('click', function(d) {
              var selection = d3.select('#content-code').selectAll('.eventDay')
                .data(d.values, function(o) { return o.id; })
              
              selection.exit().remove();
              selection.enter()
                .append('p')
                .attr('class', 'eventDay')
                .text(function(o){ return JSON.stringify(o); })

            })
        }
      });
    });
  });
})();