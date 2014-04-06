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
   var tutorial_svg = d3.select("div#draw_area").append("svg").attr("id", "tutorial_svg").attr("fill", "none")
      .style("position", "absolute")
   tutorial_svg.append("g").attr("id", "tutorial_accordion").attr("class", "tutorial_blurb")
      .attr("transform", "translate(250,200)")
      .append("img").attr("class", "iconic tutorial_arrow").attr("data-src", "icons/iconic/flat/arrow-thick-left-fill-acute-sm.svg")
      .attr("width", "100px").attr("height", "100px");
   tutorial_svg.select("#tutorial_accordion")
      .append("text").attr("x", "15px").attr("y", "5px")
      .text("Drag & drop HCPCS procedures onto reels")
   
}
function show_graphic_tutorial() {
   // Drag-Drop drug tests onto reels to view metrics //   
   // Tutorial Screens unfurl down //
   // <-- Remove Tutorial Button //
   
   // <-- Click particular line series to plot this year on CDF //
   // <-- Click points to get detailed information on the specific lab //
}
