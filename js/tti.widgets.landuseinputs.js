TTI.Widgets.LandUseInputs = function(spec) {


    var origSpec = false;

    var waiter = TTI.Widgets.Procrastinator({
        timeout: 200
    });

    console.log('SPEC***', spec);
    var self = TTI.Widgets.ProtoTaxInputs({});

    var myRate = false;


    var landUseHeading;

    var totalPercentageCell = DOM.td().addClass('value-cell');
    var totalQuarterMileAcreageCell = DOM.td().addClass('value-cell');
    var totalHalfMileAcreageCell = DOM.td().addClass('value-cell');


    self.totalLandUsePercentage = function() {
        var total = TTI.landUseTypes.inject(0, function(tot, o) {
            return tot + parseFloat(spec.landUse[o]) || 0;
        });
        return total;
    };


    self.checkLandUsePercentage = function() {
        ///console.log('total land use %',self.totalLandUsePercentage());
        var pct = self.totalLandUsePercentage();
        pct = accounting.toFixed(pct, 1);
        landUseHeading.text('Land use (' + pct + '%)');

        totalPercentageCell.text(accounting.toFixed(pct, 1));

        var totalHalfMileAcres = accounting.toFixed(pct / 100 * TTI.constants.halfMile, 1);
        var totalQuarterMileAcres = accounting.toFixed(pct / 100 * TTI.constants.quarterMile, 1);

        totalQuarterMileAcreageCell.text(totalQuarterMileAcres);
        totalHalfMileAcreageCell.text(totalHalfMileAcres);

        (pct == 100) ? landUseHeading.removeClass('warn'): landUseHeading.addClass('warn');
        (pct == 100) ? totalPercentageCell.removeClass('warn'): totalPercentageCell.addClass('warn');
        (pct == 100) ? totalQuarterMileAcreageCell.removeClass('warn'): totalQuarterMileAcreageCell.addClass('warn');
        (pct == 100) ? totalHalfMileAcreageCell.removeClass('warn'): totalHalfMileAcreageCell.addClass('warn');
    };
    self.setDefaults = function(o) {
        origSpec = JSON.parse(JSON.stringify(o));
    };

    self.renderOn = function(wrap) {
        if (!origSpec) {
            origSpec = JSON.parse(JSON.stringify(spec.landUse));
        }

        myRate = spec.baseRate;
        var totalAcres = Math.round(spec.landUse.totalAcres);
        var landUseWrap = DOM.div().addClass('land-use-wrap');
        var landUseInner = DOM.div().addClass('land-use-inner');
        var landUseChangeYearInput = DOM.input().attr('type', 'text').val(spec.landUse.changeYear).addClass('form-control');
        landUseChangeYearInput.change(function() {
            spec.landUse.changeYear = parseInt(this.value, 10);
            TTI.storage.setItem(TTI.slugify('land-use-change-year'), spec.landUse.changeYear);
            self.publish('recalc', spec);
        });
        landUseChangeYearInput.attr('disabled', !spec.landUse.change);
        var toggleLandUse = DOM.input().attr('type', 'checkbox');
        toggleLandUse.attr('checked', spec.landUse.change);
        if (!spec.landUse.change) {
            landUseInner.css('display', 'none');
        }
        toggleLandUse.change(function() {
            spec.landUse.change = this.checked;
            TTI.storage.setItem(TTI.slugify('land-use-change'), spec.landUse.change); //global, but reset for each city...
            landUseChangeYearInput.attr('disabled', !spec.landUse.change);
            if (!spec.landUse.change) {
                landUseChangeYearInput.css('text-indent', '-900px');
                landUseChangeYearInput.css('text-align', 'left');
                landUseInner.slideUp();
            } else {
                landUseChangeYearInput.css('text-indent', '0px');
                landUseChangeYearInput.css('text-align', 'right');
                landUseInner.slideDown();
            }
        });
        var toggleTable = DOM.table().addClass('toggle-land-use');
        landUseInner.slideDown();
        toggleTable.append(self.tableRow('Allow Land Use Changes?', '&nbsp;', toggleLandUse));
        //  landUseWrap.append(toggleTable);
        landUseWrap.append(landUseInner);



        landUseHeading = DOM.div('Land Use (100%)').addClass('land-use-percentage');
        //  wrap.append(landUseHeading);


        var items = TTI.landUseTypes.select(function(o) {
            return true; //return all of them
            ////return o !== 'No Data'; used to exclude this, now just disable it.
        }).map(function(o) {
            return {
                label: o,
                property: o
            }
        });



        var table = DOM.table();
        landUseInner.append(table);

        var resetButton = DOM.button('reset').addClass('pull-right btn btn-primary btn-block');
        resetButton.click(function() {
            self.publish('reset-land-use');
        });
        table.append(self.tableRow('&nbsp;', '&nbsp;', '&nbsp;', resetButton, '&nbsp;'));

        table.append(self.tableRow('Starting When?', '&nbsp;', '&nbsp;', landUseChangeYearInput, '&nbsp;'));





        table.append(self.tableRow(
            DOM.th('Category'),
            DOM.th('1/4 mi Acre').addClass('align-right'),
            DOM.th('1/2 mi Acre').addClass('align-right'),
            DOM.th('Percentage').addClass('align-right')
        ));



        items.each(function(item) {
            var slug = TTI.landUseSlug(myRate.spec.city, item.property);
            //value was already loaded into spec from localstorage earlier


            var changed = false;
            var origValue = origSpec[item.property];
            //origValue = Math.round(origValue);

            TTI.storage.getItem(slug, function(o) {
                tmp = accounting.toFixed(parseFloat(o), 1);
                if (tmp !== accounting.toFixed(origValue, 1)) {
                    changed = true;
                }
                spec.landUse[item.property] = tmp;
            });

            var specValOrZero = spec.landUse[item.property] || 0;


            //specValOrZero = Math.round(specValOrZero);


            var td1 = DOM.td(item.label);

            var quarterMileAcres = accounting.toFixed(specValOrZero / 100 * TTI.constants.quarterMile, 1);
            var halfMileAcres = accounting.toFixed(specValOrZero / 100 * TTI.constants.halfMile, 1);

            /////var acreageCell = DOM.td(acres).addClass('value-cell');

            var td2 = DOM.td(quarterMileAcres).addClass('value-cell');
            var td2b = DOM.td(halfMileAcres).addClass('value-cell');


            var td3 = DOM.td().addClass('');
            var input = DOM.input().attr('type', 'text').addClass('form-control');


            if (item.property == 'noData') {
                input.attr('disabled', true);
            }


            input.val(accounting.toFixed(specValOrZero, 1));
            input.attr('value', input.val());
            if (changed) {
                input.addClass('changed');
            }

            self.subscribe('reset-land-use', function() {
                spec.landUse[item.property] = origValue;
                TTI.storage.setItem(slug, origValue);
                input.val(origValue); //not round here, round the value displayed in change event
                input.trigger('change');
            });



            input.keypress(TTI.cellValidator);
            input.change(function() {
                var v = parseFloat(this.value);
                if (isNaN(v)) {
                    return false;
                }
                input.val(accounting.toFixed(v, 1)); //round
                input.attr('value', input.val());
                spec.landUse[item.property] = v;
                (Math.round(v) === Math.round(origValue)) ? input.removeClass('changed'): input.addClass('changed');



                var quarterMileAcres = accounting.toFixed(v / 100 * TTI.constants.quarterMile, 1);
                var halfMileAcres = accounting.toFixed(v / 100 * TTI.constants.halfMile, 1);

                /////var acreageCell = DOM.td(acres).addClass('value-cell');

                td2.text(quarterMileAcres);
                td2b.text(halfMileAcres);

                TTI.storage.setItem(slug, v);
                self.checkLandUsePercentage();
                waiter.beg(self, 'recalc', spec);
            });

            td3.append(input);
            ///td3.append(DOM.div('%').addClass('pull-right'));
            var row = self.tableRow(td1, td2, td2b, td3, '%');
            table.append(row);
        });

        table.append(self.tableRow(DOM.strong('TOTAL'), totalQuarterMileAcreageCell, totalHalfMileAcreageCell, totalPercentageCell, '%'));

        self.checkLandUsePercentage();
        wrap.append(landUseWrap);
        TTI.storage.setItem('html-input-landuse', DOM.div(wrap.clone()).html());
        self.subscribe('recalc', function() {
            TTI.storage.setItem('html-input-landuse', DOM.div(wrap.clone()).html());
        });
    };
    return self;
};
