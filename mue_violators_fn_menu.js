function clear_reel(reel_id) { d3.select("div#" + reel_id).select("svg").remove() }

function populate_reel(reel_id, hcpcs) {            
   array_closure_reels.filter(function(d) { return d.reel_id == reel_id; })[0].reel_closure.change_hcpcs(hcpcs);

   d3.select("div#" + reel_id).append("svg").attr("id", reel_id + "_svg").attr("class", "code_reel_svg");
   var line_plot = year_linechart(hcpcs, reel_id, reel_id + "_line", reel_id)
   line_plot();
   var bar_plot = stackedbar(hcpcs, reel_id, reel_id + "_bar", reel_id); 
   bar_plot();
   var cdf_plot = npi_cumul_scatterplot(hcpcs, reel_id, reel_id + "_cdf_npi", reel_id)
   cdf_plot();
   var pdf_plot = npi_pdf_scatterplot(hcpcs, reel_id, reel_id + "_pdf_npi", reel_id)
   pdf_plot();
   $( ".hcpcs_bubble" ).droppable({
      accept: ".draggable",
      tolerance: "touch",
      hoverClass: "hcpcs-bubble-hover",
      activeClass: "hcpcs-bubble-active",
      drop: function( event, ui ) {
         dropped_reel_id = $( this ).parents().attr("id");
         clear_reel(dropped_reel_id);
         populate_reel(dropped_reel_id, dragged_hcpcs_id)
      }
   });
}

function sort_hcpcs_menu(sort_option, metric_var) {
   d3.select("div#hcpcs_accordion div#quant_hcpcs div#list").select("ul").selectAll("li.draggable")
      .data(hcpcs_alias.sort(sort_option))
      .html(function(d) { return d.hcpcs_name; });
   
   d3.select("div#hcpcs_accordion div#quant_hcpcs div#list").select("ul").selectAll("li.draggable").append("span")
      .attr("class", "hcpcs_menu_metric")
      .html(function(d) { return d.hcpcs; });
}

function compare_hcpcs_name(a, b) {
   if (a.hcpcs_name < b.hcpcs_name) { return -1; }
   if (a.hcpcs_name > b.hcpcs_name) { return 1; }
   else { return 0; }
}
function compare_hcpcs_pmt(a, b) {
   if (a.pmt < b.pmt) { return 1; }
   if (a.pmt > b.pmt) { return -1; }
   else { return 0; }
}
function compare_hcpcs_ovp(a, b) {
   if (a.ovp < b.ovp) { return 1; }
   if (a.ovp > b.ovp) { return -1; }
   else { return 0; }
}
function compare_hcpcs_p_ovp(a, b) {
   if (a.p_ovp < b.p_ovp) { return 1; }
   if (a.p_ovp > b.p_ovp) { return -1; }
   else { return 0; }
}

function initialize_graphic_tutorial() {
   var tutorial_svg = d3.select("div#draw_area").append("svg").attr("id", "tutorial_svg")
      .style("position", "absolute").style("left", "315px").style("top", "90px")
      .attr("width", "250px").attr("height", "43px").attr("opacity", 0)
   tutorial_svg.append("g").attr("id", "tutorial_accordion").attr("class", "tutorial_blurb")
      .attr("transform", "translate(0,0)")
      .append("img").attr("class", "iconic tutorial_arrow").attr("data-src", "icons/iconic/flat/arrow-thick-left-fill-acute-md.svg")
      .attr("width", "15px").attr("height", "15px");
   tutorial_svg.select("#tutorial_accordion")
      .append("line").attr("x1", "36px").attr("x2", "286px").attr("y1", "1px").attr("y2", "1px")
      .attr("stroke", "#f5b232").style("shape-rendering", "crispEdges")
   tutorial_svg.select("#tutorial_accordion")
      .append("rect").attr("x", "36px").attr("y", "2px").attr("width", "214px").attr("height", "40px")
      .attr("fill", "url(#grad3)")
   tutorial_svg.select("#tutorial_accordion")
      .append("line").attr("x1", "36px").attr("x2", "286px").attr("y1", "42px").attr("y2", "42px")
      .attr("stroke", "#f5b232").style("shape-rendering", "crispEdges")
   tutorial_svg.select("#tutorial_accordion")
      .append("text").attr("class", "tutorial_text").attr("x", "40px").attr("y", "18px")
      .text("Drag & drop HCPCS procedures")
   tutorial_svg.select("#tutorial_accordion")
      .append("text").attr("class", "tutorial_text").attr("x", "40px").attr("y", "36px")
      .text("onto title of reels")
}
function show_graphic_tutorial() {
   d3.select("#tutorial_svg")
      .transition().duration(25)
      .attr("opacity", 1);
   d3.select("#tutorial_svg")
      .transition().ease("back", 2).delay(25)
      .style("left", 285);
   // Drag-Drop drug tests onto reels to view metrics //   
   // Tutorial Screens unfurl down //
   // <-- Remove Tutorial Button //
   
   // <-- Click particular line series to plot this year on CDF //
   // <-- Click points to get detailed information on the specific lab //
}
function rm_graphic_tutorial() {
   d3.select("#tutorial_svg")
      .transition().duration(50)
      .attr("opacity", 0)
      .style("left", 315);
}
