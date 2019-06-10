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


///spec = {
//  categories:[cat1,cat2,cat3,cat4],
//  inputs: [[input1,input2,input3],[input4,input5],[input6],[input7]] or inputs()
//  }
////
TTI.createInputItemsTruck = function() {
  const cityList = ["Iowa","Illinois","Indiana","Michigan","Minnesota","Missouri","North Dakota","Nebraska","Ohio","South Dakota","Wisconsin"];
  const yearList = Array.from({length:25}, function(v, k){return k+2018;} );
  const constYearList = Array.from({length:6}, function(v, k){return k+2014;});
  var inputItemsCost = [
    {
      propertyName: "bca-inputs-city",
      label: "State",
      control:"dropdown list",
      value: TTI.inputs.state,
      options: cityList,
      onchange: function(x){
        TTI.inputs.state = x;
        campfire.publish("render-inputs");
      }
    },
    {
      propertyName: "bca-inputs-region",
      label: "Area Type",
      control:"dropdown list",
      value: TTI.inputs.region,
      options: ["Urban","Suburban","Rural"],
      onchange: function(x){
        TTI.inputs.region = x;
      }
    },
    {
      propertyName: "bca-inputs-constructionCost",
      label: "Construction Cost (M$)",
      control:"input",
      value: TTI.inputs.constructionCost,
      format:function(x){
        return x.toString().replace(/^(\d|-)?(\d|,)*\.?\d*$/g,"$$$&");
      },
      onkeyup:function(x){
        return x.toString().replace(/^(\d|-)?(\d|,)*\.?\d*$/g,"$$$&");
      },
      onchange:function(x){
        TTI.inputs.constructionCost = parseFloat(x.replace(/\$/,""));
      }

    },
    {
      propertyName: "bca-inputs-constructionStartYear",
      label: "Construction Start Year",
      control:"dropdown list",
      value: TTI.inputs.constructionStartYear,
      options: yearList,
      onchange: function(x){
        TTI.inputs.constructionStartYear = x;
      }
    },
    {
      propertyName: "bca-inputs-operationStartYear",
      label: "Operation Start Year",
      control:"dropdown list",
      value: TTI.inputs.operationStartYear,
      options: yearList,
      onchange: function(x) {
        TTI.inputs.operationStartYear = x;
      }
    },
    {
      propertyName: "bca-inputs-constantYear",
      label: "Constant Dollar Year",
      control:"dropdown list",
      value: TTI.inputs.constantDollarYear,
      options: constYearList,
      onchange: function(x) {
        TTI.inputs.constantDollarYear = x;
      }
    }
  ];

  var inputItemsBase = [
    {
      propertyName: "bca-inputs-truckPercent",
      label: "Truck Percent",
      control:"input",
      value: TTI.inputs.truckPercent,
      onchange: function(x) {
        TTI.inputs.truckPercent = x;
      }
    },
    {
      propertyName: "bca-inputs-AADT",
      label: "AADT",
      control:"input",
      value: TTI.inputs.AADT,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      oninput: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      onchange: function(x){
        TTI.inputs.AADT = x;
      }
    },
    {
      propertyName: "bca-inputs-averageSpeedBase",
      label: "Average Speed (Base)",
      control:"input",
      value: TTI.inputs.averageSpeedBase,
      onchange: function(x){
        TTI.inputs.averageSpeedBase =x;
      }
    }
  ];

  var inputItemsProj = [
    {
      propertyName: "bca-inputs-averageSpeedProj",
      label: "Average Speed (Project)",
      control:"input",
      value: TTI.inputs.averageSpeedProj,
      onchange: function(x){
        TTI.inputs.averageSpeedProj = x;
      }
    },
    {
      propertyName: "bca-inputs-projectLength",
      label: "Project Length (Miles)",
      control:"input",
      value: TTI.inputs.projectLength,
      format:function(x){return x;},
      onchange: function(x){
        TTI.inputs.projectLength = x;
      }

    }
  ];
  var inputItemsMix = [];
  Object.keys(TTI.commodityCostByHrs).forEach(function(k){
    inputItemsMix.push({
      propertyName:"bca-inputs-"+k,
      label: k,
      control: "input",
      value: TTI.inputs.commodityMix["Truck"][TTI.inputs.state][k]*100,
      format: function(x) {
        return (parseFloat(x)).toFixed(2);
      },
      onchange: function(x) {
        var v = (parseFloat(x)).toFixed(2);
        TTI.inputs.commodityMix["Truck"][TTI.inputs.state][k] = v/100;
        return v;
      },
    });
  });
  return [{
      propertyName: "card-input1",
      label: "Project Parameters",
      inputs: inputItemsCost
    },
    {
      propertyName: "card-input2",
      label: "Scenario-Baseline",
      inputs: inputItemsBase
    },
    {
      propertyName: "card-input3",
      label: "Scenario-Project",
      inputs: inputItemsProj
    },
    {
      propertyName: "card-input4",
      label: "Commodity Mix Percent",
      control: "collapse",
      inputs: inputItemsMix
    },
  ];
};
TTI.createInputItemsMultimodel = function(){
  const cityList = ["Iowa","Illinois","Indiana","Michigan","Minnesota","Missouri","North Dakota","Nebraska","Ohio","South Dakota","Wisconsin"];
  const yearList = Array.from({length:25}, function(v, k){return k+2018;} );
  const constYearList = Array.from({length:6}, function(v, k){return k+2014;});
  var inputItemsCost = [
    {
      propertyName: "multimodel-inputs-city",
      label: "State",
      control:"dropdown list",
      value: TTI.inputs.state,
      options: cityList,
      onchange: function(x){
          TTI.inputs.state = x;
          campfire.publish("render-inputs");
      }
    },
    {
      propertyName: "multimodel-inputs-region",
      label: "Area Type",
      control:"dropdown list",
      value: TTI.inputs.region,
      options: ["Urban","Suburban","Rural"],
      onchange: function(x){
          TTI.inputs.region = x;
      }
    },

    {
      propertyName: "multimodel-inputs-constructionCost",
      label: "Construction Cost (M$)",
      control:"input",
      value: TTI.inputs.constructionCost,
      format:function(x){
        return x.toString().replace(/^(\d|-)?(\d|,)*\.?\d*$/g,"$$$&");
      },
      onkeyup:function(x){
        return x.toString().replace(/^(\d|-)?(\d|,)*\.?\d*$/g,"$$$&");
      },
      onchange:function(x){
        TTI.inputs.constructionCost = parseFloat(x.replace(/\$/,""));
      }
    },
    {
      propertyName: "multimodel-inputs-constructionStartYear",
      label: "Construction Start Year",
      control:"dropdown list",
      value: TTI.inputs.constructionStartYear,
      options: yearList,
      onchange: function(x){
        TTI.inputs.constructionStartYear = x;
      }
    },
    {
      propertyName: "multimodel-inputs-operationStartYear",
      label: "Operation Start Year",
      control:"dropdown list",
      value: TTI.inputs.operationStartYear,
      options: yearList,
      onchange: function(x){
        TTI.inputs.operationStartYear = x;
      }
    },
    {
      propertyName: "multimodel-inputs-constantYear",
      label: "Constant Dollar Year",
      control:"dropdown list",
      value: TTI.inputs.constantDollarYear,
      options: constYearList,
      onchange: function(x){
        TTI.inputs.constantDollarYear = x;
      }
    }
  ];

  var inputItemsBarge = [
    {
      propertyName: "multimodel-inputs-annualTripsBarge",
      label: "Annual Barge Traffic",
      control:"input",
      value: TTI.inputs.annualTrips.barge,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      oninput: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      onchange: function(x){
        TTI.inputs.annualTrips.barge = x;
      }
    },
    {
      propertyName: "multimodel-inputs-waitTimeReductionBarge",
      label: "Wait Time Reduction (Hours)",
      control:"input",
      value: TTI.inputs.waitTime.barge,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      oninputs: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      onchange: function(x){
        TTI.inputs.waitTime.barge = x;
      }
    }
  ];

  var inputItemsTruck = [
    {
      propertyName: "multimodel-inputs-annualTripsTruck",
      label: "Annual Truck Traffic",
      control:"input",
      value: TTI.inputs.annualTrips.truck,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      oninput: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      onchange: function(x){
        TTI.inputs.annualTrips.truck = parseFloat(x.replace(/,/,""));
      }
    },
    {
      propertyName: "multimodel-inputs-waitTimeReductionTruck",
      label: "Wait Time Reduction (Hours)",
      control:"input",
      value: TTI.inputs.waitTime.truck,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      oninput: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      onchange: function(x){
        TTI.inputs.waitTime.truck = x;
      }
    }

  ];

  var inputItemsRail = [
    {
      propertyName: "multimodel-inputs-annualTripsRail",
      label: "Annual Rail Traffic",
      control:"input",
      value: TTI.inputs.annualTrips.rail,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      oninput: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      onchange: function(x){
        TTI.inputs.annualTrips.rail = x;
      }
    },
    {
      propertyName: "multimodel-inputs-waitTimeReductionRail",
      label: "Wait Time Reduction (Hours)",
      control:"input",
      value: TTI.inputs.waitTime.rail,
      format: function(x){
        return x.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      },
      oninput: function(x){
        return this.format(x);
      },
      onchange: function(x){
        TTI.inputs.waitTime.rail = x;
      }

    }
  ];

  var inputItemsMixTruck =[];
  var inputItemsMixRail =[];
  var inputItemsMixBarge =[];
  Object.keys(TTI.commodityCostByHrs).forEach(function(k){
    inputItemsMixTruck.push({
      propertyName:"multimodel-inputs-"+k,
      label: k,
      control: "input",
      value: TTI.inputs.commodityMix["Truck"][TTI.inputs.state][k]*100,
      format: function(x){
          return (parseFloat(x)).toFixed(2);
      },
      onchange: function(x){
          var v = this.format(x);
          TTI.inputs.commodityMix["Truck"][TTI.inputs.state][k] = v/100;
          return v;
      }
    });
    inputItemsMixRail.push({
      propertyName:"multimodel-inputs-"+k,
      label: k,
      control: "input",
      value: TTI.commodityMix["Rail"]["Iowa"][k]*100,
      format: function(x){
          return (parseFloat(x)).toFixed(2);
      }
    });
    inputItemsMixBarge.push({
      propertyName:"multimodel-inputs-"+k,
      label: k,
      control: "input",
      value: TTI.commodityMix["Barge"]["Iowa"][k]*100,
      format: function(x){
          return (parseFloat(x)).toFixed(2);
      }

    });
  });
  return [
      {
          propertyName:"card-input-multimodel-1",
          label:"Project Parameters",
          inputs: inputItemsCost
      },
      {
        propertyName:"card-input-multimodel-2",
        label:"Truck",
        inputs: inputItemsTruck
      },
      {
        propertyName:"card-input-multimodel-3",
        label:"Rail",
        inputs: inputItemsRail
      },
      {
        propertyName:"card-input-multimodel-4",
        label:"Barge",
        inputs: inputItemsBarge
      },
      {
        propertyName:"card-input-multimodel-5",
        label:"Commodity Mix Percent-Truck",
        control:"collapse",
        inputs: inputItemsMixTruck
      },
      {
        propertyName:"card-input-multimodel-6",
        label:"Commodity Mix Percent-Barge",
        control:"collapse",
        inputs: inputItemsMixBarge
      },
      {
        propertyName:"card-input-multimodel-7",
        label:"Commodity Mix Percent-Rail",
        control:"collapse",
        inputs: inputItemsMixRail
      }
    ];
}
TTI.Widgets.Inputs = function(spec) {
  var self = TTI.PubSub({});
  function getInputDOM(item){
    var inputGroup = DOM.div().addClass("input-group input-group-md");
    inputGroup.append(DOM.div().addClass("input-group-addon").html(item.label));
    var input;
    var v;
    //if (isFunction(input.value)) v= input.value();
    // function handleInputValueChange(e) {
    //
    // var cursorStart = e.target.selectionStart,
    //     cursorEnd = e.target.selectionEnd;
    //
    //     // value manipulations...
    //
    // e.target.setSelectionRange(cursorStart, cursorEnd);
    // }
    function getNumber(n){
      console.log(n);
      return n.toString().match(/\d+[,\.]?\d+/)[0].replace(",","");
    }
    if (item.control==="input")
    {
      input=DOM.input();
      v = item.value;
      if (item.format) {
        v = item.format(item.value);
      }
      input.val(v).html(v.toString());
      if (item.onkeyup){
        input.on('keyup',function(e){
          //handleInputValueChange(e);
          var n = item.onkeyup($(this).val().replace(/,/g,''));
          //  console.log(n);
          $(this).val(n.toLocaleString()).html(n.toLocaleString());
        });
      }

      if (item.oninput){
        input.on('input',function(e){
          //handleInputValueChange(e);
          var n = item.oninput(parseFloat($(this).val().replace(/,/g,'')));          //  console.log(n);
          $(this).val(n.toLocaleString()).html(n.toLocaleString());
        });
      }
      if (item.onchange){
        input.on('change',function(e){
          //handleInputValueChange(e);
          var v = $(this).val().replace(/,/g,'');
          item.onchange(v);
          if (item.format){
            var n = item.format(v);
            //  console.log(n);
            $(this).val(n.toLocaleString()).html(n.toLocaleString());
          }

        });
      }


    }

    if (item.control==="dropdown list")
    {
      input = DOM.select().addClass('form-control');
      item.options.forEach(function(o,i){
        o = o.toString();
        var opt = DOM.option().val(o).html(o);
        if (item.value.toString().match(o)) opt.attr('selected',true);
        input.append(opt);
      });
      input.on("change",function(e){
        item.onchange($(this).val());
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
    var box = DOM.ul().addClass("list-group");
    spec.forEach(function(e,i){
      var className = "list-group-item";

      if (e.class != null) className = e.class;
      var item = DOM.li().addClass(className);
      if (e.control== "collapse"){
                //var header = DOM.h5().addClass("mb-0");
        var content = DOM.div().addClass("card collapse").attr("id",e.propertyName);
        //var link = DOM.a().attr("data-toggle","collapse").attr("data-target","#"+e.propertyName);
        var icon = DOM.span().addClass("pull-right glyphicon glyphicon-plus");
        item.attr("data-toggle","collapse").attr("data-target","#"+e.propertyName);
        item.html(e.label);
        item.append(icon);
        //link.append(item);
        drawOn(e.inputs,content);
        //box.append(link);
        box.append(item);
        box.append(content);
      }
      else{
        item.html(e.label).addClass(className);
        box.append(item);
        drawOn(e.inputs,box);
      }
    });
    wrap.append(box);
    self.publish("append",wrap);
    $(document).ready(function () {
     $('.collapse')
         .on('shown.bs.collapse', function() {
             $(this)
                 .prev()
                 .find(".glyphicon-plus")
                 .removeClass("glyphicon-plus")
                 .addClass("glyphicon-minus");
             })
         .on('hidden.bs.collapse', function() {
             $(this)
                 .prev()
                 .find(".glyphicon-minus")
                 .removeClass("glyphicon-minus")
                 .addClass("glyphicon-plus");
             });
         });

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
TTI.Widgets.MultimodelBCAReports = function(spec){
  var self = TTI.PubSub({});
  var converter = TTI.Widgets.ConvertToTbl({});
  merge = function(dataArr){
    var d = dataArr[0];
    var elem = {};
    var headers = dataArr[0].Headers;
    elem = dataArr[1].Rows[6];
    elem[headers[0]] = "Total Agriculture Benefits","Present Value";
    d.Rows.push(elem);
    d.RowIndex.push(d.RowIndex.length);
    elem = dataArr[1].Rows[10];
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
