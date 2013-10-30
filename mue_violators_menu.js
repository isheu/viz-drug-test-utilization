function clear_reel(reel_id) {
   d3.select("div#" + reel_id).select("svg").remove()
   d3.select("div#" + reel_id).select("div.hcpcs_bubble").remove()
}
function populate_reel(reel_id, hcpcs) {            
   var label = reel_label(reel_id, hcpcs); 
   label();
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
function compare_hcpcs_code(a, b) {
   if (a.hcpcs < b.hcpcs) { return -1; }
   if (a.hcpcs > b.hcpcs) { return 1; }
   else { return 0; }
}
