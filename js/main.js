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
    TTI.cssLocation = ["print.css"];
    TTI.reportName = "M.A.R.K.E.T. Model Report";

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

var campfire = TTI.PubSub({});

TTI.urlVars = TTI.getUrlVars();

TTI.noParens = function(o) {
  if (!o) {
    return o;
  }
  return o.replace(/\(.*\)/, '').trim();
};

campfire.subscribe('boot-ui', function() {
  TTI.checkVersion(function() {
    TTI.clearLocalStorage();
  });
  campfire.publish("import-json");
  campfire.publish("render-inputs");
  campfire.publish("bind-events");

  setTimeout(function(){
    $("#btn-calculate").click();
    TTI.createTooltips();
    TTI.createGlossaryTxt();
  },500);

});

campfire.subscribe("bind-events",function(){
  $("#btn-calculate").on("click",function(){
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
      constantYear:2018,
      projectScenario:0.02,
      commodityMix:TTI.commodityMix["Pharr"],
      commodityCost:TTI.commodityCost,
      perishCost:TTI.perishCost,
      jitCost:TTI.jitCost,
      region:'Urban',
      scale:{Truck: 1,Passenger:1},
    };
    input.constructionCost = parseFloat($("#constructionCost").val().replace(/\$/g,''))*1000000;
    input.constructionStartYear = parseInt($("#constructionStartYear").val());
    input.operationStartYear = parseInt($("#operationStartYear").val());
    input.constantYear = parseInt($("#constantYear").val());
    input.truckPercent = parseFloat($("#truckPercent").val())/100;
    input.AADT = parseInt($("#AADT").val().replace(/,/g,''));
    input.averageSpeedBase = parseFloat($("#averageSpeedBase").val());
    input.averageSpeedProj = parseFloat($("#averageSpeedProj").val());
    input.projectLength = parseFloat($("#projectLength").val());
    input.region = ($("#region").val());
    input.city = ($("#city").val());
    input.commodityMix = TTI.commodityMix[input.city];
    input.commodityCost = TTI.commodityCost;
    input.scale={Truck:1,Passenger:1};
    var model= TTI.Models.BenefitCostAnalysis({input:input});
    var inputAg = input;
    inputAg.commodityMix = TTI.commodityMixAg[input.city];
    inputAg.commodityCost = TTI.commodityCostAg;
    inputAg.scale={Truck:input.commodityMix["Percent Ag"],Passenger:0};
    var modelAg = TTI.Models.BenefitCostAnalysis({input:inputAg});
    if (input.operationStartYear<input.constructionStartYear)
    {
      alert("Operation start year must be no earlier than construction start year!");
    }
    TTI.results = [model.run().results, modelAg.run().results];
    campfire.publish("render-outputs");

  });
  $("#link-print").on("click",function(){
    campfire.publish("generate-report");
    campfire.publish("print-report");
  });
  $("#link-reset").on("click",function(){
    campfire.publish("boot-ui");
  });

});



campfire.subscribe('import-json', function() {
  //TTI.commodityCost = {};
  //TTI.commodityMix = {};
  //TTI.commodityCostAg = {};
  //TTI.commodityMixAg = {};
  TTI.importJSON('data/commodityCostByTons.json',function(data){
    TTI.commodityCost = data;
  });
  TTI.importJSON('data/commodityMix.json',function(data){
    TTI.commodityMix = data;
  });
  TTI.importJSON('data/commodityCostByTonsAg.json',function(data){
    TTI.commodityCostAg = data;
  });
  TTI.importJSON('data/commodityMixAg.json',function(data){
    TTI.commodityMixAg = data;
  });

  TTI.importJSON('data/jitCost.json',function(data){
    TTI.jitCost = data;
  });
  TTI.importJSON('data/perishCost.json',function(data){
    TTI.perishCost = data;
  });
});


TTI.Widgets.PDFHelper = function(spec) {
  var self = {};

  function readTextFile(fileUrl) {
    var strReturn = "";

    jQuery.ajax({
      url: fileUrl,
      success: function(html) {
        strReturn = html;
      },
      async: false
    });

    return strReturn;
  }

  var pdfUrl = 'https://trends-tti.tamu.edu/PDFConverter?';
  var pdfData;
  self.go = function() {
    if (!spec.filename) spec.filename = 'report';
    var pdfForm = jQuery('#pdf-form');
    var printOptions = '';
    if (spec.printOptions) {
      if (spec.printOptions.landscape) {
        if (spec.printOptions.landscape == true) {
          printOptions += 'landscape=true&';
        }
      }

      if (spec.printOptions.paperSize) {
        printOptions += 'paperSize=' + spec.printOptions.paperSize + '&';
      }


      //pdfForm.attr('action','AJAXPrintToPDF.aspx?FileType=excel');
    }
    printOptions += 'filename=' + spec.filename + '&';
    pdfForm.attr('action', pdfUrl + printOptions);
    var reportsHtml = DOM.div();
    pdfForm.append(reportsHtml);
    //AJAX is not working here?


    ///var absolutePath = window.location.protocol + "//" + window.location.host + "/";

    ///alert('hello');


    var absolutePath = TTI.cssLocation; //need to make sure this is a valid url
    //absolutePath = absolutePath.replace(/^http:/, '');

    //console.log('absolutePath****',absolutePath);
    if (true) {
      var cssUrl = absolutePath;
      var wrap = DOM.div();
      var html = DOM.html();
      html.attr('xmlns', 'http://www.w3.org/1999/xhtml');
      var head = DOM.head();
      //var head = jQuery('head');
      var body = DOM.body();
      var link = DOM.link();
      // var footerUrl = absolutePath + 'PDFfooter.html';
      // var headerUrl = absolutePath + 'PDFheader.html';
      //console.log('path:', absolutePath);
      cssUrl.forEach(function(e){
        TTI.importCSV(e, function(data) {

          var style = DOM.style();
          style.attr("type/css");
          // var absolutePath = window.location.protocol + "//" + window.location.host + "/";
          //console.log('path:', absolutePath);

          //If this works on public domain, there is no need to append the whole css file to the wrap
          link.attr('href', e);
          link.attr('rel', 'stylesheet');

          head.append(link);
          /////////////////////////////////////
          var flag = true;
          //var fileUrl=absolutePath + 'style.css';
          //style.append(readTextFile(fileUrl));
          style.append(data);
          //console.log('style:', style);
          head.append(style);


          //console.log(wrap.html());
          //Important! Encode the html first

        });
      });

      // TTI.importCSV(footerUrl, function(data) {
      //   var wrap = $(data);
      //   wrap.find('#book-name').text('DART Report');
      //   var markup = encodeURI(wrap.html());
      //   var placeholder = jQuery('#ReportsFooter');
      //   placeholder.val(markup);
      // });
      // TTI.importCSV(headerUrl, function(data) {
      //   var wrap = $(data);
      //   wrap.find('#book-name').text('DART Report');
      //   var markup = encodeURI(wrap.html());
      //   var placeholder = jQuery('#ReportsHeader');
      //   placeholder.val(markup);
      // });
      setTimeout(function() {
        body.append(spec.panel.html());
        html.append(head);
        html.append(body);
        wrap.append(html);
        var markup = encodeURI(wrap.html());
        var reportsHtml = jQuery('#report-contents');
        reportsHtml.val(markup);
        pdfForm.submit();
      }, 500);
    }

    //  setTimeout(function() {
    //      pdfForm.submit();
    //  }, 500);
  };

  return self;
}


TTI.Widgets.ConvertToTbl = function(spec){
  var self = TTI.PubSub({});
  self.table = false;

  self.convert=function convertToTbl(d) {
    //d:{Headers:[],RowIndex:[],Rows[]}
    var keys = Object.keys(d);
    //console.log(keys);
    var tbl = DOM.table();
    var headerRow = DOM.tr().addClass('header-row');
    if (keys.indexOf('Rows') !== -1) {
      //headerRow.append(DOM.td('id'));
      d.Headers.forEach(function(h) {
        var c = DOM.th(h);
        headerRow.append(c);
      });
      tbl.append(headerRow);
      d.RowIndex.forEach(function(y) {
        var id = y - d.RowIndex[0];
        var row = DOM.tr();

        var bcRatio = false;
        var jobs = false;
        var agBenefits = false;
        var ppFactor = false;
        ////var cssClass =
        var dataRow = d.Rows[id];
        //row.append(DOM.td(y));
        d.Headers.forEach(function(h) {
          var c;
          var v;
          if (isNaN(v = dataRow[h])) { // labeled cell

            if (v.match(/benefit.*cost.*ratio/i)) {
              bcRatio = true;
            }

            if (v.match(/jobs/i)) {
              jobs = true;
            }
            if (v.match(/factor/i)){
              ppFactor = true;
            }
            c = DOM.td(v);
            var slug = TTI.slugify(v);
            row.addClass(slug);
          } else { //value cell
            var rounded = v/1000000;
            rounded = accounting.formatMoney(rounded, '$', 2) + 'M';
            c = DOM.td(rounded);
            if (bcRatio) {
              rounded = v.toFixed(2);
              c = DOM.td(rounded + ' : 1');
            }
            if (jobs) {
                rounded = accounting.toFixed(rounded, 0);
                c = DOM.td(rounded);
            }
            if (ppFactor){
              rounded = (v*100).toFixed(2);
              c = DOM.td(rounded);
            }
            c.addClass('value-cell');
          }
          row.append(c);
        });
        tbl.append(row);
      });
      self.table= tbl;
    } else {
      keys.forEach(function(k) {
        var nTbl = DOM.table();
        nTbl.append(DOM.caption(k));
        nTbl.append(convertToTbl(d[k]));
        tbl.append(nTbl);
      });
     self.table=tbl;

    }
    return self.table;
  };
  return self;
}
TTI.Widgets.BenefitCostInputs = function(spec) {
  var self = TTI.PubSub({});
  const cityList = ["Pharr","Progresso","Laredo","El Paso","Santa Theresa","Columbus","Nogales","San Luis II","Calexico East","Otay Mesa"];
  const yearList = Array.from({length:25}, (v, k) => k+2018);
  const constYearList = Array.from({length:5}, (v, k) => k+2014);
  const inputItemsCost = [
    {
      propertyName: "constructionCost",
      label: "Construction Cost (M$)",
      control:"input",
      value: 77.59,
      format:function(x){return x.toString().replace(/^(\d|-)?(\d|,)*\.?\d*$/g,"$$$&");},

    },
    {
      propertyName: "constructionStartYear",
      label: "Construction Start Year",
      control:"dropdown list",
      value: "2022",
      options: yearList
    },
    {
      propertyName: "operationStartYear",
      label: "Operation Start Year",
      control:"dropdown list",
      value: "2027",
      options: yearList
    },
    {
      propertyName: "constantYear",
      label: "Constant Dollar Year",
      control:"dropdown list",
      value: "2018",
      options: constYearList
    }
  ];

  var inputItemsBase = [
    {
      propertyName: "truckPercent",
      label: "Truck Percent",
      control:"input",
      value: 28.6,

    },
    {
      propertyName: "AADT",
      label: "AADT",
      control:"input",
      value: 15397,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      }
    },
    {
      propertyName: "averageSpeedBase",
      label: "Average Speed (Base)",
      control:"input",
      value: 64.8,

    }
  ];

  var inputItemsProj = [
    {
      propertyName: "averageSpeedProj",
      label: "Average Speed (Project)",
      control:"input",
      value: 65.8,

    },
    {
      propertyName: "projectLength",
      label: "Project Length (Miles)",
      control:"input",
      value: 10,
      format:function(x){return x;},

    },
    {
      propertyName: "region",
      label: "Area Type",
      control:"dropdown list",
      value: "Rural",
      options: ["Urban","Suburban","Rural"]
    },
    {
      propertyName: "city",
      label: "Port of Entry",
      control:"dropdown list",
      value: "Pharr",
      options: cityList
    }
  ];

  function getInputDOM(item){
    var inputGroup = DOM.div().addClass("input-group input-group-md");
    inputGroup.append(DOM.div().addClass("input-group-addon").html(item.label));
    var input;
    if (item.control==="input")
    {
      input=DOM.input();
      var v = item.value;
      if (item.format) {
        v = item.format(item.value);
        input.on('keyup',function(){
          var n = item.format($(this).val().replace(/,/g,''));
        //  console.log(n);
          $(this).val(n.toLocaleString()).html(n.toLocaleString());
        });
      }
      input.val(v).html(v.toString());

    }

    if (item.control==="dropdown list")
    {
      input = DOM.select().addClass('form-control');
      item.options.forEach(function(o,i){
        var opt = DOM.option().val(o).html(o);
        if (item.value.match(o)) opt.attr('selected',true);
        input.append(opt);
      });
    }
    input.addClass('form-control').attr('id',item.propertyName);
    inputGroup.append(input);
    inputGroup.append(DOM.span().addClass("form-control-feedback pull-right").html(item.unit?item.unit:""));
    return inputGroup;

  }
  function drawOn(arr,wrap){
    arr.forEach(function(o,i){
      wrap.append(getInputDOM(o));
    });
  }

  self.renderOn = function(wrap) {
    var box = DOM.ul().addClass('list-group');
    var headerCost = DOM.li('Project Parameters').addClass('list-group-item');
    var headerBaseline = DOM.li('Scenario-Baseline').addClass('list-group-item');
    var headerProject = DOM.li('Scenario-Project').addClass('list-group-item');;
    box.append(headerCost);
    drawOn(inputItemsCost,box);
    box.append(headerBaseline);
    drawOn(inputItemsBase,box);
    box.append(headerProject);
    drawOn(inputItemsProj,box);
    wrap.append(box);
    wrap.append(DOM.button().addClass('btn btn-primary btn-block').attr('id','btn-calculate').html('Calculate'));
  };
  return self;
};

TTI.Widgets.BenefitCostReports = function(spec){
  var self = TTI.PubSub({});
  var converter = TTI.Widgets.ConvertToTbl({});
  merge = function(dataArr){
    var d = dataArr[0];
    var elem = {};
    var headers = dataArr[0].Headers;
    elem = dataArr[1].Rows[8];
    elem[headers[0]] = "Total Agriculture Benefits","Present Value";
    d.Rows.push(elem);
    d.RowIndex.push(d.RowIndex.length);
    elem = dataArr[1].Rows[12];
    elem[headers[0]] = "Project Prioritization Factor";

    d.Rows.push(elem);
    d.RowIndex.push(d.RowIndex.length);
    return d;
  }
  var wrap = spec.container;
  self.renderOn = function(){
    var data = Array.isArray(spec.data)?merge(spec.data):spec.data;
    wrap.append(converter.convert(data));

  }
  return self;
}
campfire.subscribe('render-inputs',function(){
  $("#panel-inputs").empty();
  TTI.Widgets.BenefitCostInputs({}).renderOn($('#panel-inputs'));
  $("#constantYear").parent().css("display","none");
});
campfire.subscribe('render-outputs',function(){
  $('#panel-outputs').empty();
  TTI.Widgets.BenefitCostReports({data:[TTI.results[0].report,TTI.results[1].report],container:$('#panel-outputs')}).renderOn();
});



campfire.subscribe('generate-report', function() {
  TTI.report.empty();
  TTI.report.append(DOM.h2("Inputs Summary"));
  var table = DOM.table().addClass("input-summary");
  table.append(DOM.tr().append(DOM.th("Project Parameters").attr("colspan",2)).addClass("header-row"));
  table.append(DOM.tr().append(DOM.td("Construction Cost(M$)").append(DOM.td($("#constructionCost").val()))));
  table.append(DOM.tr().append(DOM.td("Construction Start Year").append(DOM.td($("#constructionStartYear").val()))));
  table.append(DOM.tr().append(DOM.td("Operation Start Year").append(DOM.td($("#operationStartYear").val()))));
  table.append(DOM.tr().append(DOM.td("Constant Dollar Year").append(DOM.td($("#constantYear").val()))));
  table.append(DOM.tr().append(DOM.th("Senario-Baseline").attr("colspan",2)).addClass("header-row"));
  table.append(DOM.tr().append(DOM.td("Truck Percent").append(DOM.td($("#truckPercent").val()))));
  table.append(DOM.tr().append(DOM.td("AADT").append(DOM.td($("#AADT").val()))));
  table.append(DOM.tr().append(DOM.td("Average Speed (Base)").append(DOM.td($("#averageSpeedBase").val()))));

  table.append(DOM.tr().append(DOM.th("Scenario-Project").attr("colspan",2)).addClass("header-row"));
  table.append(DOM.tr().append(DOM.td("Average Speed (Project)").append(DOM.td($("#averageSpeedProj").val()))));
  table.append(DOM.tr().append(DOM.td("Project Length (Miles)").append(DOM.td($("#projectLength").val()))));
  table.append(DOM.tr().append(DOM.td("Type (Urban, Suburban, Rural)").append(DOM.td($("#region").val()))));
  table.append(DOM.tr().append(DOM.td("Port of Entry").append(DOM.td($("#city").val()))));
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
