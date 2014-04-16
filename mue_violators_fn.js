function draw_mue_display(canvas_div_id) {
   $(function() {
      $( "#hcpcs_accordion" ).accordion({
         collapsible: true
      });
      $( ".draggable" ).draggable({
         start: function(event, ui) { 
            dragged_hcpcs_id = d3.select(this).data()[0].hcpcs; 
            array_closure_reels.forEach(function(d) { d.reel_closure.drag_tutorial(); })
            },
         helper: "clone",
         revert: "false",
         stop: function(event, ui) {
            array_closure_reels.forEach(function(d) { d.reel_closure.rm_drag_tutorial(); })
            }
      });
      $( "ul, li" ).disableSelection();
      $( ".hcpcs_bubble" ).droppable({
         accept: ".draggable",
         tolerance: "touch",
         hoverClass: "hcpcs-bubble-hover",
         activeClass: "hcpcs-bubble-active",
         drop: function( event, ui ) {                 
            dropped_reel_id = $( this ).parents().attr("id");
            clear_reel(dropped_reel_id);
            populate_reel(dropped_reel_id, dragged_hcpcs_id);
         }
      });
   });

   /*
   $( window ).resize(function() {
      wndw_width = $( window ).width();
      column_0_x = 0.15 * wndw_width;
      column_1_x = column_0_x + 140;
      column_2_x = column_0_x + 380;
      column_3_x = column_0_x + 565;
      column_4_x = column_0_x + 815;
      column_5_x = column_0_x + 1065;
      resizer()
   })
   */

   d3.select("div#" + canvas_div_id).append("div").attr("class", "headline")
      .html("Utilization and MUE Violations of Drug Testing Procedure Codes");

   d3.select("div#" + canvas_div_id).append("div").attr("id", "title_reel");
   
   var title_svg = d3.select("div#title_reel").append("svg");
   title_svg
      .append("text").text("Total Cost for HCPCS, Annual")
      .attr("class", "chart-title").attr("id", "title_1")
      .attr("x", function() { return column_1_x + 5 + "px"; }).attr("y", "18px");
   title_svg
      .append("text").text("% of Cost Exceeding MUE")
      .attr("class", "chart-title").attr("id", "title_2")
      .attr("x", function() { return column_2_x - 10 + "px"; }).attr("y", "18px");
   title_svg
      .append("text").text("% of Overpayment by Top X NPIs")
      .attr("class", "chart-title").attr("id", "title_3")
      .attr("x", function() { return column_3_x + 8 + "px"; }).attr("y", "18px");
   title_svg
      .append("text").text("% of Overpayment, Top NPIs")
      .attr("class", "chart-title").attr("id", "title_4")
      .attr("x", function() { return column_4_x + 15 + "px"; }).attr("y", "18px");
   

   // Initialize to 3 Reels //
   d3.select("div#" + canvas_div_id).append("div").attr("id", "reel_1").attr("class", "code_reel").style("background-color", "#C5D0D4");
   d3.select("div#" + canvas_div_id).append("div").attr("id", "reel_2").attr("class", "code_reel").style("background-color", "#CBD8E3");
   d3.select("div#" + canvas_div_id).append("div").attr("id", "reel_3").attr("class", "code_reel").style("background-color", "#C5D0D4");

   label_1 = reel_label("reel_1", "83925"); 
   label_1(); 
   label_2 = reel_label("reel_2", "82542"); 
   label_2();
   label_3 = reel_label("reel_3", "83789"); 
   label_3();
   array_closure_reels.push({"reel_id":"reel_1", "reel_closure":label_1})
   array_closure_reels.push({"reel_id":"reel_2", "reel_closure":label_2})
   array_closure_reels.push({"reel_id":"reel_3", "reel_closure":label_3})

   d3.select("div#reel_1").append("svg").attr("id", "reel_1_svg").attr("class", "code_reel_svg");
   d3.select("div#reel_2").append("svg").attr("id", "reel_2_svg").attr("class", "code_reel_svg");
   d3.select("div#reel_3").append("svg").attr("id", "reel_3_svg").attr("class", "code_reel_svg");
   
   // DATA READ-IN //
   d3.csv("data/year_quant_test_mue.csv", function(dataset) {
      dataset.forEach(function(d) {
         hcpcs_yearly_data.push(
            {  "year": +d.year, "hcpcs": d.hcpcs_cd, "mue": +d.mue, "yr_npis": +d.n_npi, "yr_lines": +d.lines, "yr_units": +d.total_units, "yr_excess_units": +d.excess_units, 
               "yr_pmt": +d.linepmt, "yr_excess_pmt": +d.overpmt, "yr_not_excess_pmt": +d.not_in_excess_pmt, "yr_p_excess_pmt": +d.pct_overpmt * 100, "yr_p_not_excess_pmt": +d.pct_not_in_excess_pmt * 100,
               "yr_n_excess_npis": +d.n_npi_overpmt, "yr_n_excess_npis_90": +d.n_npi_90_pct, "yr_top_5_npi_pmt": +d.top_5_npi_pmt, "yr_top_5_npi_p_pmt": +d.pct_top_5_npi_pmt * 100
            });
      });
      var line_plot_1 = year_linechart("83925", "reel_1", "reel_1_line", "reel_1")
      line_plot_1();
      var line_plot_2 = year_linechart("82542", "reel_2", "reel_2_line", "reel_2")
      line_plot_2();
      var line_plot_3 = year_linechart("83789", "reel_3", "reel_3_line", "reel_3")
      line_plot_3();

      var bar_plot_1 = stackedbar("83925", "reel_1", "reel_1_bar", "reel_1"); 
      bar_plot_1(); 
      var bar_plot_2 = stackedbar("82542", "reel_2", "reel_2_bar", "reel_2"); 
      bar_plot_2(); 
      var bar_plot_3 = stackedbar("83789", "reel_3", "reel_3_bar", "reel_3"); 
      bar_plot_3(); 
   });

   d3.csv("data/anonymized_lab_data.csv", function(dataset) {
      dataset.forEach(function(d) {
         hcpcs_top_npi_data.push(
              {"year": +d.year, "hcpcs": d.hcpcs_cd, "top_x": +d.rank, "npi": d.npi, "name": d.name, "classification": d.classification, 
               "hcpcs_excess_pmt": +d.total_overpmt, "hcpcs_excess_benes": +d.total_excess_benes, 
               "npi_excess_pmt": +d.overpmt, "npi_p_excess_pmt": +d.pct_overpmt * 100, "npi_excess_benes": +d.excess_benes, "npi_p_excess_benes": +d.pct_excess_benes * 100, 
               "npi_excess_visits": +d.excess_visits, "npi_total_units": +d.total_units, "npi_excess_units": +d.excess_units, 
               "cumul_excess_pmt": +d.cumul_overpmt, "cumul_p_excess_pmt": +d.pct_cumul_overpmt * 100, "cumul_excess_benes": +d.cumul_unique_benes, "cumul_p_excess_benes": +d.pct_cumul_unique_benes * 100, 
               });
      });
      var raw_top_npi_names = [];
      hcpcs_top_npi_data.forEach(function(d) {
         raw_top_npi_names.push({"name": d.name, "npi": d.npi });
      })

      raw_top_npi_names.sort( function(a, b){ return a.npi - b.npi; } );
      for( var i=0; i<raw_top_npi_names.length-1; i++ ) {
        if ( raw_top_npi_names[i].npi == raw_top_npi_names[i+1].npi ) {
          delete raw_top_npi_names[i];
        }
      }
      // remove the "undefined entries"
      var top_npi_names = raw_top_npi_names.filter( function( el ){ return (typeof el !== "undefined"); } );
      console.log(top_npi_names)

      // Use JQueryUI "ComboBox" //
      var cbox_providers = d3.select("div#title_reel").append("div")
         .attr("id", "cbox_div")
         .style("position","absolute")
         .style("left", function() { return column_5_x + "px";})
         .style("top", "42px")
         .append("select").attr("id", "cbox_providers").style("width", 225);
      cbox_providers.selectAll("option")
         .data(top_npi_names).enter().append("option")
         .attr("value", function(d) { return d.name; })
         .text(function(d) { return d.name; });        
      $(function() { $("select").combobox(); });
      $(function() { $("input:text").focus(function() { 
            this.value = ""; 
         }) 
      });
      var cdf_plot_1 = npi_cumul_scatterplot("83925", "reel_1", "reel_1_cdf_npi", "reel_1")
      cdf_plot_1()
      var cdf_plot_2 = npi_cumul_scatterplot("82542", "reel_2", "reel_2_cdf_npi", "reel_2")
      cdf_plot_2()
      var cdf_plot_3 = npi_cumul_scatterplot("83789", "reel_3", "reel_3_cdf_npi", "reel_3")
      cdf_plot_3()

      var pdf_plot_1 = npi_pdf_scatterplot("83925", "reel_1", "reel_1_pdf_npi", "reel_1")
      pdf_plot_1()
      var pdf_plot_2 = npi_pdf_scatterplot("82542", "reel_2", "reel_2_pdf_npi", "reel_2")
      pdf_plot_2()
      var pdf_plot_3 = npi_pdf_scatterplot("83789", "reel_3", "reel_3_pdf_npi", "reel_3")
      pdf_plot_3()

      d3.selectAll("circle#scatter_pts").filter(function(d) { return (+d.year != 2013); })
         .classed("scatter_unchecked", 1);
   });

   d3.select("div#" + canvas_div_id).append("div").attr("id", "legend_reel")
   d3.select("#legend_reel").append("div").attr("id", "label_legend").attr("class", "legend_bubble").html("LEGEND").style("left", function() { return column_0_x; });
   var legend_svg = d3.select("#legend_reel").append("svg").attr("id", "legend_reel_svg").style("width", 1600);

   var g_stacked = legend_svg.append("g").attr("id", "year_stacked_legend").attr("transform", function() { return "translate(" + column_2_x + ",0)"; })
      g_stacked.append("rect").attr("y", 3).attr("fill", "rgba(255,255,255,0.55)").attr("width", 150).attr("height", 43)
      g_stacked.append("rect").attr("x", 25).attr("y", 9).attr("fill", "#7c152a").attr("width", 20).attr("height", 15);
      g_stacked.append("text").attr("x", 50).attr("y", 19).attr("fill", "#333").text("MUE Violations");
      g_stacked.append("rect").attr("x", 25).attr("y", 27).attr("fill", "#e6ce9d").attr("width", 20).attr("height", 15);
      g_stacked.append("text").attr("x", 50).attr("y", 39).attr("fill", "#333").text("Not in Excess");

   var g_scatter = legend_svg.append("g").attr("id", "npi_line_legend").attr("transform", function() { return "translate(" + column_3_x + ",0)";})
      g_scatter.append("rect").attr("y", 3).attr("fill", "rgba(255,255,255,0.55)").attr("width", 225).attr("height", 43);
      g_scatter.append("rect").attr("x", 58).attr("y", 13).attr("width", 15).attr("height", 3).attr("fill", "rgb(139,0,0)").attr("r", 4).attr("data-series", "2010");
      g_scatter.append("text").attr("x", 80).attr("y", 19).attr("fill", "#333").text("2010").attr("data-series", "2010");
      g_scatter.append("rect").attr("x", 58).attr("y", 31).attr("width", 15).attr("height", 3).attr("fill", "rgb(232,151,70)").attr("r", 4).attr("data-series", "2011");
      g_scatter.append("text").attr("x", 80).attr("y", 39).attr("fill", "#333").text("2011").attr("data-series", "2011");

      g_scatter.append("rect").attr("x", 130).attr("y", 13).attr("width", 15).attr("height", 3).attr("fill", "rgb(153,197,169)").attr("r", 4).attr("data-series", "2012");
      g_scatter.append("text").attr("x", 152).attr("y", 19).attr("fill", "#333").text("2012").attr("data-series", "2012");
      g_scatter.append("rect").attr("x", 130).attr("y", 31).attr("width", 15).attr("height", 3).attr("fill", "rgb(0,68,153)").attr("r", 4).attr("data-series", "2013");
      g_scatter.append("text").attr("x", 152).attr("y", 39).attr("fill", "#333").text("2013").attr("data-series", "2013");

   var g_scatter = legend_svg.append("g").attr("id", "npi_scatter_legend").attr("transform", function() { return "translate(" + column_4_x + ",0)";})
      g_scatter.append("rect").attr("y", 3).attr("fill", "rgba(255,255,255,0.55)").attr("width", 225).attr("height", 43);
      g_scatter.append("circle").attr("cx", 48).attr("cy", 15).attr("fill", "rgb(139,0,0)").attr("r", 4).attr("data-series", "2010");
      g_scatter.append("text").attr("x", 60).attr("y", 19).attr("fill", "#333").text("2010").attr("data-series", "2010");
      g_scatter.append("circle").attr("cx", 48).attr("cy", 33).attr("fill", "rgb(232,151,70)").attr("r", 4).attr("data-series", "2011");
      g_scatter.append("text").attr("x", 60).attr("y", 39).attr("fill", "#333").text("2011").attr("data-series", "2011");
      g_scatter.append("circle").attr("cx", 120).attr("cy", 15).attr("fill", "rgb(153,197,169)").attr("r", 4).attr("data-series", "2012");
      g_scatter.append("text").attr("x", 132).attr("y", 19).attr("fill", "#333").text("2012").attr("data-series", "2012");
      g_scatter.append("circle").attr("cx", 120).attr("cy", 33).attr("fill", "rgb(0,68,153)").attr("r", 4).attr("data-series", "2013");
      g_scatter.append("text").attr("x", 132).attr("y", 39).attr("fill", "#333").text("2013").attr("data-series", "2013");

   g_scatter.selectAll("text")
      .on("mousemove", function() { d3.select(this).style("cursor", "hand"); })
      .on("click", function() {
         var yr = d3.select(this).attr("data-series");
         if (!d3.select(this).classed("unchecked")) {
            d3.select(this).classed("unchecked", 1)
               .attr("text-decoration", "line-through");
            d3.selectAll("circle#scatter_pts").filter(function(d) { return (+d.year == +yr); })
               .classed("scatter_unchecked", 1);
         }
         else {
            d3.select(this).classed("unchecked", 0)
               .attr("text-decoration", "none");
            d3.selectAll("circle#scatter_pts").filter(function(d) { return (+d.year == +yr); })
               .classed("scatter_unchecked", 0);                  
         }               
      });

   g_scatter.selectAll("text").filter(function() { return (d3.select(this).attr("data-series") != 2013); })
      .classed("unchecked", 1)
      .attr("text-decoration", "line-through");
   
   legend_svg.append("rect")
      .attr("id", "legend_rect")
      .attr("fill", "url(#grad1)")
      .attr("width", 135).attr("height", 5)            
      .attr("x", function() { return column_4_x + 175; }).attr("y", 20);

   d3.select("#legend_reel_svg").append("text")
      .attr("fill", "#444")
      .text("<-- click year to display/hide data series from plot")
      .attr("id","legend_instructions")
      .attr("x", function() { return column_4_x + 175; }).attr("y", 20);

   /* Initiate Containers for NPI Detail Tables */
   d3.select("div#" + canvas_div_id).append("div").attr("id", "npi_detail_table_bg").attr("class", "npi_detail_div_bg").classed("not_shown", 1).style("left", function() { return column_5_x; });
   d3.select("div#" + canvas_div_id).append("div").attr("id", "npi_detail_table").attr("class", "npi_detail_div").classed("not_shown", 1).style("left", function() { return column_5_x; });

   /* Annotations to Charts */
   d3.select("div#" + canvas_div_id).append("div").attr("id","show_annotation")
      .style("left", column_0_x)
      .append("a").html("Show/Hide Notes").classed("gen_annotation_inactive",1)

   d3.select("div#" + canvas_div_id).append("div").attr("id","show_tutorial")
      .style("left", column_0_x)
      .append("a").html("Show Tutorial").classed("gen_annotation_inactive",1)

   /* MANUAL1: Elements Requiring Highly Manual Placement, Styling, and Content */
   var main_ann_div = d3.select("div#" + canvas_div_id).append("div").attr("id", "main_annotation_div").style("opacity", 0);
   main_ann_div.append("div").attr("id", "annotation_1_div").attr("class", "text-annotation")
      .style("height", "45px").style("width", "140px")
      .style("top", "500px")
      .style("left", function() { return column_1_x + 100 + "px"; })
      .html("Utilization of mass spectrometry increased by 9X since 2010");
   main_ann_div.append("div").attr("id", "annotation_2_div").attr("class", "text-annotation")
      .style("height", "30px").style("width", "110px")
      .style("top", "120px")
      .style("left", function() { return column_2_x + 100 + "px"; })
      .html("% of use in excess of the MUE is increasing");
   main_ann_div.append("div").attr("id", "annotation_3_div").attr("class", "text-annotation")
      .style("height", "45px").style("width", "150px")
      .style("top", "550px")
      .style("left", function() { return column_3_x + 100 + "px"; })
      .html("Use in excess of the MUE is concentrated very few providers for 83925 and 83789");
   main_ann_div.append("div").attr("id", "annotation_4_div").attr("class", "text-annotation")
      .style("height", "45px").style("width", "150px")
      .style("top", "500px")
      .style("left", function() { return column_4_x + 100 + "px"; })
      .html("Lab #118 accounts for ~100% of the use in excess of the MUE for 83789")

   function resizer() {
      title_svg.select("text#title_1").attr("x", function() { return column_1_x + 15; });
      title_svg.select("text#title_2").attr("x", function() { return column_2_x - 20; });
      title_svg.select("text#title_3").attr("x", function() { return column_3_x + 17; });
      title_svg.select("text#title_4").attr("x", function() { return column_4_x + 25; });
      d3.select("#label_legend").style("left", function() { return column_0_x; });
      d3.select("#year_stacked_legend").attr("transform", function() { return "translate(" + column_2_x + ",0)"; })
      d3.select("#npi_line_legend").attr("transform", function() { return "translate(" + column_3_x + ",0)";})
      d3.select("#npi_scatter_legend").attr("transform", function() { return "translate(" + column_4_x + ",0)";})
      d3.select("#legend_reel_svg").select("rect#legend_rect").attr("x", function() { return column_4_x + 175; });
      d3.select("#legend_instructions").attr("x", function() { return column_4_x + 175; });
      d3.select("#cbox_div").style("left", function() { return column_5_x;});
      d3.select("#npi_detail_table_bg").style("left", function() { return column_5_x; });
      d3.select("#npi_detail_table").style("left", function() { return column_5_x; });
      d3.select("#show_annotation").style("left", column_0_x)
      main_ann_div.select("#annotation_1_div").style("left", function() { return column_1_x + 50; });
      main_ann_div.select("#annotation_2_div").style("left", function() { return column_2_x + 50; });
      main_ann_div.select("#annotation_3_div").style("left", function() { return column_3_x + 60; });      
      main_ann_div.select("#annotation_4_div").style("left", function() { return column_4_x + 60; });
      d3.selectAll(".hcpcs_bubble").style("left", function() { return column_0_x; });
      d3.selectAll(".line_pane_class").attr("transform", function() { return "translate(" + column_1_x + ",0)"});
      d3.selectAll(".pdf_scatter_pane_class").attr("transform", function() { return "translate(" + column_4_x + ",0)"});
      d3.selectAll(".cdf_scatter_pane_class").attr("transform", function() { return "translate(" + column_3_x + ",0)"});
      d3.selectAll(".stacked_pane_class").attr("transform", function() { return "translate(" + column_2_x + ",0)"});
   }
   
   /* Event Handler for "Show Annotation" Button */
   d3.select("div#show_annotation").select("a")
      .on("mouseover", function() {
         d3.select(this)
            .style("cursor", "pointer")
            .classed("gen_annotation_inactive",0)
            .classed("gen_annotation_active",1)
      })
      .on("click", function() {             
         if (!d3.select(this).classed("gen_annotation_clicked")) {
            d3.select(this)
               .style("cursor", "default")
               .classed("gen_annotation_clicked",1)
               .classed("gen_annotation_inactive",0)
               .classed("gen_annotation_active",0)
            d3.select("div#main_annotation_div")
               .transition().duration(300)                     
               .style("opacity", 1);
         }
         else {
            d3.select(this)
               .style("cursor", "pointer")
               .classed("gen_annotation_clicked",0)
               .classed("gen_annotation_inactive",1)
               .classed("gen_annotation_active",0) 
            d3.select("div#main_annotation_div")
               .transition().duration(300)
               .style("opacity", 0);
         }
      })            
      .on("mouseout", function() {
         if (!d3.select(this).classed("gen_annotation_clicked")) {
            d3.select(this)
               .classed("gen_annotation_inactive",1)
               .classed("gen_annotation_active",0)
         }
      });            

   d3.select("div#show_tutorial").select("a")
      .on("mouseover", function() {
         d3.select(this)
            .style("cursor", "pointer")
            .classed("gen_annotation_inactive",0)
            .classed("gen_annotation_active",1)
      })
      .on("click", function() {             
         if (!d3.select(this).classed("gen_annotation_clicked")) {
            d3.select(this)
               .style("cursor", "default")
               .classed("gen_annotation_clicked",1)
               .classed("gen_annotation_inactive",0)
               .classed("gen_annotation_active",0)
            show_graphic_tutorial()
         }
         else {
            d3.select(this)
               .style("cursor", "pointer")
               .classed("gen_annotation_clicked",0)
               .classed("gen_annotation_inactive",1)
               .classed("gen_annotation_active",0) 
            rm_graphic_tutorial()
         }
      })            
      .on("mouseout", function() {
         if (!d3.select(this).classed("gen_annotation_clicked")) {
            d3.select(this)
               .classed("gen_annotation_inactive",1)
               .classed("gen_annotation_active",0)
         }
      });            

   d3.select("div#hcpcs_accordion div#quant_hcpcs div#list").select("ul").selectAll("li.draggable")
      .data(hcpcs_alias.sort(compare_hcpcs_name))
      .enter().append("li")
      .attr("class", "draggable")
      .html(function(d) { return d.hcpcs_name; });

   d3.select("div#hcpcs_accordion div#quant_hcpcs div#list").select("ul").selectAll("li.draggable").append("span")
      .attr("class", "hcpcs_menu_metric")
      .html(function(d) { return d.hcpcs; });

   d3.select(".hcpcs_sorter span#sorter_name").classed("sorted_on", 1)
   d3.select(".hcpcs_sorter span#sorter_name")
      .on("click", function() {
         d3.selectAll(".hcpcs_sorter span").classed("sorted_on", 0)
         d3.select(this).classed("sorted_on", 1)
         sort_hcpcs_menu(compare_hcpcs_name, 0)
      })
   d3.select(".hcpcs_sorter span#sorter_pmt")
      .on("click", function() {
         d3.selectAll(".hcpcs_sorter span").classed("sorted_on", 0)
         d3.select(this).classed("sorted_on", 1)
         sort_hcpcs_menu(compare_hcpcs_pmt, 0)
      })
   d3.select(".hcpcs_sorter span#sorter_ovp")
      .on("click", function() {
         d3.selectAll(".hcpcs_sorter span").classed("sorted_on", 0)
         d3.select(this).classed("sorted_on", 1)
         sort_hcpcs_menu(compare_hcpcs_ovp, 0)
      })
   d3.select(".hcpcs_sorter span#sorter_p_ovp")
      .on("click", function() {
         d3.selectAll(".hcpcs_sorter span").classed("sorted_on", 0)
         d3.select(this).classed("sorted_on", 1)
         sort_hcpcs_menu(compare_hcpcs_p_ovp, 0)
      })
}
