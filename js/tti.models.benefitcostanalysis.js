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

}

function initLocalStorage() {
  if (TTI.LocalStorage == undefined) { TTI.LocalStorage = {}; }


}

init();
//Fantastic implementation of recursively access the nested object and get the full path of each value!
//Underscore.js is needed
//http://stackoverflow.com/questions/17231118/javascript-iterate-over-nested-objects-getting-values-and-chained-keys
function traverse(node, path) {
  var pairs;
  if ((!(pairs = _(node).pairs()).length)||Array.isArray(node)) {
    return [
      {
        keys: path,
        value: node
      }
    ];
  } else {
    return [].concat.apply([], _(pairs).map(function (kv) {
      return traverse(kv[1], path.concat(kv[0]));
    }));
  }
}
function set(obj,path, value) {
  var schema = obj;  // a moving reference to internal objects within obj
  var pList;
  if (typeof path === "string")
  pList = path.split('.');
  else if ($.isArray(path))
  pList = path;
  else
  console.log("set(path,value):path should be either a string or an array!");

  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {

    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }

  if (value == undefined || isNaN(value))
  if (!$.isArray(value)) return;
  schema[pList[len - 1]] = value;
}

function get(obj,path){
  var schema = obj;  // a moving reference to internal objects within obj
  var pList;
  if (typeof path === "string")
  pList = path.split('.');
  else if ($.isArray(path))
  pList = path;
  else
  console.log("get(path,value):path should be either a string or an array!");

  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {

    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }


  return schema[pList[len - 1]];
}
function update(a, b) {
  if (a !== undefined) {
    pairs = traverse(a, []);
    pairs.forEach(function (o) {
      set(b,o.keys, o.value);
    });
  }
}
function getTotal(r) {
  var keys = r.Headers;
  var data = r.Rows;
  var transpose = {};


  data.forEach(function (r) {
    keys.forEach(function (k) {
      if (transpose[k] === undefined) transpose[k] = [];
      transpose[k].push(r[k]);
    });
  });
  var totals = {};
  keys.forEach(function (k) {
    totals[k]=transpose[k].sum();
  });
  return totals;
}
/* Based on
* - EGM Mathematical Finance class by Enrique Garcia M. <egarcia@egm.co>
* - A Guide to the PMT, FV, IPMT and PPMT Functions by Kevin (aka MWVisa1)
*/

var ExcelFormulas = {

  PVIF: function(rate, nper) {
    return Math.pow(1 + rate, nper);
  },

  FVIFA: function(rate, nper) {
    return rate == 0? nper: (this.PVIF(rate, nper) - 1) / rate;
  },
  FV: function(rate, nper, pmt, pv, type) {
    if (!type) type = 0;

    var pow = Math.pow(1 + rate, nper);
    var fv = 0;

    if (rate) {
      fv = (pmt * (1 + rate * type) * (1 - pow) / rate) - pv * pow;
    } else {
      fv = -1 * (pv + pmt * nper);
    }

    return fv;
  },

  PMT: function(rate, nper, pv, fv, type) {
    if (!fv) fv = 0;
    if (!type) type = 0;

    if (rate == 0) return -(pv + fv)/nper;

    var pvif = Math.pow(1 + rate, nper);
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

    if (type == 1) {
      pmt /= (1 + rate);
    };

    return pmt;
  },

  IPMT: function(rate,per,nper,pv,fv,type) {
    var tmp = Math.pow(1 + rate, per-1);
    var pmt = this.PMT(rate, nper, pv, fv, type);
    return 0 - (pv * tmp * rate + pmt * (tmp - 1));
  },

  PPMT: function(rate, per, nper, pv, fv, type) {
    if (per < 1 || (per >= nper + 1)) return null;
    var pmt = this.PMT(rate, nper, pv, fv, type);
    var ipmt = this.IPMT(rate,per,nper,pv);
    return pmt - ipmt;
  },

  DaysBetween: function(date1, date2) {
    var oneDay = 24*60*60*1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime())/oneDay));
  },

  // Change Date and Flow to date and value fields you use
  XNPV: function(rate, values) {
    var xnpv = 0.0;
    var firstDate = new Date(values[0].Date);
    for (var key in values) {
      var tmp = values[key];
      var value = tmp.Flow;
      var date = new Date(tmp.Date);
      xnpv += value / Math.pow(1 + rate, this.DaysBetween(firstDate, date)/365);
    };
    return xnpv;
  },

  XIRR: function(values, guess) {
    if (!guess) guess = 0.1;

    var x1 = 0.0;
    var x2 = guess;
    var f1 = this.XNPV(x1, values);
    var f2 = this.XNPV(x2, values);

    for (var i = 0; i < 100; i++) {
      if ((f1 * f2) < 0.0) break;
      if (Math.abs(f1) < Math.abs(f2)) {
        f1 = this.XNPV(x1 += 1.6 * (x1 - x2), values);
      }
      else {
        f2 = this.XNPV(x2 += 1.6 * (x2 - x1), values);
      }
    };

    if ((f1 * f2) > 0.0) return null;

    var f = this.XNPV(x1, values);
    if (f < 0.0) {
      var rtb = x1;
      var dx = x2 - x1;
    }
    else {
      var rtb = x2;
      var dx = x1 - x2;
    };

    for (var i = 0; i < 100; i++) {
      dx *= 0.5;
      var x_mid = rtb + dx;
      var f_mid = this.XNPV(x_mid, values);
      if (f_mid <= 0.0) rtb = x_mid;
      if ((Math.abs(f_mid) < 1.0e-6) || (Math.abs(dx) < 1.0e-6)) return x_mid;
    };

    return null;
  }

};

// var test = TTI.Models.BenefitCostAnalysis({
//         input:{
//                                                    serviceType:'Rail',
//                                                    closestStation:'Lawnview',
//                                                    milesToStation:5,
//                                                    rider:50000,
//                                                    discountRate:0.03,
//                                                    constructionStartYear:2015,
//                                                    operationStartYear:2018,
//                                                    constantYear:2015,
//                                                    projectScenario:0.1
//                                                }
//
//     });
// var results = test.run().results;
TTI.Models.BenefitCostAnalysis = function (spec) {

  var inputs = {
    travelImpacts:{},
    freightTimeCost:{},
    benefits:{},
    costs:{}
  };



  var getCommodityMix = function (args) {
    var b = spec.input.commodityMix;
    var p = spec.input.commodityMix;
    return { base: b, project: p };


  };
  var getCommodityCost = function(args){
    return spec.input.commodityCost;
  };

  var defaults = function (args) {
    var r = {
      startYear: 2018,
      totalYears: 30,
      truckPercent: 0.0195,
      AADT: 89408,
      annualTrips: 5619905,
      projectLength: 8.676,
      averageSpeed: 50,
      percentCongested: 0,
      projectType: "Suburban",
      serviceType: 'Rail',
      closestStation:'Lawnview',
      milesToStation:5,
      rider:150000,
      discountRate:0.03,
      constructionStartYear:2022,
      operationStartYear:2027,
      constantYear:2018,
      travelGrowthRate: 0.02,
      projectScenario:0.02,
      "Per_Vehicle_Cost_Factors": {
        "Fatalities_Accident": 9600000,
        "Personal_Injury_Accident": 174030,
        "Propery_Damage_Accident": 4252,
        "Environmental": {
          Truck: 0.63,
          Passenger: 0.03
        },
        "Vehicle_Operating_Congested": {
          Truck: 1.29,
          Passenger: 0.32
        },
        "Vehicle_Operating_Free_Flow": {
          Truck: 22.56,
          Passenger: 5.03
        }
      },
      "Time_Value_Factors": {
        "Personal_Cost": {
          Truck: 29.48,
          Passenger: 11.53
        },
        "Feight_Logistics": {
          Truck: 1.67
        },
        "Buffer_Time_Cost": {
          Truck: 72.57
        }
      },
      "Default_Vehicle_Loading_Factors": {
        "Person_per_Vehicle": {
          Truck: 1.1,
          Passenger: 1.6
        },
        "Freight_US_Tons_per_Vehicle": {
          Truck: 24.05
        }
      },
      "Accident_Rates": {
        "Fatality_Accident": {
          Truck: 0.196,
          Passenger: 1.127
        },
        "Personal_Injury_Accident": {
          Truck: 6.762,
          Passenger: 73.5
        },
        "Property_Damage_Accident": {
          Truck: 94.08,
          Passenger: 182.28
        }
      },
      "Discount_Rate": {
        Construction: 0.03,
        Benefits: 0.03
      },
      "Passenger_Business_Time": 0.425,
      "Passenger_Personal_Time": 1 - 0.425,
      "Travel_Growth_Rate": 0.02

    };
    var accidentRates ={};
    accidentRates.base = {"Accident_Rates":{
      "Fatality_Accident": {
        Truck: 0.2,
        Passenger: 1.15
      },
      "Personal_Injury_Accident": {
        Truck: 6.9,
        Passenger: 75
      },
      "Property_Damage_Accident": {
        Truck: 96,
        Passenger: 186
      }
    }};
    accidentRates.proj = {"Accident_Rates":{
      "Fatality_Accident": {
        Truck: 0.196,
        Passenger: 1.127
      },
      "Personal_Injury_Accident": {
        Truck: 6.762,
        Passenger: 73.5
      },
      "Property_Damage_Accident": {
        Truck: 94.08,
        Passenger: 182.28
      }
    }};
    update(args.input,r);
    r.annualTrips = r.AADT*365;
    //r.averageSpeed = Math.floor(r.averageSpeed);

    if(args.scenario==='base')
    {
      r.averageSpeed = args.input.averageSpeedBase;
      update(accidentRates.base,r);
    }
    else if (args.scenario==='project')
    {
      r.averageSpeed = args.input.averageSpeedProj;
      update(accidentRates.proj,r);
    }

    return r;

  };//Get from JSON file in the final version



  var economicFactors = function (args) {
    var r = {
      Suburban: {
        businessOutputMultiplier: 1.66294046318418,
        wageIncomeMultiplier: 0.673467758395063,
        omJobFactor: 15.1504806893467,
        constructionJobFactor: 0.361553644624116
      },
      Rural: {
        businessOutputMultiplier: 1.67289600079481,
        wageIncomeMultiplier: 0.747995429834611,
        omJobFactor: 9.84904033814843,
        constructionJobFactor: 0.423335581608968
      },
      Urban: {
        businessOutputMultiplier: 1.82123417472789,
        wageIncomeMultiplier: 0.863748810102557,
        omJobFactor: 11.3909101852242,
        constructionJobFactor: 0.31665972022911
      },
    };
    if (args.region === undefined)
    return r;
    else
    return r[args.region];
  };//Get from JSON file in the final version
  var getIndexes = function () {
    var r = [];
    var x = inputs.travelImpacts;
    var d = defaults({});
    var y = (x.totalYears === undefined) ? d.totalYears:x.totalYears;
    for (var i = 0; i < y; i += 1) { r.push(i); }
    return r;
  };
  var getYears = function () {
    var x = inputs.travelImpacts;
    var d = defaults({});
    var y = (x.startYear === undefined) ? d.startYear : x.startYear;
    var r = indexes.map(function (i) { return y + i; });
    return r;
  };
  var getCostYears = function(){
    var x = inputs.travelImpacts;
    var d = defaults({});
    var y = (x.constructionStartYear === undefined) ? d.constructionStartYear : x.constructionStartYear;
    var r = indexes.map(function (i) { return y + i; });
    return r;
  }
  var getBenefitYears = function(){
    var x = inputs.travelImpacts;
    var d = defaults({});
    var y = (x.operationStartYear === undefined) ? d.operationStartYear : x.operationStartYear;
    var r = indexes.map(function (i) { return y + i; });
    return r;
  }
  var computeRow=function(i, h, lf, la) {
    var row = {};
    h.forEach(function (k) {
      var f = lf[k];
      var fa = la[k];
      var a = fa(row, i);
      //console.log(a);
      row[k] = f(a);
    });
    return row;
  }
  var objToArray = function (o) { return _.values(o);};
  // var data = "Hello self!";





  //Generate "TravelImpacts" tab data
  //Input variables: args; Format: {base:/formatted as defaults/,project:/formatted as defaults/}
  //


  var travelImpacts = function(args)
  {
    //args={input:{averageSpeed:,percentCongested,projectScenario:}}
    var b = defaults({input:args.input,scenario:'base'});//get from args
    var p = defaults({input:args.input,scenario:'project'});//get from args
    var spec = { base: b, project:p};
    var scale = args.input.scale;
    function run(x) {
      //x: input arguments object


      var output = {};
      output.RowIndex = getBenefitYears();
      output.Headers = [];
      output.Rows = [];

      var fnList = {
        "Phase-in of Operations Impact by Year": function (args) {
          return 1.0 * Math.pow(1 + args[0], args[1]);
        },

        "Trips-Truck": function (args) {
          return scale.Truck*args[0] * args[1] * args[2];
        },
        "Trips-Passenger": function (args) {
          return scale.Passenger*args[0] * (1 - args[1]) * args[2];
        },
        "VMT-Truck": function (args) {
          return args[0] * args[1];
        },
        "VMT-Passenger": function (args) {
          return args[0] * args[1];
        },
        "VHT-Truck": function (args) {
          return args[0] / args[1];
        },
        "VHT-Passenger": function (args) {
          return args[0] / args[1];
        },
        "Congested Operation Cost-Truck": function (args) {
          return args[0] * args[1] * args[2]; //Fuel cost
        },
        "Congested Operation Cost-Passenger": function (args) {
          return args[0] * args[1] * args[2];
        },
        "Free Flow Operation Cost-Truck": function (args) {
          return args[0] * (1 - args[1]) * args[2];//Labor cost
        },
        "Free Flow Operation Cost-Passenger": function (args) {
          return args[0] * (1 - args[1]) * args[2];
        },
        "Value of Time-Business Truck": function (args) {
          return args[0] * args[1] * args[2];
        },
        "Value of Time-Business Passenger": function (args) {
          return args[0] * args[1] * args[2] * args[3];
        },
        "Value of Time-Personal": function (args) {
          return args[0] * args[1] * args[2] * args[3];
        },
        "Environmental Cost-Truck": function (args) {
          return args[0] * args[1];
        },
        "Environmental Cost-Passenger": function (args) {
          return args[0] * args[1];
        },
        "Safety Cost-Truck": function (args) {
          return args[0] / 100000000 * (args[1] * args[2] + args[3] * args[4] + args[5] * args[6]);
        },
        "Safety Cost-Passenger": function (args) {
          return args[0] / 100000000 * (args[1] * args[2] + args[3] * args[4] + args[5] * args[6]);
        },
      };
      var fn = function (r, k) { return r[k]; };

      var costFactors = x["Per_Vehicle_Cost_Factors"];
      var congestedFactors = costFactors["Vehicle_Operating_Congested"];
      var freeFlowFactors = costFactors["Vehicle_Operating_Free_Flow"];
      var personPerVehicle = x["Default_Vehicle_Loading_Factors"]["Person_per_Vehicle"];
      //var businessCost = x["Time_Value_Factors"]["Business_Cost"];
      var personalCost = x["Time_Value_Factors"]["Personal_Cost"];
      var enviromentalCost = costFactors["Environmental"];
      var accidentRate = x["Accident_Rates"];

      var argsList = {
        "Phase-in of Operations Impact by Year": function (r, j) { return [x.travelGrowthRate, j]; },
        "Trips-Truck": function (r, j) { return [x.annualTrips, x.truckPercent, fn(r, "Phase-in of Operations Impact by Year")]; },
        "Trips-Passenger": function (r, j) { return [x.annualTrips, x.truckPercent, fn(r, "Phase-in of Operations Impact by Year")]; },
        "VMT-Truck": function (r, j) { return [x.projectLength, fn(r, "Trips-Truck")]; },
        "VMT-Passenger": function (r, j) { return [x.projectLength, fn(r, "Trips-Passenger")]; },
        "VHT-Truck": function (r, j) { return [fn(r, "VMT-Truck"), x.averageSpeed]; },
        "VHT-Passenger": function (r, j) { return [fn(r, "VMT-Passenger"), x.averageSpeed]; },
        "Congested Operation Cost-Truck": function (r, j) { return [fn(r, "VHT-Truck"), 9.84, 2.484]; },
        "Congested Operation Cost-Passenger": function (r, j) { return [fn(r, "VHT-Passenger"), 1.86, 2.185]; },
        "Free Flow Operation Cost-Truck": function (r, j) { return [fn(r, "VHT-Truck"), x.percentCongested, freeFlowFactors.Truck]; },
        "Free Flow Operation Cost-Passenger": function (r, j) { return [fn(r, "VHT-Passenger"), x.percentCongested, freeFlowFactors.Passenger]; },
        "Value of Time-Business Truck": function (r, j) { return [personPerVehicle.Truck, personalCost.Truck, fn(r, "VHT-Truck")] },
        "Value of Time-Business Passenger": function (r, j) { return [1.2, 33.58, fn(r, "VHT-Passenger"), x.Passenger_Business_Time] },//Fix the hard coded number
        "Value of Time-Personal": function (r, j) { return [personPerVehicle.Passenger, personalCost.Passenger, fn(r, "VHT-Passenger"), x.Passenger_Personal_Time] },
        "Environmental Cost-Truck": function (r, j) {
          return [fn(r, "VHT-Truck"), enviromentalCost.Truck];

        },

        "Environmental Cost-Passenger": function (r,j) {
          return [fn(r, "VHT-Passenger"), enviromentalCost.Passenger];

        },
        "Safety Cost-Truck": function (r,j) {
          return [fn(r, "VMT-Truck"), accidentRate.Fatality_Accident.Truck, costFactors.Fatalities_Accident, accidentRate.Personal_Injury_Accident.Truck, costFactors.Personal_Injury_Accident, accidentRate.Property_Damage_Accident.Truck, costFactors.Propery_Damage_Accident];


        },
        "Safety Cost-Passenger": function (r,j) {
          return [fn(r, "VMT-Passenger"), accidentRate.Fatality_Accident.Passenger, costFactors.Fatalities_Accident, accidentRate.Personal_Injury_Accident.Passenger, costFactors.Personal_Injury_Accident, accidentRate.Property_Damage_Accident.Passenger, costFactors.Propery_Damage_Accident];
        }

      };
      output.Headers = Object.keys(fnList);

      output.Rows = indexes.map(function (i) {
        return computeRow(i, output.Headers, fnList, argsList);
      });

      return output;
    }
    function netChange(x,o) {

      var years = getBenefitYears();
      var output = {};
      output.RowIndex = years;
      output.Headers = ["VHT-Truck", "VHT-Passenger", "VHT-Total", "VHT-Labor", "VHT-Freight"];
      output.Rows = [];
      function computeRow(i, h, lf, la) {
        var row = {};


        h.forEach(function (k) {
          var f = lf[k];
          var fa = la[k];
          var a = fa(row, i);
          //console.log(a);
          row[k] = f(a);
        });
        return row;
      }
      var fnList = {
        "VHT-Truck": function (args) {
          return args[0] - args[1];
        },

        "VHT-Passenger": function (args) {
          return args[0] - args[1];
        },
        "VHT-Total": function (args) {
          return args[0] + args[1];;
        },
        "VHT-Labor": function (args) {
          return args[0] * args[1];
        },
        "VHT-Freight": function (args) {
          return args[0] * args[1];
        }

      };
      var getData = function (r, j, h) { return r[j][h]; }
      var fn = function (r, k) { return r[k]; };
      var personPerVehicle = x["Default_Vehicle_Loading_Factors"]["Person_per_Vehicle"].Passenger;
      var tonsPerVehicle = x["Default_Vehicle_Loading_Factors"].Freight_US_Tons_per_Vehicle.Truck;

      var argsList = {
        "VHT-Truck": function (r, j) {
          return [getData(o.project.Rows, j, "VHT-Truck"), getData(o.base.Rows, j, "VHT-Truck")];
        },
        "VHT-Passenger": function (r, j) {
          return [getData(o.project.Rows, j, "VHT-Passenger"), getData(o.base.Rows, j, "VHT-Passenger")];
        },
        "VHT-Total": function (r, j) {
          return [fn(r, "VHT-Truck"), fn(r, "VHT-Passenger")];
        },
        "VHT-Labor": function (r, j) {
          return [fn(r, "VHT-Passenger"), personPerVehicle];
        },
        "VHT-Freight": function (r, j) {
          return [fn(r, "VHT-Truck"), tonsPerVehicle];
        }
      }
      output.Rows = indexes.map(function (i) {
        return computeRow(i, output.Headers, fnList, argsList);
      });
      return output;
    };
    var output = {};
    ["base", "project"].forEach(function (o) {
      update(args[o], spec[o]);
      output[o] = run(spec[o]);
    });
    output.netChange = netChange(spec.base,output);

    return output;


  };
  //Generate "benefits" tab data
  //Input variables: args;
  var benefits = function (args) {
    var rowsT = args.data.travelImpacts;
    var rowsF = args.data.freightTimeCost;
    var rate = args.input.discountRate;
    //var d = defaults({});
    //var getNetChange = function (data, j, keys) {
    //    var sum = {base:0,project:0};

    //    ["base", "project"].forEach(function (n) {
    //        var rows = data[n].Rows;
    //        keys.forEach(function (k) {
    //            sum[n] += rows[j][k];
    //        });

    //    });
    //    return sum.project - sum.base;
    //};
    var getData = function (data, j, keys) {
      var d = [];
      ["base", "project"].forEach(function (n) {
        var rows = data[n].Rows;
        keys.forEach(function(k){d.push(rows[j][k])});
      });
      return d;
    }
    var run = function(o)
    {


      var r = { Headers: [], Rows: [], RowIndex: [] };
      r.RowIndex = getBenefitYears();

      var dFactor;
      if (!(dFactor = o.input.discountFactor))
      dFactor = years.map(function (y) { return 1/Math.pow(1+rate,(y-args.input.constantYear)); });
      var fnList = {
        "Operation Cost-Truck": function (args) {
          return args[0]*(args[1]+args[2]-args[3]-args[4]);
        },
        "Operation Cost-Passenger": function (args) {
          return args[0] * (args[1] + args[2] - args[3] - args[4]);
        },
        "Value of Time-Business Truck": function (args) {
          return args[0] * (args[1]-args[2]);
        },
        "Value of Time-Business Passenger": function (args) {
          return args[0] * (args[1] - args[2]);
        },
        "Value of Time-Personal": function (args) {
          return args[0] * (args[1] - args[2]);
        },
        "Safety Cost": function (args) {
          return args[0] * (args[1] + args[2] - args[3] - args[4]);
        },
        "Shipper/Logistics Cost": function (args) {
          return args[0] * (args[1] - args[2]);
        },

        "Environmental Cost": function (args) {
          return args[0] * (args[1] + args[2] - args[3] - args[4]);
        }

      };
      var argsList = {
        "Operation Cost-Truck": function (r,j) {
          return [dFactor[j]].concat(getData(rowsT,j,["Congested Operation Cost-Truck","Free Flow Operation Cost-Truck"]));
        },
        "Operation Cost-Passenger": function (r,j) {
          return [dFactor[j]].concat(getData(rowsT, j, ["Congested Operation Cost-Passenger", "Free Flow Operation Cost-Passenger"]));
        },
        "Value of Time-Business Truck": function (r, j) {
          return [dFactor[j]].concat(getData(rowsT, j, ["Value of Time-Business Truck"]));
        },
        "Value of Time-Business Passenger": function (r, j) {
          return [dFactor[j]].concat(getData(rowsT, j, ["Value of Time-Business Passenger"]));
        },
        "Value of Time-Personal": function (r, j) {
          return [dFactor[j]].concat(getData(rowsT, j, ["Value of Time-Personal"]));
        },
        "Safety Cost": function (r,j) {
          return [dFactor[j]].concat(getData(rowsT, j, ["Safety Cost-Truck", "Safety Cost-Passenger"]));
        },
        "Shipper/Logistics Cost": function (r, j) {
          return [dFactor[j]].concat(getData(rowsF, j, ["Shipper/Logistics Cost"]));
        },
        "Environmental Cost": function (r, j) {
          return [dFactor[j]].concat(getData(rowsT, j, ["Environmental Cost-Truck", "Environmental Cost-Passenger"]));
        }
      };
      r.Headers = Object.keys(fnList);
      r.Rows = indexes.map(function (i) {
        return computeRow(i, r.Headers, fnList, argsList);
      });
      return r;
    };
    var output = run({ input: {} });
    output.Totals = getTotal(output);
    return output;

  };
  var freightTimeCost = function (args) {
    //args={data:calculated data}
    var d = defaults({});
    var data = args.data.travelImpacts;
    var logisticsFactor = d.Time_Value_Factors.Feight_Logistics.Truck;
    var tonsPerVehicle = d.Default_Vehicle_Loading_Factors.Freight_US_Tons_per_Vehicle.Truck;
    var cost = args.input.commodityCost;
    var mix = args.input.commodityMix;
  //  var cost = args.input.commodityCost;
  //  var mix = args.input.commodityMix;
    var output = {};
    var spec = {};
    var bi = { cost: cost, mix: mix };
    var pi = { cost: cost, mix: mix };
    spec.base = {input:bi,data:data.base};
    spec.project = {input:pi,data:data.project};

    var run = function(o)
    {
      var cost = o.input.cost;
      var mix = o.input.mix;
      var rows = o.data.Rows;
      var h1 = Object.keys(cost);
      var h2 = ["Total", "Shipper/Logistics Cost"];
      var r = { Headers: [], Rows: [], RowIndex: [] };
      r.RowIndex = getBenefitYears();
      r.Headers = ["VHT-Truck"].concat(h1,h2);


      var fnList = {
        "VHT-Truck": function (args) {
          return args[0];
        },
        "Total": function (args) {
          var sum = args.reduce(function (p, c, i, a) { return p + c });
          return sum;
        },
        "Shipper/Logistics Cost": function (args) {
          return args[0] * args[1];
        }
      };
      var argsList = {
        "VHT-Truck": function (r, j) { return [rows[j]["VHT-Truck"]]; },
        "Total": function (r, j) {
          var t = [];
          h1.forEach(function (k) { t.push(r[k]); });
          return t;
        },
        "Shipper/Logistics Cost": function (r, j) {
          return [r["Total"], logisticsFactor];
        }
      };
      h1.forEach(function (k) {
        fnList[k] = function (args) { return args[0] * args[1] * args[2] * args[3]; };
        argsList[k] = function (r, j) { return [r["VHT-Truck"], tonsPerVehicle, mix[k], cost[k]]; };
      });




      r.Rows = indexes.map(function (i) {
        return computeRow(i, r.Headers, fnList, argsList);
      });
      return r;
    };


    ["base", "project"].forEach(function (o) {

      output[o] = run(spec[o]);
    });
    return output;
  };
  var costs = function (args) {
    var dRate = args.input.discountRate;
    var cStartY = args.input.constructionStartYear;
    var oStartY = args.input.operationStartYear;
    var constY = args.input.constantYear;
    var cost = args.input.constructionCost;
    var omCost = args.input.omCost;
    var totalY = args.input.totalYears;

    var cYears = [];
    for (var i = cStartY; i < cStartY + totalY; i++)
    {
      cYears.push(i);

    }

    var r = { Headers: [], Rows: [], RowIndex: [] };
    r.Headers = ['Startup Costs','O&M Costs','Total Costs'];
    r.RowIndex = cYears;
    cYears.forEach(function (y) {
      var rate = 1/Math.pow(1+dRate,y-constY);
      var row = {

      };
      if (y < oStartY) {
        row['Startup Costs'] = cost / (oStartY - cStartY) * rate;
        row['O&M Costs']=0;
      }
      else{
        row['Startup Costs'] =0;
        row['O&M Costs'] = omCost * rate;
      }
      row['Total Costs']=row['Startup Costs']+row['O&M Costs'];
      r.Rows.push(row);
    });
    r.Totals = getTotal(r);
    return r;


  };
  var computeResults = function (args) {
    var id = 0;
    var regionFactor = function(r,t){
      var d = {
        Urban:{Passenger:0.9,Truck:0.75},
        Suburban:{Passenger:0.75,Truck:0.6},
        Rural:{Passenger:0.6,Truck:0.5}
      };
      var cd = d[r];
      var f = [];
      t.forEach(function(k){f.push(cd[k])});
      return f;
    };
    var benefits = args.benefits;
    var costs = args.costs.Totals;
    var region = args.region;
    var econFactors = economicFactors({});
    var countNonZero = function(o){
      var count=[0,0];
      o.RowIndex.forEach(function(k,i){
        if (o.Rows[i]['Startup Costs']!=0) {count[0]+=1;}
        if (o.Rows[i]['O&M Costs']!=0) {count[1]+=1;}
      });
      return count
    };
    var yearsToAvg = countNonZero(args.costs);
    var bItems = [{
      name: 'Vehicle Operating Cost Savings',
      category: 'Benefits',
      data: benefits,
      items: ['Operation Cost-Passenger', 'Operation Cost-Truck'],
      factor: regionFactor(region,['Passenger','Truck'])
    },
    {
      name: 'Business Time and Reliability Cost Savings',
      category: 'Benefits',
      data: benefits,
      items: ['Value of Time-Business Passenger', 'Value of Time-Business Truck'],
      factor: regionFactor(region,['Passenger','Truck'])
    },
    {
      name: 'Personal Time and Reliability Cost Savings',
      category: 'Benefits',
      data: benefits,
      items: ['Value of Time-Personal'],
      factor: regionFactor(region,['Passenger'])
    },
    {
      name: 'Safety Benefits',
      category: 'Benefits',
      data: benefits,
      items: ['Safety Cost'],
      factor:  regionFactor(region,['Passenger'])
    },
    {
      name: 'Logistics/Freight Cost Savings',
      category: 'Benefits',
      data: benefits,
      items: ['Shipper/Logistics Cost'],
      factor:  regionFactor(region,['Truck'])
    },
    {
      name: 'Environmental Benefits',
      category: 'Benefits',
      data: benefits,
      items: ['Environmental Cost'],
      factor: regionFactor(region,['Truck'])
    },
    {
      name: 'Business Output',
      category: 'Benefits',
      data: costs,
      items: ['Total Costs'],
      factor: [econFactors[region].businessOutputMultiplier*args.scale.Passenger]
    },
    {
      name: 'Positive Economic Effect of Wage Income',
      category: 'Benefits',
      data: costs,
      items: ['Total Costs'],
      factor:[econFactors[region].wageIncomeMultiplier*args.scale.Passenger]
    }];

    var cItems=[{
      name: 'Capital Costs',
      category: 'Costs',
      data: costs,
      items: ['Startup Costs'],
      factor: [1]
    },
    {
      name: 'O&M Costs',
      category: 'Costs',
      data: costs,
      items: ['O&M Costs'],
      factor: [1]
    },
  ];
  var r = { Headers: [], RowIndex: [], Rows: [] };
  r.Headers = ['Benefits and Costs', 'Present Value (2018)'];
  var sum = 0;
  var val = {};


  bItems.forEach(function (k) {
    r.RowIndex.push(id++);
    var s = 0;
    k.items.forEach(function (n,j) {
      s += k.data[n]*k.factor[j];
    });
    var v = {};
    v[r.Headers[0]] = k.name;
    v[r.Headers[1]] = s;
    r.Rows.push(v);
    sum += s;
  });
  var val = {};
  val[r.Headers[0]] = 'Total Benefits';
  val[r.Headers[1]] = sum;
  r.RowIndex.push(id++);
  r.Rows.push(val);
  var tBenefits = sum;
  sum = 0;
  cItems.forEach(function (k) {
    r.RowIndex.push(id++);
    var s = 0;
    k.items.forEach(function (n,j) {
      s += k.data[n]*k.factor[j];
    });
    var v = {};
    v[r.Headers[0]] = k.name;
    v[r.Headers[1]] = s;
    r.Rows.push(v);
    sum += s;
  });
  var val = {};
  val[r.Headers[0]] = 'Total Costs';
  val[r.Headers[1]] = sum;
  var tCosts = sum;

  r.Rows.push(val);

  r.RowIndex.push(id++);
  var val = {};
  val[r.Headers[0]] = 'Benefit / Cost Ratio';
  val[r.Headers[1]] =tBenefits / tCosts;

  r.Rows.push(val);
  r.RowIndex.push(id++);
  var jItems=[{
    name: 'Construction Jobs',
    category: 'Jobs',
    data: costs,
    items: ['Startup Costs'],//requested item name from data
    factor: [1/econFactors[region].constructionJobFactor/yearsToAvg[0]]
  },
  {
    name: 'O&M Jobs',
    category: 'Jobs',
    data: costs,
    items: ['O&M Costs'],
    factor: [1/econFactors[region].omJobFactor/yearsToAvg[0]]
  },];
  jItems.forEach(function (k) {
    r.RowIndex.push(id++);
    var s = 0;
    k.items.forEach(function (n,j) {
      s += k.data[n]*k.factor[j];
    });
    var v = {};
    v[r.Headers[0]] = k.name;
    v[r.Headers[1]] = s;
    r.Rows.push(v);
    sum += s;
  });
  return r;
};
var results = {};
var indexes = getIndexes();
var years = getYears();


var self = {};

self.results = {};
self.results.getRange = function (range) {
  var r = {};

};
self.run = function(){
  //self.setTravelImpacts({averageSpeed:48.7,percentCongested:0.25746,truckPercent:0.089,projectLength:7.2305317,projectScenario:0.1,AADT:48959,rider:330921,riderReduction:0.75});
  //self.setBenefits({discountRate:0.03},inputs.benefits);
  //self.setCosts({discountRate: 0.03,
  //     constructionStartYear: 2015,
  //    operationStartYear: 2018,
  //    constantYear: 2015,
  //    constructionCost:0.5,
  //	omCost:0.17},inputs.costs);
  //self.setFreightTimeCost({},inputs.freightTimeCost);
  //['travelImpacts','freightTimeCost','benefits','costs'].forEach(function(o){
  //	results[o]=this[o]({input:inputs[o],data:results});
  //});

  results.travelImpacts = travelImpacts({input:inputs.travelImpacts});
  results.freightTimeCost = freightTimeCost({ input:inputs.freightTimeCost,data: results });
  results.benefits = benefits({ input:inputs.benefits,data: results });
  results.costs = costs({
    input:inputs.costs
  });
  results.report = computeResults({
    benefits: results.benefits.Totals,
    costs: results.costs,
    region:inputs.region,
    scale:inputs.scale//mask the businessOutput in the Ag model
  }
);

self.results = results;
return self;
};
self.show = function ()
{
  // self.run();
  console.log(results);
  return self;

};
self.setTravelImpacts = function(args){

  update(args, inputs.travelImpacts);
  indexes = getIndexes();
  years = getYears();
  return self;


};
self.setBenefits = function(args){
  update(args,inputs.benefits);
  return self;

};
self.setCosts = function(args){
  update(args,inputs.costs);
  return self;
};
self.setFreightTimeCost=function(args){
  update(args,inputs.freightTimeCost);
  return self;
};

self.setInputs = function(args)
{
  var a;
  if (args===undefined)
  a = defaults({});
  else
  a = args;

  if (a.region) inputs.region = a.region;
  if (a.scale) inputs.scale = a.scale;
  //var d = existingStations(a.closestStation);
  var d = {
    "projectLength":a.projectLength,
    "percentCongested":a.percentCongested,
    "AADT":a.AADT,
    "truckPercent":a.truckPercent,
    "averageSpeed":a.averageSpeed
  }
  var capitolCost;
  if (a.constructionCostPerMile!==undefined)
  capitolCost=a.constructionCostPerMile;
  else
  capitolCost = a.capitolCost;
  var constructionCost = capitolCost * a.milesToStatio;
  var omCost = a.omCost;
  self.setTravelImpacts(d, inputs.travelImpacts);
  self.setTravelImpacts({
    startYear: a.operationStartYear,
    totalYears: a.totalYears,
    rider: a.rider,
    projectScenario: a.projectScenario,
    travelGrowthRate: a.travelGrowthRate,
    averageSpeedBase: a.averageSpeedBase,
    averageSpeedProj: a.averageSpeedProj,
    scale: a.scale//percentAg
  }, inputs.travelImpacts);
  //self.setTravelImpacts({averageSpeed:48.7,percentCongested:0.25746,truckPercent:0.089,projectLength:7.2305317,projectScenario:0.1,AADT:48959,rider:330921,riderReduction:0.75});
  self.setBenefits({ discountRate: a.discountRate, constantYear:2014}, inputs.benefits); //Check the constant year
  self.setCosts({
    discountRate: a.discountRate,
    constructionStartYear: a.constructionStartYear,
    operationStartYear: a.operationStartYear,
    constantYear: a.constantYear,
    totalYears: a.totalYears,
    constructionCost: a.constructionCost,
    omCost: a.omCost,
  }, inputs.costs);
  //self.setCosts({constructionCost:constructionCost,omCost:omCost});
  self.setFreightTimeCost(inputs.travelImpacts, inputs.freightTimeCost);
  self.setFreightTimeCost({commodityMix:a.commodityMix,commodityCost:a.commodityCost}, inputs.freightTimeCost);
  indexes = getIndexes();
  years = getYears();
};
var initialize = function () {
  self.setInputs();

};
initialize();
if (spec.input!==undefined)
self.setInputs(spec.input);
//var input = spec.input;
return self;


}
TTI.Models.DebtServicesModel = function (spec) {
  var input = {};

  var self = {};
  var results={};
  var combineBonds = function(b){
    var r = {Headers:[],RowIndex:[],Rows:[]};
    var keys = Object.keys(b);
    for (y=2016;y<2061;y++)
    {
      r.RowIndex.push(y);
    }
    r.RowIndex.forEach(function(k,j){
      var year = k;
      var row = {};
      var sum = 0;
      keys.forEach(function(k,j){
        var index = b[k].RowIndex.indexOf(year);
        if (index===-1) row[j]=0;
        else row[j] = b[k].Rows[index].Payment;
        sum+= row[j];
      });
      row["Total Debt Service"]=sum;
      row["Annual Revenue Needed"]=sum*input.debtCoverageRatio;
      r.Rows.push(row);

    });
    r.Headers = Object.keys(r.Rows[0]);
    return r;

  };
  self.computeBond=function(args){
    var y = args.startYear;
    var bond = args.bondAmount;
    var ai = args.interest;
    var per = args.periods;
    var r = {Headers:[],RowIndex:[],Rows:[]};
    for (var i=0;i<per;i++){
      r.RowIndex.push(y+i);
    }
    r.Headers = ['Starting Blance','Principal','Interest','Ending Balance','Payment']
    var res = bond;
    r.Rows=r.RowIndex.map(function(k,j){
      var ret = {};
      var vec = [];
      vec[0]=res;
      vec[1]=ExcelFormulas.PPMT(ai,j+1,per,bond);
      vec[2]=ExcelFormulas.IPMT(ai,j+1,per,bond);
      vec[3]=vec[0]+vec[1];
      vec[4]=-vec[1]-vec[2];
      res = vec[3];
      r.Headers.forEach(function(k,j){ret[k]=vec[j]});
      return ret;
    });
    return r;

  };

  self.run=function(){
    var startYears = input.startYears;
    var debtCoverageRatio = input.debtCoverageRatio;
    var issuanceCost = input.issuanceCost;
    var eachIssueNeed = input.amountNeeded / input.numberOfEqualIssues;
    var actualBondAmt = eachIssueNeed*(1+input.issuanceCost);
    var yearsToPayBack = input.yearsToPayBack;
    var annualInterest = input.annualInterest;
    var items=[];
    var bonds = {};
    startYears.forEach(function(k,j){
      items.push({id:j,startYear:k,bondAmount:actualBondAmt,interest:annualInterest,periods:yearsToPayBack});

    });
    //var items = [
    //{id:0,startYear:2016,bondAmount:2040000000,interest:0.04,periods:30},
    //{id:1,startYear:2020,bondAmount:2040000000,interest:0.04,periods:30},
    //{id:2,startYear:2025,bondAmount:2040000000,interest:0.04,periods:30},
    //];

    items.forEach(function(o){
      bonds[o.id]=self.computeBond(o);
      bonds[o.id].Totals=getTotal(bonds[o.id]);
    });
    results = combineBonds(bonds);
    results.Totals = getTotal(results);
    self.results = results;
    return self;
  };
  self.show = function()
  {

    console.log(results);
    return self;
  };
  self.setInputs = function(args)
  {
    if(args===undefined)
    console.log('Input is empty!');
    update(args,input);
    return self;
  }
  self.setInputs(spec.input);
  return self;
};
TTI.Models.InputOutputModel = function (spec) {
  var input = {};
  var self = {};
  var results = {};
  var mult12 = function(args){
    var r = {
      "Agriculture/forest/fish": {
        "Sector":1,
        "SEC":"1, 2, 7-9",
        "EMP DIR":22.795,
        "EMP MULT":1.999,
        "INC DIR":0.2662,
        "INC MULT":2.6982,
        "FINDEM":3.1601,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Mining": {
        "Sector":2,
        "SEC":"10, 13",
        "EMP DIR":7.526,
        "EMP MULT":3.33,
        "INC DIR":0.3048,
        "INC MULT":2.3145,
        "FINDEM":2.9153,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Construction": {
        "Sector":3,
        "SEC":"15-17",
        "EMP DIR":23.278,
        "EMP MULT":2.012,
        "INC DIR":0.3361,
        "INC MULT":2.4363,
        "FINDEM":3.2913,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Manufacture": {
        "Sector":4,
        "SEC":"20, 22-24, 26-39",
        "EMP DIR":6.686,
        "EMP MULT":3.595,
        "INC DIR":0.1992,
        "INC MULT":2.9218,
        "FINDEM":2.7949,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Transportation": {
        "Sector":5,
        "SEC":"41, 42, 44-47",
        "EMP DIR":13.954,
        "EMP MULT":2.501,
        "INC DIR":0.3814,
        "INC MULT":2.1742,
        "FINDEM":3.1838,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Communications": {
        "Sector":6,
        "SEC":"48",
        "EMP DIR":10.938,
        "EMP MULT":2.576,
        "INC DIR":0.3806,
        "INC MULT":1.9625,
        "FINDEM":2.8578,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Utilities": {
        "Sector":7,
        "SEC":"49",
        "EMP DIR":3.149,
        "EMP MULT":6.398,
        "INC DIR":0.1698,
        "INC MULT":3.4047,
        "FINDEM":2.8999,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Wholesale Trade": {
        "Sector":8,
        "SEC":"50, 51",
        "EMP DIR":10.803,
        "EMP MULT":2.867,
        "INC DIR":0.4007,
        "INC MULT":2.0555,
        "FINDEM":3.0959,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Retail Trade": {
        "Sector":9,
        "SEC":"52-59",
        "EMP DIR":36.89,
        "EMP MULT":1.559,
        "INC DIR":0.3501,
        "INC MULT":2.2251,
        "FINDEM":3.0779,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Finance/insurance/real Estate": {
        "Sector":10,
        "SEC":"60-67",
        "EMP DIR":7.964,
        "EMP MULT":3.13,
        "INC DIR":0.2082,
        "INC MULT":2.6635,
        "FINDEM":2.5936,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Health Services": {
        "Sector":11,
        "SEC":"80",
        "EMP DIR":19.635,
        "EMP MULT":2.267,
        "INC DIR":0.4588,
        "INC MULT":2.1374,
        "FINDEM":3.512,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      },
      "Other Services": {
        "Sector":12,
        "SEC":"70's & 80's",
        "EMP DIR":33.019,
        "EMP MULT":1.681,
        "INC DIR":0.4413,
        "INC MULT":2.0541,
        "FINDEM":3.2886,
        "FED TAX":"0",
        "STA TAX":"0",
        "LOC TAX":"0"
      }
    };
    return r;

  };

  var data = mult12({});
  var allSectors = Object.keys(data);

  self.data = data;

  var ppiRatio = 100.2/192.9;


  var convertArrToTblData=function(arr)
  {
    if (!$.isArray(arr))
    return null;
    var keys = Object.keys(arr[0]);
    var rIndex = arr.map(function(k,j){return j});
    var r = {Headers:keys,RowIndex:rIndex,Rows:arr};
    return r;

  };
  self.run=function(){
    var changeInProd  = input.changeInProduction;
    var sel = input.selected;
    sel.forEach(function(k,j){

      var r = {};
      var rr = {};
      var selName;
      var prod;
      if (Array.isArray(changeInProd))
      prod = changeInProd[j];
      if (!isNaN(changeInProd))
      prod = changeInProd;
      if(typeof k === 'string')
      selName = k;
      else
      selName = allSectors[k-1];

      r['Retail Trade']=[{'Revenue':prod}];
      var vOfSec = data[selName]['EMP DIR']*prod*ppiRatio/1000000;
      var vOfEcon = data[selName]['EMP MULT']*vOfSec;
      r['Number of Jobs']=[{'Sector':vOfSec,'Economy Wide':vOfEcon}];
      var vOfSec = data[selName]['INC DIR']*prod;
      var vOfEcon = data[selName]['INC MULT']*vOfSec;
      r['Personal Income']=[{'Sector':vOfSec,'Economy Wide':vOfEcon}];
      var vOfEcon = data[selName]['FINDEM']*prod;
      r['Economic Activity']=[{'Economy Wide':vOfEcon}];

      var keys = Object.keys(r);
      keys.forEach(function(k,j){rr[k]=convertArrToTblData(r[k])});
      results[selName] =  rr;
    });
    self.results = results;
    return self;
  };

  self.show=function(){
    //self.run();
    console.log(results);
    return self;
  };
  self.setInputs = function(args){
    if(args===undefined)
    console.log('Input is empty!');
    else
    update(args,input);
    return self;
  };
  self.setInputs(spec.input);
  return self;

};
