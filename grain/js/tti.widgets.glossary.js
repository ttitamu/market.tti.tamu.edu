TTI.glossary = {
  "Construction Cost":"The total cost of the project in 2018, in millions of dollars.",
  "Construction Start Year":"The year in which project construction begins.",
  "Operation Start Year":"The year in which the project begins operation.",
  // "Constant Dollar Year":"The year in which all costs and benefits are presented in.",
  "Truck Percent":"The percent of vehicles on the project roadway that are commercial freight trucks.",
  "AADT":"Average Annual Daily Travel: The average number of vehicle trips on the project roadway each day.",
  "Average Speed (Base)":"The average speed of vehicles on the existing roadway in miles per hour.",
  "Average Speed (Project)":"The average estimated speed of vehicles in the project scenario in miles per hour.",
  "Project Length":"The total distance of the project in miles.",
  "Area Type":"Project area type, can be Urban, Suburban, or Rural, depending on the project.",
  //"Port of Entry":"The border port of entry corresponding to the project.",
  //  "Discount Rate": " Translates future costs and benefits into present-day values to account for the time value of money. A high discount rate may reduce future benefits and costs to smaller present values; whereas a lower rate reduces future values less, causing the value of future benefits and costs to be closer to current dollar values. ",
  //  "Travel Growth Rate": " average annual growth rate of vehicles traveling on roadways ",
  //  "One Time Change in Land Value due to New Service": " Initial, one time increase in property values within a quarter- or half-mile radius of the new station.",
  //  "Economic Activity (Economy Wide)": "The resulting change in a city’s economy. This value is calculated by multiplying the production value by the final demand variable for each industry. It is the total impact of all direct, induced, and indirect economic activity resulting from the sectors or activity considered in the analysis. ",
    "Vehicle Operating Cost Savings":  "Vehicle operating costs include, but are not limited to: fuel, purchase payments, insurance premiums, tires, and repairs.",
    "Business Time and Reliability Cost Savings": "Savings associated with the ability to maintain relatively stable travel time variability, or how long it takes to complete the same trip on different days with commercial vehicles. In other words, the variable represents reduced business operating costs that occurs when travel time variability associated with traffic congestion is diminished. ",
    "Personal Time and Reliability Cost Savings": "Savings associated with the ability to maintain relatively stable travel time variability, or how long it takes to complete the same trip on different days with passenger vehicles.",
    "Safety Benefits": "The reduction in average crash rates (per 100 million VMT) for all modes, and average costs incurred for each crash type ($/accident).",
    "Freight Time Cost Savings": "Freight time costs represents the costs to industries that produce or consume the freight goods on the trucks moving through the port of entry (POE). The freight time cost savings consists of commodity time costs, perishability costs, and just in time costs. ",
    "Environmental Benefits":"Environmental benefits are the benefits associated with a reduction in emissions from trucks and passenger vehicles, resulting from reduced roadway congestion.",
    "Business Output": "The value of business production. For productivity analysis, it is measured as net value added. (For other analyses, it may be measured as gross business revenue.)",
    "Positive Economic Effect of Wage Income": "The degree to which wage compensation is positively affected by the effects of commuting time reliability on business productivity.",
    "Capital Costs":"Capital Costs include startup costs to initialize, design, and construct the project.",
    "Benefit / Cost Ratio": "The benefit/cost ratio is simply the total benefits derived from the project divided by the total cost of the project. A benefit/cost ratio of greater than 1.0 is positive (the benefits of building the project outweigh the cost).",
    //"Total Agriculture Benefits": "Total benefits that are directly accrued to the agricultural sector.",
    "Annual Truck Traffic":" The total number of freight trucks moving through the project area in one year.",
    "Annual Rail Traffic":" The total number of freight trains moving through the project area in one year. The model assumes 110 cars per train and 110 tons per car.",
    "Annual Barge Traffic":" The total number of barges moving through the project area in one year. The model assumes 1 towboat for every 15 barges and 1500 tons per barge.",
    "Wait Time Reduction (Hours)":" The reduction in wait time, per trip, as a result of the project.",
    "Total Grain Sector Benefits":" The total amount of benefits accrued to the grain sector.",
    "Project Prioritization Factor":" An estimate of the relative benefit to the grain sector per dollar spent on the project. A higher factor represents a higher benefit per dollar spent relative to a project with a lower factor. This provides one point of comparison of many, when comparing potential projects.",
    //"Project Prioritization Factor": "An estimate of the relative benefit to the agricultural sector per dollar spent on the project. A higher factor represents a higher benefit per dollar spent relative to a project with a lower factor. This provides one point of comparison of many, when comparing potential projects.",

};

TTI.createTooltips = function() {
    var fileUrl = '/data/glossary.json';
    var items = Object.keys(TTI.glossary);
    items.forEach(function(k) {
        var searchSpace = ['.input-group-addon','label', 'td:first-child'];
        searchSpace.forEach(function(kk) {
            var wrap = $(kk + ':contains(' + k + ')');
            wrap.attr('data-toggle', 'tooltip').attr('title', TTI.glossary[k]);
            wrap.tooltip({
                'selector': '',
                'placement': 'top',
                'container': 'body',
            });

        });


    });
    // TTI.importJSON('/data/glossary.json', function(data) {
    //     TTI.glossary = data;
    //     items = Object.keys(data);
    //     items.forEach(function(k) {
    //         $('b:contains(k)').attr('data-toggle', 'tooltip').attr('title', items[k]).tooltip();
    //     });
    // });
}

TTI.createGlossaryTxt = function(){
  var items = Object.keys(TTI.glossary);
  var wrap = $("#modal-glossary .modal-body");
  wrap.empty();
  items.forEach(function(k){
    wrap.append(DOM.h4(k)).append(DOM.p(TTI.glossary[k]));
  });
}
