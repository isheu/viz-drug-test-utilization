use anonymized_lab_data, clear
tostring hcpcs_cd, replace format(%05.0f)
ds year hcpcs_cd npi name classification total_overpmt total_excess_benes

gen json1 = "{"
foreach var in `r(varlist)' {
capture confirm string variable `var'
if !_rc {
replace json1 = json1 + "'" + "`var'" + "': '" + `var' + "', "
}
else {
tostring `var', replace force
replace json1 = json1 + "'" + "`var'" + "': " + `var' + ", "
}
}
gen json2 = ""
ds pct_excess_benes excess_visits total_units excess_units cumul_unique_benes cumul_overpmt pct_cumul_overpmt pct_cumul_unique_benes rank
foreach var in `r(varlist)' {
capture confirm string variable `var'
if !_rc {
replace json2 = json2 + "'" + "`var'" + "': '" + `var' + "', "
}
else {
tostring `var', replace force
replace json2 = json2 + "'" + "`var'" + "': " + `var' + ", "
}
}
gen json3 = regexr(json2, "[,] $", "")
replace json3 = json3 + "}, "

