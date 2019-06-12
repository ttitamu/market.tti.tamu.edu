Number.prototype.format = function(){
  return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

function init() {
  if (typeof TTI == "undefined") { TTI = {}; }
  if (typeof console == "undefined") {
    console = {};
    console.log = function (x) { return "console not implemented"; };
  }
  if (typeof TTI.Widgets == "undefined") { TTI.Widgets = {}; }
  if (typeof TTI.Models == "undefined") { TTI.Models = {}; }
  initLocalStorage();
  TTI.Flags = {

  };
  TTI.report = DOM.div().addClass('outputs');
  TTI.cssLocation = ["/print.css"];
  TTI.reportName = "M.A.R.K.E.T. Model Report";
  TTI.inputs = {
    state: "Iowa",
    region: "Rural",
    constructionCost: 77.59,
    constructionStartYear: 2022,
    operationStartYear: 2027,
    constantDollarYear: 2019,
    truckPercent: 28.6,
    AADT: 15397,
    averageSpeedBase: 64.8,
    averageSpeedProj: 65.8,
    projectLength: 10,
    commodityMix: {},
    commodityMixAg:{},
    annualTrips: {
      barge: 750,
      rail: 50,
      truck: 60000
    },
    waitTime: {
      barge: 2,
      rail: 2,
      truck: 2
    }
  };


}

function initLocalStorage() {
  if (TTI.LocalStorage == undefined) { TTI.LocalStorage = {}; }


}
function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
init();
TTI.version = "1.0";
///TTI.cssLocation is now set in footer.php//// = window.location.origin + /dart/;
TTI.checkVersion = function(callback) {
  var ver = TTI.storage.getItem("version");
  if (ver != TTI.version) {
    callback({});
    TTI.storage.setItem("version", TTI.version);
  }

}



TTI.isValidUrl = function(textval) {
  var urlregex = /^(http|https|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

TTI.replaceWordChars = function(text) {
  var s = text;
  // smart single quotes and apostrophe
  s = s.replace(/[\u2018\u2019\u201A]/g, "\'");
  // smart double quotes
  s = s.replace(/[\u201C\u201D\u201E]/g, "\"");
  // ellipsis
  s = s.replace(/\u2026/g, "...");
  // dashes
  s = s.replace(/[\u2013\u2014]/g, "-");
  // circumflex
  s = s.replace(/\u02C6/g, "^");
  // open angle bracket
  s = s.replace(/\u2039/g, "<");
  // close angle bracket
  s = s.replace(/\u203A/g, ">");
  // spaces
  s = s.replace(/[\u02DC\u00A0]/g, " ");

  //91 ec 236, left single quote
  //92 ed 237, right single quote

  //single quotes
  s = s.replace(/\u00ec/, "'");
  s = s.replace(/\u00ed/, "'");

  //93 ee 238, left double quote
  //94 ef 239, right double quote

  //double quotes
  s = s.replace(/\u00ee/, "\"");
  s = s.replace(/\u00ef/, "\"");

  //another right apos
  s = s.replace(/\u2018/, "'");
  s = s.replace(/\u2019/, "'");






  if (s.match(/Mansfield/)) {
    console.log('Mansfield length', s.length);
  }
  s = s.replace(/\ufffd/, "");

  if (s.match(/Mansfield/)) {
    console.log('Mansfield length', s.length);
  }



  return s;
};

TTI.inspectMSText = function(raw) { //UNFINISHED CODE?
  console.log('inspecting!!');
  var thresh = 128;
  var map = {
    '\u00ed': "",
    '\ufffd': ""
  };
  for (var i = 0; i < raw.length; i++) {
    var charCode = raw.charCodeAt(i);
    var char = raw.charAt(i);
    if (charCode > thresh) {
      console.log('raw', raw[i], char, charCode);
    }
  }
};

TTI.scrollTop = function() {
  var doc = document.documentElement,
  body = document.body;
  var left = (doc && doc.scrollLeft || body && body.scrollLeft || 0);
  var top = (doc && doc.scrollTop || body && body.scrollTop || 0);

  /////console.log('scrollTop, top is',top);

  return top;
};

TTI.documentWidth = function() {
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  return w;
}

TTI.getUrlVars = function() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}

TTI.tableRow = function() {
  var row = DOM.tr();

  for (var i = 0; i < arguments.length; i++) {
    var a = arguments[i];
    if (typeof a == "object" && a.prop && a.prop('tagName').match(/TD|TH/)) {
      row.append(a);
    } else {
      row.append(DOM.td(a));
    }
  }
  return row;
};

TTI.filter = function(arr, path, str) {
  var selected = arr;
  if (str) {
    selected = arr.select(function(o) {
      if (get(o, path) === str)
      return true;
      else
      return false;
    });
  }
  return selected;
};
TTI.clearLocalStorage = function() {
  localStorage.clear();

};
TTI.keycodes = {
  TAB: 9,
  PERIOD: 46,
  DOWN: 40,
  UP: 38,
  LEFT: 37,
  RIGHT: 39
};

TTI.cellValidator = function(e) {
  ////console.log('AA asdfasdf e.keyCode',e.keyCode,e);
  if (e.keyCode == TTI.keycodes.TAB) {
    return true;
  }
  var c = e.which;
  ///console.log('c',c);

  var periodMatch = this.value.match(/\./);

  /////console.log('periodMatch',periodMatch);

  //deny multiple periods before accepting periods
  if (c == TTI.keycodes.PERIOD && periodMatch) {
    return false;
  }
  //now accept (a single) period
  if (e.keyCode == TTI.keycodes.PERIOD) {
    return true;
  }
  if (c < 48 || c > 57) {
    return false;
  }
  return true;
};

TTI.slugify = function(str) {
  var result = str.toLowerCase();
  result = result.replace(/\//g, '-');
  result = result.replace(/\./g, '-');
  result = result.replace(/\:/g, '-');
  result = result.replace(/\ /g, '-');
  result = result.replace(/\&/g, '-');
  result = result.replace(/-/g, '-');
  result = result.replace(/--/g, '-');
  result = result.replace(/__/g, '-');
  result = result.replace(/\_\_/g, '-');

  return result;
};

TTI.tagify = function(input) {
  if (!input) {
    return [];
  }
  var temp = input.toLowerCase();
  var parts = temp.split(/\/|\+|\ |\-/);
  var noblanks = parts.reject(function(o) {
    return o.length == 0;
  });
  return noblanks;
};

TTI.moneyToFloat = function(currency) {
  var number = Number(currency.replace(/[^0-9\.]+/g, ""));
  return number;
};

TTI.precision = function(value, digits) {
  var coeff = Math.pow(10, digits);
  return Math.round(value * coeff) / coeff;
};

TTI.getObjectTotal = function(obj){
  return Object.keys(obj).reduce(function(sum, key){
    return sum + parseFloat(obj[key]);
  }, 0);
};

TTI.importJSON = function(url, callback) {
  jQuery.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    success: callback
  });
};

TTI.importCSV = function(url, callback) {
  jQuery.ajax({
    type: 'GET',
    url: url,
    /////dataType: 'json',
    success: callback
  });
};




TTI.gurus = [];

// var waiter = TTI.Widgets.Procrastinator({
//   timeout: 100
// });
// var wait500 = TTI.Widgets.Procrastinator({
//   timeout: 500
// });
// var snail = TTI.Widgets.Procrastinator({
//   timeout: 1000
// });

TTI.storage = TTI.Storage('local', 'MARKET::');



TTI.urlVars = TTI.getUrlVars();

TTI.noParens = function(o) {
  if (!o) {
    return o;
  }
  return o.replace(/\(.*\)/, '').trim();
};
var campfire = TTI.PubSub({});
campfire.subscribe('boot-ui', function() {
  TTI.checkVersion(function() {
    TTI.clearLocalStorage();
  });
  TTI.inputs = {
    state: "Iowa",
    region: "Rural",
    constructionCost: 77.59,
    constructionStartYear: 2022,
    operationStartYear: 2027,
    constantDollarYear: 2019,
    truckPercent: 28.6,
    AADT: 15397,
    averageSpeedBase: 64.8,
    averageSpeedProj: 65.8,
    projectLength: 10,
    commodityMix: {},
    commodityMixAg:{},
    annualTrips: {
      barge: 750,
      rail: 50,
      truck: 60000
    },
    waitTime: {
      barge: 2,
      rail: 2,
      truck: 2
    }
  };
  campfire.publish("import-json");


  setTimeout(function(){
    campfire.publish("render-inputs");
    campfire.publish("bind-events");
    $("#nav-tab-inputs-truck .nav-link").click();

    TTI.createTooltips();
    TTI.createGlossaryTxt();
  },500);
  $("#link-intro").click();

});
campfire.subscribe("bind-events",function(){

  $("#nav-tab-inputs-truck .nav-link").on("click",function(){
    setTimeout(function(){
      campfire.publish("render-inputs-truck");
    },100);
    $("#btn-calculate-truck").click();
  });
  $("#nav-tab-inputs-multimodel .nav-link").on("click",function(){
    setTimeout(function(){
      campfire.publish("render-inputs-multimodel");
    },100);
    $("#btn-calculate-multimodel").click();
  });
  $("#link-print").on("click",function(){
    campfire.publish("generate-report");
    campfire.publish("print-report");
  });
  $("#link-reset").on("click",function(){
    campfire.publish("boot-ui");
  });
});
campfire.subscribe("bind-events-inputs-truck",function(){
  $("#btn-calculate-truck").on("click",function(){
    var input = {
      serviceType:'Rail',
      closestStation:'Lawnview',
      milesToStation:5,
      projectLength:10,
      AADT:15397,
      truckPercent:0.286,
      averageSpeed:64.8,
      averageSpeedBase:64.8,
      averageSpeedProj:65.8,
      rider:50000,
      constructionCost:77590000,
      omCost:0,
      discountRate:0.03,
      constructionStartYear:2022,
      operationStartYear:2027,
      percentCongested:0,
      totalYears:30,
      constantYear:2019,
      projectScenario:0.02,
      commodityMix:TTI.commodityMix["Iowa"],
      commodityCost:TTI.commodityCost,
      perishCost:TTI.perishCost,
      jitCost:TTI.jitCost,
      region:'Urban',
      scale:{Truck: 1,Passenger:1,Grains:0},
    };
    input.constructionCost = TTI.inputs.constructionCost*1000000;
    input.constructionStartYear = TTI.inputs.constructionStartYear;
    input.operationStartYear = TTI.inputs.operationStartYear;
    input.constantYear = TTI.inputs.constantDollarYear;
    input.truckPercent = TTI.inputs.truckPercent/100;
    input.AADT = TTI.inputs.AADT;
    input.averageSpeedBase = TTI.inputs.averageSpeedBase;
    input.averageSpeedProj = TTI.inputs.averageSpeedProj;
    input.projectLength = TTI.inputs.projectLength;
    input.region = TTI.inputs.region;
    input.city = TTI.inputs.state;
    input.commodityMix = TTI.inputs.commodityMix["Truck"][input.city];
    input.commodityCost = TTI.commodityCost;
    input.scale={Truck:1,Passenger:1,Grains:0};
    var model= TTI.Models.BenefitCostAnalysis({input:input});
    var inputAg = input;
    inputAg.commodityMix = TTI.inputs.commodityMixAg["Truck"][input.city];
    inputAg.commodityCost = TTI.commodityCostAg;
    inputAg.scale={Truck:0,Passenger:0,Grains:1};
    var loads = Object.keys(inputAg.commodityCost);
    loads.forEach(function(ee){
      inputAg.scale.Truck = inputAg.scale.Truck + inputAg.commodityMix[ee];
    });

    var modelAg = TTI.Models.BenefitCostAnalysis({input:inputAg});
    if (input.operationStartYear<input.constructionStartYear)
    {
      alert("Operation start year must be no earlier than construction start year!");
    }
    else
    {
      TTI.results = [model.run().results, modelAg.run().results];
      campfire.publish("render-outputs-truck");
    }

  });
});
campfire.subscribe("bind-events-inputs-multimodel",function(){
  $("#btn-calculate-multimodel").on("click",function(){
    var input = {
      serviceType:'Rail',
      closestStation:'Lawnview',
      milesToStation:5,
      projectLength:10,
      AADT:15397,
      truckPercent:0.286,
      averageSpeed:64.8,
      averageSpeedBase:64.8,
      averageSpeedProj:65.8,
      rider:50000,
      constructionCost:77590000,
      omCost:0,
      discountRate:0.03,
      constructionStartYear:2022,
      operationStartYear:2027,
      percentCongested:0,
      totalYears:30,
      constantYear:2019,
      projectScenario:0.02,
      commodityMix:{Truck:TTI.commodityMix["Truck"]["Iowa"],Rail:TTI.commodityMix["Rail"]["Iowa"],Truck:TTI.commodityMix["Barge"]["Iowa"]},
      commodityCost:TTI.commodityCost,
      perishCost:TTI.perishCost,
      jitCost:TTI.jitCost,
      region:'Urban',
      scale:{Truck: 1,Passenger:0},
    };
    input.constructionCost = TTI.inputs.constructionCost*1000000;
    input.constructionStartYear = TTI.inputs.constructionStartYear;
    input.operationStartYear = TTI.inputs.operationStartYear;
    input.constantYear = TTI.inputs.constantDollarYear;
    //input.truckPercent = parseFloat($("#multimodel-inputs-truckPercent").val())/100;
    //input.AADT = parseInt($("#multimodel-inputs-AADT").val().replace(/,/g,''));
    //input.averageSpeedBase = parseFloat($("#multimodel-inputs-averageSpeedBase").val());
    //input.averageSpeedProj = parseFloat($("#multimodel-inputs-averageSpeedProj").val());
    //input.projectLength = parseFloat($("#multimodel-inputs-projectLength").val());
    input.region = TTI.inputs.region;
    input.city = TTI.inputs.state;
    input.commodityMix = {truck:TTI.inputs.commodityMix["Truck"][input.city],rail:TTI.inputs.commodityMix["Rail"][input.city],barge:TTI.inputs.commodityMix["Barge"][input.city]};
    input.commodityCost = TTI.commodityCost;
    input.annualTrips = TTI.inputs.annualTrips;
    input.waitTimeReduction = TTI.inputs.waitTime;
    input.scale={Truck:1,Passenger:0,Grains:0,truck:1,rail:1,barge:1};
    var model= TTI.Models.MultiModelBCA({input:input});
    var inputAg = input;
    inputAg.commodityMix = {truck:TTI.commodityMix["Truck"][input.city],rail:TTI.commodityMix["Rail"][input.city],barge:TTI.commodityMix["Barge"][input.city]};
    inputAg.scale={Truck:1,Passenger:0,Grains:1,truck:0,rail:0,barge:0};
    inputAg.commodityCost = TTI.commodityCostAg;
    ["truck","rail","barge"].forEach(function(e){
      var loads = Object.keys(inputAg.commodityCost);
      loads.forEach(function(ee){
        inputAg.scale[e] = inputAg.scale[e] + inputAg.commodityMix[e][ee];
      });
    });
    var modelAg = TTI.Models.MultiModelBCA({input:inputAg});
    if (input.operationStartYear<input.constructionStartYear)
    {
      alert("Operation start year must be no earlier than construction start year!");
    }
    else
    {
      TTI.results = [model.run().results, modelAg.run().results];
      campfire.publish("render-outputs-multimodel");
      $(window).scrollTop(0);
    }

  });
});
campfire.subscribe('render-inputs',function(){
  campfire.publish('render-inputs-truck');
  campfire.publish('render-inputs-multimodel');
});
campfire.subscribe('render-inputs-truck',function(){
  $("#tab-inputs-truck").empty();
  var createInputs = TTI.Widgets.Inputs(TTI.createInputItemsTruck());
  createInputs.subscribe("append",function(obj){
    obj.append(DOM.button().addClass('btn btn-primary btn-block').attr('id','btn-calculate-truck').html('Calculate Results'));
  });
  createInputs.renderOn($('#tab-inputs-truck'));
  campfire.publish("bind-events-inputs-truck");

//  $("#bca-inputs-constantYear").parent().css("display","none");
});
campfire.subscribe('render-outputs-truck',function(){
  $('#panel-outputs').empty();
  TTI.Widgets.BenefitCostReports({data:[TTI.results[0].report,TTI.results[1].report],container:$('#panel-outputs')}).renderOn();
});
campfire.subscribe('render-inputs-multimodel',function(){
  $("#tab-inputs-multimodel").empty();
  var createInputs = TTI.Widgets.Inputs(TTI.createInputItemsMultimodel());
  createInputs.subscribe("append",function(obj){
    obj.append(DOM.button().addClass('btn btn-primary btn-block').attr('id','btn-calculate-multimodel').html('Calculate Results'));
  });
  createInputs.renderOn($('#tab-inputs-multimodel'));
  campfire.publish("bind-events-inputs-multimodel");
//  $("#multimodel-inputs-constantYear").parent().css("display","none");
});
campfire.subscribe('render-outputs-multimodel',function(){
  $('#panel-outputs').empty();
  TTI.Widgets.MultimodelBCAReports({data:[TTI.results[0].report,TTI.results[1].report],container:$('#panel-outputs')}).renderOn();
});
campfire.subscribe('generate-report', function() {
  TTI.report.empty();
  TTI.report.append(DOM.h2("Inputs Summary"));
  var table = DOM.table().addClass("input-summary");
  table.append(DOM.tr().append(DOM.th("Project Parameters").attr("colspan",2)).addClass("header-row"));
  table.append(DOM.tr().append(DOM.td("Construction Cost(M$)").append(DOM.td($("#bca-inputs-constructionCost").val()))));
  table.append(DOM.tr().append(DOM.td("Construction Start Year").append(DOM.td($("#bca-inputs-constructionStartYear").val()))));
  table.append(DOM.tr().append(DOM.td("Operation Start Year").append(DOM.td($("#bca-inputs-operationStartYear").val()))));
  //table.append(DOM.tr().append(DOM.td("Constant Dollar Year").append(DOM.td($("#constantYear").val()))));
  table.append(DOM.tr().append(DOM.th("Senario-Baseline").attr("colspan",2)).addClass("header-row"));
  table.append(DOM.tr().append(DOM.td("Truck Percent").append(DOM.td($("#bca-inputs-truckPercent").val()))));
  table.append(DOM.tr().append(DOM.td("AADT").append(DOM.td($("#bca-inputs-AADT").val()))));
  table.append(DOM.tr().append(DOM.td("Average Speed (Base)").append(DOM.td($("#bca-inputs-averageSpeedBase").val()))));

  table.append(DOM.tr().append(DOM.th("Scenario-Project").attr("colspan",2)).addClass("header-row"));
  table.append(DOM.tr().append(DOM.td("Average Speed (Project)").append(DOM.td($("#bca-inputs-averageSpeedProj").val()))));
  table.append(DOM.tr().append(DOM.td("Project Length (Miles)").append(DOM.td($("#bca-inputs-projectLength").val()))));
  table.append(DOM.tr().append(DOM.td("Type (Urban, Suburban, Rural)").append(DOM.td($("#bca-inputs-region").val()))));
  table.append(DOM.tr().append(DOM.td("State").append(DOM.td($("#bca-inputs-city").val()))));
  TTI.report.append(table);
  //TTI.report.append($($("#panel-inputs").html()));
  TTI.report.append(DOM.div('&nbsp;').addClass('page')); //page break line
  TTI.report.append(DOM.h2("Outputs Summary"));
  TTI.report.append($($("#panel-outputs").html()));

});
campfire.subscribe('print-report', function() {

  TTI.Widgets.PDFHelper({
    filename: TTI.reportName,
    panel: DOM.div(TTI.report),
    printOptions: {
      landscape: false
    }
  }).go();
});
campfire.subscribe('import-json', function() {
  //TTI.commodityCost = {};
  //TTI.commodityMix = {};
  //TTI.commodityCostAg = {};
  //TTI.commodityMixAg = {};
  TTI.importJSON('/data/commodityCostByTons.json',function(data){
    TTI.commodityCost = data;
  });
  TTI.importJSON('/data/commodityCostByHrs.json',function(data){
    TTI.commodityCostByHrs = data;
  });
  TTI.importJSON('/grain/data/commodityMix.json',function(data){
    TTI.commodityMix = data;
    TTI.inputs.commodityMix = data;
  });
  TTI.importJSON('/grain/data/commodityCostByTonsAg.json',function(data){
    TTI.commodityCostAg = data;
    TTI.inputs.commodityCostAg = data;
  });
  TTI.importJSON('/grain/data/commodityMixAg.json',function(data){
    TTI.commodityMixAg = data;
    TTI.inputs.commodityMixAg = data;
  });

  TTI.importJSON('/data/jitCost.json',function(data){
    TTI.jitCost = data;
  });
  TTI.importJSON('/data/perishCost.json',function(data){
    TTI.perishCost = data;
  });
});
