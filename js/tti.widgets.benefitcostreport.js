TTI.Widgets.BenefitCostInputs = function(spec) {
  var self = TTI.PubSub({});
  var cityList = ["Pharr","Progresso","Laredo","El Paso","Santa Theresa","Columbus","Nogales","San Luis II","Calexico East","Otay Mesa"];
  var inputItemsCost = [
    {
      propertyName: "constructionCost"
      label: "Construction Cost(M$)",
      control:"input",
      value: 77.59,
    },
    {
      propertyName: "constructionStartYear"
      label: "Construction Start Year",
      control:"input",
      value: 2022
    },
    {
      propertyName: "operationStartYear"
      label: "Operation Start Year",
      control:"input",
      value: 2027
    },
    {
      propertyName: "constantYear"
      label: "Constant Dollar Year",
      control:"input",
      value: 2018
    }
  ];

  var inputItemsBase = [
    {
      propertyName: "truckPercent"
      label: "Truck Percent",
      control:"input",
      value: 0.286,
    },
    {
      propertyName: "AADT"
      label: "AADT",
      control:"input",
      value: 15397
    },
    {
      propertyName: "averageSpeedBase"
      label: "Average Speed (Base)",
      control:"input",
      value: 64.8
    }
  ];

  var inputItemsProj = [
    {
      propertyName: "averageSpeedProj"
      label: "Average Speed (Project)",
      control:"input",
      value: 65.8,
    },
    {
      propertyName: "projectLength"
      label: "Project Length (Miles)",
      control:"input",
      value: 15397
    },
    {
      propertyName: "region"
      label: "Type (Urban, Suburban,Rural)",
      control:"dropdown list",
      value: "Rural",
      options: ["Urban","Suburban","Rural"]
    },
    {
      propertyName: "city"
      label: "City",
      control:"dropdown list",
      value: "Pharr",
      options: cityList
    }
  ];

  function getInputDOM(item){
    var inputGroup = DOM.div().class("input-group input-group-lg");
    inputGroup.append(DOM.div().class("input-group-addon").val(item.label));
    var input;
    if (item.control==="input") input=DOM.input().val(item.value).attr('value',item.value);
    if (item.control==="dropdown list")
    {
      input = DOM.select.addClass('form-control');
      item.options.forEach(function(o,i){
        var opt = DOM.options().val(o);
        if (item.value===o) opt.attr('selected',true);
        input.append(opt);
      });
    }
    input.addClass('form-control').attr('id',item.propertyName);
    inputGroup.append(input);
    return inputGroup;

  }
  function drawOn(arr,wrap){
    arr.forEach(function(o,i){
      wrap.append(getInputDOM);
    });
  }

  self.renderOn = function(wrap) {
    var headerCost = DOM.h4('Cost');
    var headerBaseline = DOM.h4('Baseline');
    var headerProject = DOM.h4('Project');
    wrap.append(headerCost);
    drawOn(inputItemsCost,wrap);
    wrap.append(headerBaseline);
    drawOn(inputItemsCost,wrap);
    wrap.append(headerProject);
    drawOn(inputItemsCost,wrap);    
  };
  return self;
};

TTI.Widgets.BenefitCostReport = function(spec) {
  var self = TTI.PubSub({});
  var results = false;

  function convertToTbl(d) {
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
            c = DOM.td(v);
            var slug = TTI.slugify(v);
            row.addClass(slug);
          } else { //value cell
            var rounded;
            if (bcRatio) {
              rounded = v.toFixed(1);
              c = DOM.td(rounded + ' : 1');
            } else {
              rounded = v / 1000000;

              if (jobs) {
                rounded = accounting.toFixed(rounded, 0);
              } else {
                rounded = accounting.formatMoney(rounded, '$', 0) + 'M';
              }

              c = DOM.td(rounded);
            }
            c.addClass('value-cell');
          }
          row.append(c);
        });
        tbl.append(row);
      });
      return tbl;
    } else {
      keys.forEach(function(k) {
        var nTbl = DOM.table();
        nTbl.append(DOM.caption(k));
        nTbl.append(convertToTbl(d[k]));
        tbl.append(nTbl);
      });
      return tbl;
    }
  }

  spec.inputs.subscribe('recalc', function(data) {
    var bca = TTI.Models.BenefitCostAnalysis({
      input: data
    });

    bca.setInputs(data);
    results = bca.run().results;
    var report = results.report;

    wrap.empty();
    wrap.append(convertToTbl(report));
    self.publish('redraw-complete', wrap);
  });

  self.subscribe('redraw-complete', function() {
    TTI.storage.setItem('html-traveler-impacts-o', DOM.div(wrap.clone()).html());
  });
  self.renderOn = function(o) {
    wrap = o;
    ////console.log('RENDER HAWN!!!!');
    spec.inputs.nudge();

    self.publish('redraw-complete');
  };

  return self;

};
