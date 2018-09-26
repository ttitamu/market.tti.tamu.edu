TTI.glossary = {
  "Construction Cost":"The total cost of the project in 2018 dollars.",
  "Construction Start Year":"The year in which the construction begins.",
  "Operation Start Year":"The year in which the operation begins.",
  "Constant Dollar Year":"The year in which the constant dollar value is set",
  "Truck Percent":"The percent of vehicles on the project roadway that are commercial freight trucks.",
  "AADT":"'Avearge Annual Daily Travel', the average number of vehicle trips on the project roadway each day.",
  "Average Speed":"The average speed of vehicles on the project roadway in miles per hour(mph).",
  "Project Length":"The total distance of the project in miles.",
  "Type":"Project type, can be Urban, Suburban, or Rural, depending on the project.",
  "Port of Entry":"The place where the project will be located.",
    "Discount Rate": " Translates future costs and benefits into present-day values to account for the time value of money. A high discount rate may reduce future benefits and costs to smaller present values; whereas a lower rate reduces future values less, causing the value of future benefits and costs to be closer to current dollar values. ",
  //  "Travel Growth Rate": " average annual growth rate of vehicles traveling on roadways ",
  //  "One Time Change in Land Value due to New Service": " Initial, one time increase in property values within a quarter- or half-mile radius of the new station.",
  //  "Economic Activity (Economy Wide)": "The resulting change in a city’s economy. This value is calculated by multiplying the production value by the final demand variable for each industry. It is the total impact of all direct, induced, and indirect economic activity resulting from the sectors or activity considered in the analysis. ",
    "Vehicle Operating Cost Savings":  "Vehicle operating costs include, but are not limited to: fuel, purchase payments, insurance premiums, tires, and repairs.",
    "Business Time and Reliability Cost Savings": "Savings associated with the ability to maintain relatively stable travel time variability, or how long it takes to complete the same trip on different days with commercial vehicles. In other words, the variable represents reduced business operating costs that occurs when travel time variability associated with traffic congestion is diminished. ",
    "Personal Time and Reliability Cost Savings": "Savings associated with the ability to maintain relatively stable travel time variability, or how long it takes to complete the same trip on different days with passenger vehicles.",
    "Safety Benefits": "The reduction in average crash rates (per 100 million VMT) for all modes, and average costs incurred for each crash type ($/accident).",
    "Logistics/Freight Cost Savings": "Savings related to costs for freight handling, including costs of loading dock handling, inventory warehousing, and product delivery. ",
    "Business Output": "The value of business production. For productivity analysis, it is measured as net value added. (For other analyses, it may be measured as gross business revenue.)",
    "Positive Economic Effect of Wage Income": "The degree to which wage compensation is positively affected by the effects of commuting time reliability on business productivity.",
    "Capital Costs":"Capital Costs include startup costs to initialize, design, and construct the project.",
    "Benefit / Cost Ratio": "The benefit/cost ratio is simply the total benefits derived from the project divided by the total cost of the project. A benefit/cost ratio of greater than 1.0 is positive (the benefits of building the project outweigh the cost).",
    "Total Agriculture Benefits": "Total benefits that are directly accrued to the agricultural sector.",
    "Project Prioritization Factor": "A factor that provides an estimate of the relative benefit to the agricultural sector per dollar spent on the transportation project.",

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
