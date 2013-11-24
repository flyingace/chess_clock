define(['backbone', 'jquery', 'underscore', 'views/setup/Time_Increment_View', 'text!templates/setupTemplates/playTimesTemplate.html'],
    function(Backbone, $, _, Time_Increment_View, Play_Times_Template) {
        var Play_Time_View = Backbone.View.extend({

                events: {
                },

                template: Play_Times_Template,

                initialize: function() {
                    var $p1Display, $p2Display, p1HMS, p2HMS;

                    _.bindAll(this, 'toHMS', 'addLeadingZero');

                    this.model = this.options.model;

                    clockModelP1 = this.model.get('clock_model_p1');
                    clockModelP2 = this.model.get('clock_model_p2');

                    p1HMS = this.toHMS(clockModelP1.get('startMSecs'));
                    p2HMS = this.toHMS(clockModelP2.get('startMSecs'));

                    this.p1HoursView = new Time_Increment_View({min: 0, max: 23, fieldId: 'p1HH', value: p1HMS[0]});
                    this.p1MinutesView = new Time_Increment_View({min: 0, max: 59, fieldId: 'p1MM', value: p1HMS[1]});
                    this.p1SecondsView = new Time_Increment_View({min: 0, max: 59, fieldId: 'p1SS', value: p1HMS[2]});

                    this.p2HoursView = new Time_Increment_View({min: 0, max: 23, fieldId: 'p2HH', value: p2HMS[0]});
                    this.p2MinutesView = new Time_Increment_View({min: 0, max: 59, fieldId: 'p2MM', value: p2HMS[1]});
                    this.p2SecondsView = new Time_Increment_View({min: 0, max: 59, fieldId: 'p2SS', value: p2HMS[2]});
                },

                render: function() {
                    $p1Display = $('#p1.time-display');
                    $p2Display = $('#p2.time-display');

                    $p1Display.append(
                        this.p1HoursView.render().el,
                        this.p1MinutesView.render().el,
                        this.p1SecondsView.render().el
                    );

                    $p2Display.append(
                        this.p2HoursView.render().el,
                        this.p2MinutesView.render().el,
                        this.p2SecondsView.render().el
                    );

                    return this;
                },

                toHMS: function(mSecs) {
                    var hmsArray = [];

                    var secs = Math.floor(mSecs / 1000);
                    var hoursDisplay = this.addLeadingZero(Math.floor(secs / (60 * 60)));
                    hmsArray.push(hoursDisplay);

                    var divisor_for_minutes = secs % (60 * 60);
                    var minutesDisplay = this.addLeadingZero(Math.floor(divisor_for_minutes / 60));
                    hmsArray.push(minutesDisplay);

                    var divisor_for_seconds = divisor_for_minutes % 60;
                    var secondsDisplay = this.addLeadingZero(Math.ceil(divisor_for_seconds));
                    hmsArray.push(secondsDisplay);

                    return hmsArray;
                },

                addLeadingZero: function(unit) {
                    var leadingZero = "0";
                    var displayUnit = (unit.toString().length < 2) ? leadingZero.concat(unit.toString()) : unit.toString();

                    return displayUnit;
                }
            })
            ;
        return Play_Time_View;
    })
;