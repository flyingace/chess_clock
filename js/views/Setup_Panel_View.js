define(['backbone', 'jquery', 'underscore', 'models/Settings_Model', 'views/Button_View', 'views/setup/Play_Times_View', 'views/setup/Mode_View', 'views/setup/Settings_View',
        'views/setup/Set_Buttons_View', 'text!templates/setupTemplate.html'],
    function (Backbone, $, _, Settings_Model, Button_View, Play_Times_View, Mode_View, Settings_View, Set_Buttons_View, Setup_Template) {
        var Setup_Panel_View = Backbone.View.extend({

            events: {
                'click #same-times': 'toggleSamePlayTimes',
                'click #tap-sound': 'toggleTapSound',
                'click #timeUp-sound': 'toggleTimeUpSound',
                'click #set-button': 'onSet',
                'click #resume-button': 'onResume',
                'click #info-button': 'showInfo'
            },

            el: '#setup-panel',

            initialize: function (options) {
                _.bindAll(this, 'toggleSamePlayTimes', 'toggleTapSound', 'toggleTimeUpSound', 'onSet', 'onResume', 'hmsToMSecs', 'showInfo');

                this.model = options.model;
                this.listenTo(this.model, 'change:samePlayTimes', this.toggleSamePlayTimes);
            },

            template: Setup_Template,

            render: function () {

                $(this.el).html(_.template(this.template));

                var play_times = new Play_Times_View({el: '#play-times-wrap', model: this.model}),
                    mode_menu = new Mode_View({el: '#mode-wrap', model: this.model}),
                    settings = new Settings_View({el: '#settings-wrap', model: this.model}),
                    set_buttons = new Set_Buttons_View({el: '#buttons-wrap', model: this.model});

                play_times.render().el;
                mode_menu.render().el;
                settings.render().el;
                set_buttons.render().el;

                return this;
            },

            toggleSamePlayTimes: function () {
                if (event.target.checked) {
                    $('#p2HH')[0].value = $('#p1HH')[0].value;
                    $('#p2MM')[0].value = $('#p1MM')[0].value;
                    $('#p2SS')[0].value = $('#p1SS')[0].value;
                }
            },

            toggleTapSound: function () {
                var tapSound = $('#tap-sound').is(':checked');
                this.model.set({playTapSound: tapSound});
            },

            toggleTimeUpSound: function () {
                var timeUpSound = $('#timeUp-sound').is(':checked');
                this.model.set({playTimeUpSound: timeUpSound});
            },

            onSet: function () {
                //include code for updating values;
                //TODO: If there are other models currently in place they need to be disposed of
                var p1Time, p2Time, sameTimes, gameMode, addlTime;
                p1Time = this.hmsToMSecs($('#p1HH')[0].value, $('#p1MM')[0].value, $('#p1SS')[0].value);
                p2Time = this.hmsToMSecs($('#p2HH')[0].value, $('#p2MM')[0].value, $('#p2SS')[0].value);
                sameTimes = $('#same-times').first().checked;
                gameMode = $('#mode-menu').val();
                addlTime = ($('#delay-menu-wrapper').hasClass('hidden')) ? 0 : parseInt($('#delay-menu').val(), 10);
                this.model.set({activePlayer: 'P1', samePlayTimes: sameTimes, gameMode: gameMode, additionalTime: addlTime, activePanel: 'clocks'});
                this.model.get('clock_model_p1').set('remainingMSecs', p1Time);
                this.model.get('clock_model_p2').set('remainingMSecs', p2Time);
                this.model.get('clock_model_p1').set('timeIsUp', false, {silent: true});
                this.model.get('clock_model_p2').set('timeIsUp', false, {silent: true});
                $('.message').html("").removeClass('shown');
                $('.clock-lg').removeClass('inOvertime');
//                console.log(this.model.get('clock_model_p1').get('remainingMSecs'));

                var $timerBtn = $('#timer-btn');

                $timerBtn.removeClass('pause resume ended').addClass('start');
//                $timerBtn + $('p').html('Start');

                CC.eventAgg.trigger('clocks set');

                if ($('#resume-button').hasClass('disabled')) {
                    setTimeout(function () {
                        $('#resume-button').removeClass('disabled');
                    }, 1000)
                }
            },

            onResume: function () {
                this.model.set('activePanel', 'clocks');
            },

            hmsToMSecs: function (hours, minutes, seconds) {
                var msecs = 0;
                msecs += (parseInt(hours) * 3600000);
                msecs += (parseInt(minutes) * 60000);
                msecs += (parseInt(seconds) * 1000);
                return msecs;
            },

            showInfo: function () {
                this.model.set('overlayVisible', true);
            }
        });
        return Setup_Panel_View;
    });