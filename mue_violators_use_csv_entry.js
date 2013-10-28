
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
         /*
         var hcpcs_yearly_data = [];
         d3.csv("data/year_quant_test_mue.csv", function(dataset) {
            dataset.forEach(function(d) {
               hcpcs_yearly_data.push(
                  {  "year": +d.year, "hcpcs": d.hcpcs_cd, "mue": +d.mue, "yr_npis": +d.n_npi, "yr_lines": +d.lines, "yr_units": +d.total_units, "yr_excess_units": +d.excess_units, 
                     "yr_pmt": +d.linepmt, "yr_excess_pmt": +d.overpmt, "yr_not_excess_pmt": +d.not_in_excess_pmt, "yr_p_excess_pmt": +d.pct_overpmt * 100, "yr_p_not_excess_pmt": +d.pct_not_in_excess_pmt * 100,
                     "yr_n_excess_npis": +d.n_npi_overpmt, "yr_n_excess_npis_90": +d.n_npi_90_pct, "yr_top_5_npi_pmt": +d.top_5_npi_pmt, "yr_top_5_npi_p_pmt": +d.pct_top_5_npi_pmt * 100
                  });
            });
            var opiate_line_plot = year_linechart("83925", "opiate_reel", "opiate_line", "opiate")
            opiate_line_plot()
            var chromatography_line_plot = year_linechart("82542", "chromatography_reel", "chromatography_line", "chromatography")
            chromatography_line_plot()
            var mass_spectrometry_line_plot = year_linechart("83789", "mass_spectrometry_reel", "mass_spectrometry_line", "mass_spectrometry")
            mass_spectrometry_line_plot()
            
            var opiate_bar_plot = stackedbar("83925", "opiate_reel", "opiate_bar", "opiate")
            opiate_bar_plot()
            var chromatography_bar_plot = stackedbar("82542", "chromatography_reel", "chromatography_bar", "chromatography")
            chromatography_bar_plot()
            var mass_spectrometry_bar_plot = stackedbar("83789", "mass_spectrometry_reel", "mass_spectrometry_bar", "mass_spectrometry")
            mass_spectrometry_bar_plot()
         })
         */

         /*
         var hcpcs_top_npi_data = [];
         d3.csv("data/top_npi_quant_test_mue.csv", function(dataset) {
            dataset.forEach(function(d) {
               hcpcs_top_npi_data.push(
                    {"year": +d.year, "hcpcs": d.hcpcs_cd, "top_x": +d.rank, "npi": d.npi, "name": d.name, "classification": d.classification, 
                     "hcpcs_excess_pmt": +d.total_overpmt, "hcpcs_excess_benes": +d.total_excess_benes, 
                     "npi_excess_pmt": +d.overpmt, "npi_p_excess_pmt": +d.pct_overpmt * 100, "npi_excess_benes": +d.excess_benes, "npi_p_excess_benes": +d.pct_excess_benes * 100, 
                     "npi_excess_visits": +d.excess_visits, "npi_total_units": +d.total_units, "npi_excess_units": +d.excess_units, 
                     "cumul_excess_pmt": +d.cumul_overpmt, "cumul_p_excess_pmt": +d.pct_cumul_overpmt * 100, "cumul_excess_benes": +d.cumul_unique_benes, "cumul_p_excess_benes": +d.pct_cumul_unique_benes * 100, 
                     });
            });
            var opiate_plot = npi_cumul_scatterplot("83925", "opiate_reel", "opiate_npi", "opiate")
            opiate_plot()
            var chromatography_plot = npi_cumul_scatterplot("82542", "chromatography_reel", "chromatography_npi", "chromatography")
            chromatography_plot()
            var mass_spectrometry_plot = npi_cumul_scatterplot("83789", "mass_spectrometry_reel", "mass_spectrometry_npi", "mass_spectrometry")
            mass_spectrometry_plot()
         });
         */
