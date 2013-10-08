// Positioning
// Annotation
// Provider metrics table
// Link line and scatter
// Legend for line


function reel_label(hcpcs_div, code) {
   function gen_reel_label() {
      d3.select("div#" + hcpcs_div).selectAll("div#bubble_" + code)
         .data(hcp_select.filter(function(d) { return d.hcpcs == code; }))
         .enter().append("div")
         .style("left", function() { return column_0_x; })
         .attr("id", function(d, i) { return "bubble_" + code; })
         .attr("class", "hcpcs_bubble")
         .style("margin-top", 4).style("margin-bottom", 4).style("margin-left", 4);
      d3.select("div#bubble_" + code).append("table")
         .attr("id", function() { return "bubble_table_" + code; })
         .attr("width", "100%")
         .append("thead").append("td").attr("width", "100%").attr("height", 120).style("text-align", "center").style("vertical-align", "bottom")
         .html(function(d) { return "<h1>" + d.hcpcs + "</h1>"; });
      d3.select("#bubble_table_"  + code).append("tr").append("td").style("text-align", "center")
         .html(function(d) { return d.description; });
   }
   return gen_reel_label;
}

function year_linechart(hcpcs, line_div_id, plot_id, codename) {
   var x_padding = 35, y_padding = 15;
   var x_plot_displace = 10, y_plot_displace = 5;
   var width = 175;
   var height = 160;
   var x_domain = [2010,2013];
   var y_domain = [150000000, 0];
   var x_scale = d3.scale.linear().domain(x_domain).range([0, width - x_padding]);
   var y_scale = d3.scale.linear().domain(y_domain).range([0, height - y_padding]);
   var yr_formatter = d3.format("g");

   function gen_linechart() {
      var code_yr_filt_data = hcpcs_yearly_data.filter(function(d) { return d.hcpcs == hcpcs; });
      var x_axis = d3.svg.axis().scale(x_scale)
         .orient("bottom")
         .ticks(4).tickSubdivide(0).tickSize(6,3,0)
         .tickFormat(function(d) { return yr_formatter(d); } );

      var y_axis = d3.svg.axis().scale(y_scale)
         .orient("left")
         .ticks(6).tickSubdivide(4).tickSize(6,3,0)
         .tickFormat(function(d) { return "$" + price_formatter(d); } );

      var svg = d3.select("svg#" + line_div_id + "_svg")
         .attr("shape-rendering", "crispEdges")
         .attr("width", 250)
         .attr("height", 200);
      
      svg
         .append("g")
         .attr("id", function() { return plot_id + "_line_pane"; })
         .attr("transform", function() { return "translate(" + column_1_x + ",0)"});

      d3.selectAll("#" + plot_id + "_line_pane")
         .append("rect")
         .attr("fill", "rgba(255,255,255,0.55)")
         .attr("x", 0).attr("y", 0)
         .attr("height", 199)
         .attr("width", 200)
         .on("mouseover", function() { d3.select(this).attr("stroke", "#999") })         
         .on("mouseout", function() { d3.select(this).attr("stroke", "transparent") })
         .on("click", function() { 
            if (!d3.select(this).classed("ann_clicked")) {
               d3.select(this).classed("ann_clicked", 1)
               d3.select("#" + codename + "_bar_stacked_pane")
                  .transition().duration(500)
                  .attr("transform", function() { return "translate(550,0)"})
               d3.select("#" + codename + "_npi_scatter_pane")
                  .transition().duration(500)
                  .attr("transform", function() { return "translate(735,0)"})
               
               d3.select("#" + line_div_id).append("div").attr("id", "annotation_" + codename);
               var annotation_content = hcp_select.filter(function(d) { return d.hcpcs == hcpcs; })[0].annotation_line
               var annotation = annotate_chart(codename, "annotation_" + codename, annotation_content)
               annotation();
            }
            else { 
               d3.select(this).classed("ann_clicked", 0)
               remove_annotation("annotation_" + codename); 
               d3.select("#" + codename + "_bar_stacked_pane")
                  .transition().duration(500)
                  .attr("transform", function() { return "translate(415,0)"})
               d3.select("#" + codename + "_npi_scatter_pane")
                  .transition().duration(500)
                  .attr("transform", function() { return "translate(600,0)"}) 
            }
         });

      d3.selectAll("#" + plot_id + "_line_pane")
         .append("text").text("Year")
         .style("shape-rendering", "crispEdges")
         .attr("fill", "#666")
         .attr("x", 100).attr("y", function() { return height + 33; });

      function annotate_chart(codename, ann_div_id, content) {
         function gen_annotation() {
            d3.select("div#" + ann_div_id)
               .style("width", 0).style("height", 0)
               .attr("class", "annotation")
               .style("top", function() {
                  if (codename == "opiate") { return 51; }
                  else if (codename == "chromatography") { return 266; }
                  else if (codename == "mass_spectrometry") { return 481; }
                  })
               .style("left", 385)
               .transition().duration(350)
               .style("height", 188);
            d3.select("div#" + ann_div_id)
               .transition().duration(250).delay(350)
               .style("width", 150);
            setTimeout(function() {
               d3.select("div#" + ann_div_id)
                  .html(content);
               }, 600)
         }
         return gen_annotation;
      }
      function remove_annotation(ann_div_id) { d3.select("div#" + ann_div_id).remove(); }

      d3.select("#" + plot_id + "_line_pane")
         .append("g").attr("class", "x axis")
         .append("line").attr("id", "axis")
         .attr("x1", function() { return 0; })
         .attr("y1", 0)
         .attr("x2", function() { return width - x_padding; })
         .attr("y2", 0)
      svg.select("#" + plot_id + "_line_pane").select(".x.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding) + "," + (height) + ")"})
         .call(x_axis);
      d3.select("#" + plot_id + "_line_pane")
         .append("g").attr("class", "y axis")
         .append("line").attr("id", "axis")
         .attr("x1", 0)
         .attr("y1", 0)
         .attr("x2", 0)
         .attr("y2", function() { return height - y_padding; })
      svg.select("#" + plot_id + "_line_pane").select(".y.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding) + "," + (y_padding) + ")"})
         .call(y_axis);
      
      var linechart_line = d3.svg.line()
         .x(function(d) { return x_scale(d.year) + x_plot_displace + x_padding; })
         .y(function(d) { return y_scale(d.yr_pmt) + y_padding; })
         .interpolate("linear");

      d3.select("#" + plot_id + "_line_pane")
         .append("path")
         .attr("d", function() { return linechart_line(code_yr_filt_data); })
         .attr("id", function() { return hcpcs + "_trend"; })
         .style("shape-rendering", "auto")
         .attr("fill", "transparent")
         .attr("stroke-width", 2)
         .attr("stroke", "#406584");

      d3.select("#" + plot_id + "_line_pane").selectAll("circle")
         .data(code_yr_filt_data).enter().append("circle")
         .style("shape-rendering", "auto")
         .attr("cx", function(d) { return x_scale(d.year) + x_plot_displace + x_padding; })
         .attr("cy", function(d) { return y_scale(d.yr_pmt) + y_padding; })
         .attr("r", 2)
         .attr("fill", "#406584")
         .attr("stroke-width", 10)
         .attr("stroke", "transparent");
      
      d3.select("g#" + plot_id + "_line_pane").selectAll("circle")
         .on("mouseover", function() { 
            d3.select(this).attr("fill", "#cc181e"); 
            gen_chart_tip(d3.select(this).data()[0].year, d3.select(this).attr("cx"), d3.select(this).attr("cy"))
            })
         .on("mouseout", function() {
            d3.select(this).attr("fill", "#406584");
            remove_chart_tip();
            });
      
      d3.select("#" + plot_id + "_line_pane").append("g").attr("id","chart_ttip");
      function gen_chart_tip(year, year_x, year_y) {
         var charttip_data = code_yr_filt_data.filter(function(d) { return (d.year == year); });
         d3.select("#" + plot_id + "_line_pane").select("g#chart_ttip").selectAll("text")
            .data(charttip_data).enter().append("text")
            .style("shape-rendering", "crispEdges")
            .text(function(d) { return "$" + price_formatter_full(+d.yr_pmt.toPrecision(3)); })
            .attr("text-anchor", function(d) {
               if (d.year == 2010) { return "start";}
               else if (d.year == 2013) { return "end";}
               else { return "middle"; }
               })
            .attr("x", function() { return 0 + (+year_x); })
            .attr("y", function() { return (+year_y) - 6; })
            .attr("fill", "#333");
      }
      function remove_chart_tip() { d3.select("#" + plot_id + "_line_pane").select("g#chart_ttip").selectAll("text").remove() };
   }
   return gen_linechart;
}

/* --------------------------------- PDF Scatter Plot ------------------------------------*/
function npi_pdf_scatterplot(hcpcs, scatter_div_id, plot_id, codename) {
   var x_padding = 30, y_padding = 15;
   var x_plot_displace = 10, y_plot_displace = 5;
   var width = 200;
   var height = 160;
   var x_domain = [1,10];
   var y_domain = [100, 0];
   var x_scale = d3.scale.linear().domain(x_domain).range([0, width - x_padding]);
   var y_scale = d3.scale.linear().domain(y_domain).range([0, height - y_padding]);

   function gen_scatterplot() {
      var npi_code_filt_data = hcpcs_top_npi_data.filter(function(d) { return d.hcpcs == hcpcs; });
      var x_axis = d3.svg.axis().scale(x_scale)
         .orient("bottom")
         .ticks(10).tickSubdivide(4).tickSize(6,3,0);

      var y_axis = d3.svg.axis().scale(y_scale)
         .orient("left")
         .ticks(6).tickSubdivide(4).tickSize(6,3,0)
         .tickFormat(function(d) { return d + "%"; } );

      var svg = d3.select("#" + scatter_div_id + "_svg")
         .attr("shape-rendering", "crispEdges")
         .attr("width", 225)
         .attr("height", 200);
      
      svg
         .append("g")
         .attr("id", function() { return plot_id + "_scatter_pane"; })
         .attr("transform", function() { return "translate(" + column_4_x + ",0)"});

      d3.selectAll("#" + plot_id + "_scatter_pane")
         .append("rect")
         .attr("fill", "rgba(255,255,255,0.55)")
         .attr("x", 0)
         .attr("y", 0)
         .attr("height", 400)
         .attr("width", 225);

      d3.select("#" + plot_id + "_scatter_pane")
         .append("g").attr("class", "x axis")
         .append("line").attr("id", "axis")
         .attr("x1", function() { return 0; })
         .attr("y1", 0)
         .attr("x2", function() { return width - x_padding; })
         .attr("y2", 0)
      svg.select("#" + plot_id + "_scatter_pane").select(".x.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding) + "," + (height) + ")"})
         .call(x_axis);
      d3.select("#" + plot_id + "_scatter_pane")
         .append("g").attr("class", "y axis")
         .append("line").attr("id", "axis")
         .attr("x1", 0)
         .attr("y1", 0)
         .attr("x2", 0)
         .attr("y2", function() { return height - y_padding; })
      svg.select("#" + plot_id + "_scatter_pane").select(".y.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding) + "," + (y_padding) + ")"})
         .call(y_axis);

      d3.selectAll("#" + plot_id + "_scatter_pane")
         .append("text").text("Provider Ranking in Overpayment")
         .style("shape-rendering", "crispEdges")
         .attr("fill", "#666")
         .attr("x", 45).attr("y", function() { return height + 33; });

      d3.select("g#" + plot_id + "_scatter_pane").selectAll("circle")
         .data(npi_code_filt_data)
         .enter().append("circle")
         .style("shape-rendering", "auto")
         .attr("id", "scatter_pts")         
         .attr("fill", function(d) {
            if (d.year == 2010) { return "rgb(139,0,0)"; }
            else if (d.year == 2011) { return "rgb(232,151,70)"; }
            else if (d.year == 2012) { return "rgb(153,197,169)"; }
            else if (d.year == 2013) { return "rgb(0,68,153)"; }
         })
         .attr("stroke-width", 7)
         .attr("stroke", "transparent")
         .attr("cx", function(d) { return x_scale(d.top_x) + x_plot_displace + x_padding; })
         .attr("cy", function(d) { return y_scale(d.npi_p_excess_pmt) + y_padding ; })
         .attr("r", 2);
      /*
      auc_shader(5);
      function auc_shader(top_x_value) {
         var top_x_data = npi_code_filt_data.filter(function(d) { return (d.top_x <= top_x_value); });
         var scatter_line = d3.svg.area()
            .x(function(d) { return x_scale(d.top_x) + x_plot_displace + x_padding; })
            .y0(function(d) { return y_scale(0) + y_padding; })
            .y1(function(d) { return y_scale(d.npi_p_excess_pmt) + y_padding; })
            .interpolate("basis");

         d3.select("g#opiate_scatter_pane")
            .append("path")
            .attr("d", function() { return scatter_line(top_x_data); })
            .attr("id", "interpolate")
            .attr("fill", "#cc181e")
            .attr("opacity", 0.75)
            .attr("stroke", "#333");
      }
      */
      // More generally, a generate annotation function
      d3.select("g#" + plot_id + "_scatter_pane").selectAll("circle")
         .on("mouseover", function() { 
            d3.select(this).classed("scatter_hover", 1)
            d3.select(this).attr("stroke", "#7c152a");
            gen_chart_tip("chart_ttip", d3.select(this).data()[0].npi, d3.select(this).attr("cx"), d3.select(this).attr("cy"))
            })
         .on("mouseout", function() {
            d3.select(this).classed("scatter_hover", 0)            
            d3.select(this).attr("stroke", "transparent");            
            remove_chart_tip("chart_ttip");
            })
         .on("click", function() {
            if (!d3.select(this).classed("scatter_click")) {
               d3.select("g#" + plot_id + "_scatter_pane").selectAll("circle.scatter_click")
                  .attr("r", 2)
                  .attr("stroke-width", 7)
                  .classed("scatter_click", 0)
               remove_chart_tip("chart_ttip_clicked");
               remove_npi_detail_table();
               var store_npi = d3.select(this).data()[0].npi;
               d3.select("g#" + plot_id + "_scatter_pane").selectAll("circle").filter(function(d, i) { return (d.npi == store_npi); })
                  .attr("r", 6)
                  .attr("stroke-width", 1)
                  .classed("scatter_click", 1)
               gen_chart_tip("chart_ttip_clicked", d3.select(this).data()[0].npi, d3.select(this).attr("cx"), d3.select(this).attr("cy"))
               gen_npi_detail_table(d3.select(this).data()[0].name)
            }
            else {
               d3.select("g#" + plot_id + "_scatter_pane").selectAll("circle.scatter_click")
                  .attr("r", 2)
                  .attr("stroke-width", 7)
                  .classed("scatter_click", 0)
               remove_chart_tip("chart_ttip_clicked");
               remove_npi_detail_table();
            }
         });
      
      d3.select("#" + plot_id + "_scatter_pane").append("g").attr("id","chart_ttip_clicked");
      d3.select("#" + plot_id + "_scatter_pane").append("g").attr("id","chart_ttip");
      function gen_chart_tip(ttip_id, npi_value, npi_x, npi_y) {
         var charttip_data = npi_code_filt_data.filter(function(d) { return (d.npi == npi_value); });
         d3.select("#" + plot_id + "_scatter_pane").select("g#" + ttip_id).selectAll("rect")
            .data(charttip_data).enter().append("rect")
            .attr("fill", "url(#grad1)")
            .attr("height", 14)
            .attr("width", 100)
            .attr("x", function() { return (+npi_x) - 2; })
            .attr("y", function() { return (+npi_y) - 17; });
         d3.select("#" + plot_id + "_scatter_pane").select("g#" + ttip_id).selectAll("text")
            .data(charttip_data).enter().append("text")
            .style("shape-rendering", "crispEdges")
            .text(function(d) { return d.name; })
            .attr("text-anchor", "start")
            .attr("x", function() { return 0 + (+npi_x); })
            .attr("y", function() { return (+npi_y) - 6; })
            .attr("fill", "#333");
      }
      function remove_chart_tip(ttip_id) { 
         d3.select("#" + plot_id + "_scatter_pane").select("g#" + ttip_id).selectAll("text").remove()
         d3.select("#" + plot_id + "_scatter_pane").select("g#" + ttip_id).selectAll("rect").remove();
         };

      d3.select("#" + scatter_div_id).append("div").attr("id", function() { return codename + "_npi_table"; }).attr("class", "npi_stat_table");
      function gen_npi_stat_table(npi_value, year_id) {
         var table_data = npi_code_filt_data.filter(function(d) { return (d.npi == npi_value) & (+d.year == year_id); });
         d3.select("#" + scatter_div_id).select("#" + codename + "_npi_table")
            .style("width", 275).style("left", function() { return column_4_x + 240; })
            .classed("table_click", 1)
            .style("top", function() {
               if (codename == "opiate") { return 50; }
               else if (codename == "chromatography") { return 265; }
               else if (codename == "mass_spectrometry") { return 480; }
               })
            .style("height", "120px");

         d3.select("#" + codename + "_npi_table").selectAll("table#" + codename + "_npi_stats")
            .data(table_data).enter()
            .append("table").attr("id", function() { return codename + "_npi_stats"; })
            .attr("width", "100%")
            .append("thead").append("td").attr("colspan", 2)
            .html(function(d) { return d.name + " (" + d.year + ") <br> <span> " + d.classification + " </span>"; });

         d3.select("#" + codename + "_npi_table").select("table#" + codename + "_npi_stats")
            .append("tr").attr("id", "row_1").append("td").classed("metric_name", 1)
            .html("Total Overpayment: ");
         d3.select("#" + codename + "_npi_table").select("table#" + codename + "_npi_stats").select("tr#row_1")
            .append("td").classed("metric_value", 1)
            .html(function(d) { return "$" + price_formatter_full(d.npi_excess_pmt); });

         d3.select("#" + codename + "_npi_table").select("table#" + codename + "_npi_stats")
            .append("tr").attr("id", "row_2").append("td").classed("metric_name", 1)
            .html("% of Code Overpayment: ");
         d3.select("#" + codename + "_npi_table").select("table#" + codename + "_npi_stats").select("tr#row_2")
            .append("td").classed("metric_value", 1)
            .html(function(d) { return d.npi_p_excess_pmt.toPrecision(2) + "%"; });

         d3.select("#" + codename + "_npi_table").select("table#" + codename + "_npi_stats")
            .append("tr").attr("id", "row_3").append("td").classed("metric_name", 1)
            .html("% of Excess Benes: ");
         d3.select("#" + codename + "_npi_table").select("table#" + codename + "_npi_stats").select("tr#row_3")
            .append("td").classed("metric_value", 1)
            .html(function(d) { return d.npi_p_excess_benes.toPrecision(2) + "%"; });
      }
      function remove_npi_stat_table() {
         d3.select("table#" + codename + "_npi_stats").remove()
         d3.select("#" + scatter_div_id).select("#" + codename + "_npi_table")         
            .classed("table_click", 0)
      }
   }
   return gen_scatterplot;
}

/* --------------------------------- Cumulative Interpolated Curve Plot ------------------------------------*/
function npi_cumul_scatterplot(hcpcs, scatter_div_id, plot_id, codename) {
   var x_padding = 30, y_padding = 15;
   var x_plot_displace = 10, y_plot_displace = 5;
   var width = 200;
   var height = 160;
   var x_domain = [1,10];
   var y_domain = [100, 0];
   var x_scale = d3.scale.linear().domain(x_domain).range([0, width - x_padding]);
   var y_scale = d3.scale.linear().domain(y_domain).range([0, height - y_padding]);

   function gen_scatterplot() {
      var npi_code_filt_data = hcpcs_top_npi_data.filter(function(d) { return d.hcpcs == hcpcs; });
      var x_axis = d3.svg.axis().scale(x_scale)
         .orient("bottom")
         .ticks(10).tickSubdivide(4).tickSize(6,3,0);

      var y_axis = d3.svg.axis().scale(y_scale)
         .orient("left")
         .ticks(6).tickSubdivide(4).tickSize(6,3,0)
         .tickFormat(function(d) { return d + "%"; } );

      var svg = d3.select("#" + scatter_div_id + "_svg")
         .attr("shape-rendering", "crispEdges")
         .attr("width", 225)
         .attr("height", 200);
      
      svg
         .append("g")
         .attr("id", function() { return plot_id + "_scatter_pane"; })
         .attr("transform", function() { return "translate(" + column_3_x + ",0)"});

      d3.selectAll("#" + plot_id + "_scatter_pane")
         .append("rect")
         .attr("fill", "rgba(255,255,255,0.55)")
         .attr("x", 0)
         .attr("y", 0)
         .attr("height", 400)
         .attr("width", 225);

      d3.select("#" + plot_id + "_scatter_pane")
         .append("g").attr("class", "x axis")
         .append("line").attr("id", "axis")
         .attr("x1", function() { return 0; })
         .attr("y1", 0)
         .attr("x2", function() { return width - x_padding; })
         .attr("y2", 0)
      svg.select("#" + plot_id + "_scatter_pane").select(".x.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding) + "," + (height) + ")"})
         .call(x_axis);
      d3.select("#" + plot_id + "_scatter_pane")
         .append("g").attr("class", "y axis")
         .append("line").attr("id", "axis")
         .attr("x1", 0)
         .attr("y1", 0)
         .attr("x2", 0)
         .attr("y2", function() { return height - y_padding; })
      svg.select("#" + plot_id + "_scatter_pane").select(".y.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding) + "," + (y_padding) + ")"})
         .call(y_axis);

      d3.selectAll("#" + plot_id + "_scatter_pane")
         .append("text").text("Top X Providers")
         .style("shape-rendering", "crispEdges")
         .attr("fill", "#666")
         .attr("x", 85).attr("y", function() { return height + 33; });
          
      line_interp(plot_id, 2010);
      line_interp(plot_id, 2011);
      line_interp(plot_id, 2012);
      line_interp(plot_id, 2013);
      d3.select("g#" + plot_id + "_scatter_pane")
         .append("text").attr("id", function() { return plot_id + "yr_label"; })
      d3.selectAll("#" + plot_id + "_tp_yr_path")
         .on("mousemove", function() {
            d3.select("#" + plot_id + "_" + d3.select(this).attr("data-year") + "_yr_path").classed("yr_path_hover", 1);
            var mouse_container = d3.select("#" + plot_id + "_scatter_pane");
            d3.select("#" + plot_id + "yr_label").text(d3.select(this).attr("data-year"))
               .attr("fill", "#333").attr("text-anchor", "middle")
               .attr("x", d3.mouse(mouse_container.node())[0]).attr("y", d3.mouse(mouse_container.node())[1] - 5);
            })
         .on("mousedown", function() { 
            d3.select("#" + plot_id + "_" + d3.select(this).attr("data-year") + "_yr_path").classed("yr_path_hover", 1);
            d3.select("#" + plot_id + "_" + d3.select(this).attr("data-year") + "_yr_path").classed("yr_path_click", 1);
            })
         .on("mouseup", function() { d3.select("#" + plot_id + "_" + d3.select(this).attr("data-year") + "_yr_path").classed("yr_path_click", 0); })
         .on("mouseout", function() {
            d3.select("#" + plot_id + "_" + d3.select(this).attr("data-year") + "_yr_path").classed("yr_path_hover", 0);
            d3.select("#" + plot_id + "_" + d3.select(this).attr("data-year") + "_yr_path").classed("yr_path_click", 0);
            d3.select("#" + plot_id + "yr_label").text("");
            });

      function line_interp(plot_id, year_id) {
         var year_top_x_data = npi_code_filt_data.filter(function(d) { return (d.year == year_id); });
         var scatter_line = d3.svg.line()
            .x(function(d) { return x_scale(d.top_x) + x_plot_displace + x_padding; })
            .y(function(d) { return y_scale(d.cumul_p_excess_pmt) + y_padding; })
            .interpolate("basis");

         d3.select("g#" + plot_id + "_scatter_pane")
            .append("path").style("shape-rendering", "auto")
            .attr("d", function() { return scatter_line(year_top_x_data); })
            .attr("id", function() { return plot_id + "_" + year_id + "_yr_path"; })
            .attr("fill", "none")
            .attr("opacity", 0.75)
            .attr("stroke-width", 2)
            .attr("data-year", year_id)
            .attr("stroke", function() {
               if (year_id == 2010) { return "rgb(139,0,0)"; }
               else if (year_id == 2011) { return "rgb(232,151,70)"; }
               else if (year_id == 2012) { return "rgb(153,197,169)"; }
               else if (year_id == 2013) { return "rgb(0,68,153)"; }
            });
         
         d3.select("g#" + plot_id + "_scatter_pane")
            .append("path").style("shape-rendering", "auto")
            .attr("d", function() { return scatter_line(year_top_x_data); })
            .attr("id", function() { return plot_id + "_tp_yr_path"; })
            .attr("fill", "none")
            .attr("stroke-width", 8)
            .attr("data-year", year_id)
            .attr("stroke", "transparent");

      }
   }
   return gen_scatterplot;
}


function stackedbar(hcpcs, stacked_div_id, plot_id, codename) {
   var x_buffer = 15;
   var x_padding = 30, y_padding = 15;            
   var x_plot_displace = 10, y_plot_displace = 5;
   var width = 100;
   var height = 160;
   var x_domain = [2010,2013];
   var y_domain = [100, 0];
   var x_scale = d3.scale.linear().domain(x_domain).range([0, width - x_padding]);
   var y_scale = d3.scale.linear().domain(y_domain).range([0, height - y_padding]);
   
   function gen_stackedbar() {
      var select_code_data = hcpcs_yearly_data.filter( function(d) { return d.hcpcs == hcpcs; })
      var x_axis = d3.svg.axis().scale(x_scale)
         .orient("bottom")
         .ticks(4).tickSubdivide(0).tickSize(6,3,0)
         .tickFormat(function(d) { 
            if (d == 2010) { return "'10"; }
            else if (d == 2011) { return "'11"; }
            else if (d == 2012) { return "'12"; }
            else if (d == 2013) { return "'13"; }
         });                   

      var y_axis = d3.svg.axis().scale(y_scale)
         .orient("left")
         .ticks(6).tickSubdivide(4).tickSize(6,3,0)
         .tickFormat(function(d) { return d + "%"; } );

      var svg = d3.select("#" + stacked_div_id + "_svg")
         .attr("shape-rendering", "crispEdges")
         .attr("width", 225)
         .attr("height", 200);

      svg
         .append("g")
         .attr("id", function() { return plot_id + "_stacked_pane"; })
         .attr("transform", function() { return "translate(" + column_2_x + ",0)"});

      d3.selectAll("#" + plot_id + "_stacked_pane")
         .append("rect")
         .attr("fill", "rgba(255,255,255,0.55)")
         .attr("x", 0)
         .attr("y", 0)
         .attr("width", 150)
         .attr("height", 200);

      d3.selectAll("#" + plot_id + "_stacked_pane")
         .append("text").text("Year")
         .style("shape-rendering", "crispEdges")
         .attr("fill", "#666")
         .attr("x", 75).attr("y", function() { return height + 33; });

      d3.select("#" + plot_id + "_stacked_pane")
         .append("g").attr("class", "x axis")
         .append("line").attr("id", "axis")
         .attr("x1", function() { return - x_buffer; })
         .attr("y1", 0)
         .attr("x2", function() { return width - x_padding + 8; })
         .attr("y2", 0)
      svg.select("#" + plot_id + "_stacked_pane").select(".x.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding + x_buffer) + "," + (height) + ")"})
         .call(x_axis);
      d3.select("#" + plot_id + "_stacked_pane")
         .append("g").attr("class", "y axis")
         .append("line").attr("id", "axis")
         .attr("x1", 0)
         .attr("y1", 0)
         .attr("x2", 0)
         .attr("y2", function() { return height - y_padding; })
      svg.select("#" + plot_id + "_stacked_pane").select(".y.axis")
         .attr("transform", function() { return "translate(" + (x_plot_displace + x_padding) + "," + (y_padding) + ")"})
         .call(y_axis);

      d3.select("g#" + plot_id + "_stacked_pane").selectAll("rect#yearly_mue")
         .data(select_code_data)
         .enter().append("rect")
         .attr("id", "yearly_mue")
         .attr("x", function(d) { return x_scale(d.year) + x_plot_displace + x_padding - 8 + x_buffer; })
         .attr("y", function(d) { return y_scale(d.yr_p_excess_pmt) + y_padding ; })
         .attr("height", function(d) { return height - (y_scale(d.yr_p_excess_pmt) + y_padding); })
         .attr("fill", "#7c152a")
         .attr("width", 16);

      d3.select("g#" + plot_id + "_stacked_pane").selectAll("rect#yearly_non")
         .data(select_code_data)
         .enter().append("rect")
         .attr("id", "yearly_non")
         .attr("x", function(d) { return x_scale(d.year) + x_plot_displace + x_padding - 8 + x_buffer; })
         .attr("y", function(d) { return y_scale(100) + y_padding ; })
         .attr("height", function(d) { return (y_scale(d.yr_p_excess_pmt)); })
         .attr("fill", "#e6ce9d")
         .attr("width", 16);
   }
   return gen_stackedbar;
}


function gen_npi_detail_table(selected_name) {
   $( "input" ).val(selected_name);
   $( "#npi_detail_table" ).show("blind", 250);
   $( "#npi_detail_table_bg" ).show("blind", 250);
   
   d3.select("div#npi_detail_table").append("div").attr("id", "detail_heading").style("border-bottom", "1 solid #406584")
   d3.select("div#npi_detail_table").append("div").attr("id", "detail_body")   
   var npi_detail_data = hcpcs_top_npi_data.filter(function(d) { return d.name == selected_name; });
   
   var ul_heading = d3.select("div#detail_heading").append("ul")
   ul_heading.append("li").classed("specialty", 1).text(npi_detail_data[0].classification)
   var table_body = d3.select("div#detail_body").append("table").attr("id", "detail_body_table").attr("width", 300).style("padding-left", 3);
   var table_thead = table_body.append("thead")
   table_thead.append("td").attr("width", "44%").html("")
   table_thead.append("td").attr("width", "14%").html("'10")
   table_thead.append("td").attr("width", "14%").html("'11")
   table_thead.append("td").attr("width", "14%").html("'12")
   table_thead.append("td").attr("width", "14%").html("'13")

   hcpcs_cd_list.forEach(function(code) {
      var working_hcp_npi_detail_data = npi_detail_data.filter(function(d) { return d.hcpcs == code; });
   })
}
function remove_npi_detail_table() {
   d3.select("div#detail_heading").remove()
   d3.select("div#detail_body").remove()
   $( "#npi_detail_table" ).hide();
   $( "#npi_detail_table_bg" ).hide();
   $( "input" ).val("CHOOSE A PROVIDER");
}

// ComboBox Implementation
$(function() {
   $.widget("ui.combobox", {
      _create: function() {
         var self = this;
         var select = this.element.hide(), 
            selected = select.children(":selected"), 
            value = selected.val() ? selected.text() : "";
         var input = $("<input />").insertAfter(select)
            .addClass("input_field")
            .val("CHOOSE A PROVIDER")
            .tooltip({
               tooltipClass: "ui-state-highlight"
            })
            .autocomplete({
               delay: 0,
               minLength: 0,
               source: function(request, response) {
                  var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i");
                  response( select.children("option").map(function() {
                     var text = $(this).text();
                     if (this.value && (!request.term || matcher.test(text) ))
                        return {
                           label: text.replace(
                              new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(request.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"),
                              "<strong>$1</strong>"),
                           value: text, 
                           option: this
                           };
                  }) );
               },
               select: function(event, ui) {
                  remove_npi_detail_table()
                  ui.item.option.selected = true;
                  self._trigger( "selected", event, {
                     item: ui.item.option
                  });
                  gen_npi_detail_table($("select").val())
               },
               change: function(event, ui) {
                  if ( !ui.item ) {
                     var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i"),
                     valid = false;
                     select.children( "option" ).each(function() {
                        if ( this.value.match( matcher )) {
                           this.selected = valid = true;
                           return false;
                        }
                     });
                     if ( !valid ) {
                        $(this).val("");
                        select.val("");
                        return false;
                     }
                  }
                  
               }
            })
            .addClass("li_sel_value ui-widget ui-widget-content ui-corner-left ui-state-default");
         input.data( "uiAutocomplete" )._renderItem = function( ul, item ) {
            return $( "<li></li>" )
              .data( "item.autocomplete", item )
              .append( "<a>" + item.label + "</a>" )
              .addClass( "li_values" )
              .appendTo( ul );
         };
         $( "<button> </button>" )
         .attr( "tabIndex", -1 )
         .attr( "title", "Show All Providers" )
         .tooltip()
         .insertAfter( input )
         .button({
            icons: { primary: "ui-icon-triangle-1-s" },
            text: false
         })
         .removeClass( "ui-corner-all" )
         .addClass( "ui-corner-right ui-button-icon combobox_button" )
         .click(function() {
            if (input.autocomplete("widget").is(":visible")) {
              input.autocomplete("close");
              return;
            }
            input.autocomplete("search", "");
            input.focus();
         });
      }
   });
});
