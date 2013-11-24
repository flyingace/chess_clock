define(['backbone', 'jquery', 'underscore', 'models/Settings_Model', 'views/Button_View', 'views/setup/Play_Times_View', 'views/setup/Mode_View', 'views/setup/Settings_View',
    'views/setup/Set_Buttons_View', 'text!templates/setupTemplate.html'],
    function(Backbone, $, _, Settings_Model, Button_View, Play_Times_View, Mode_View, Settings_View, Set_Buttons_View, Setup_Template) {
        var Setup_Panel_View = Backbone.View.extend({

            events: {
                'click #same-times': 'toggleSamePlayTimes',
                'click #set-button': 'onSet',
                'click #cancel-button': 'onCancel'
            },

            el: '#setup-panel',

            initialize: function() {
                _.bindAll(this, 'toggleSamePlayTimes', 'onSet', 'onCancel', 'hmsToMSecs');

                this.model = this.options.model;
                this.model.on('change:samePlayTimes', this.toggleSamePlayTimes);
            },

            template: Setup_Template,

            render: function() {

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

            toggleSamePlayTimes: function() {
                if (event.target.checked) {
                    $('#p2HH')[0].value = $('#p1HH')[0].value;
                    $('#p2MM')[0].value = $('#p1MM')[0].value;
                    $('#p2SS')[0].value = $('#p1SS')[0].value;
                }
            },

            onSet: function() {
                //include code for updating values;
                var p1Time, p2Time, sameTimes, gameMode, addlTime, tapSound, timeUpSound;
                p1Time = this.hmsToMSecs($('#p1HH')[0].value, $('#p1MM')[0].value, $('#p1SS')[0].value);
                p2Time = this.hmsToMSecs($('#p2HH')[0].value, $('#p2MM')[0].value, $('#p2SS')[0].value);
                sameTimes = $('#same-times').first().checked;
                gameMode = $('#mode-menu').val();
                addlTime = ($('#delay-menu-wrapper').hasClass('hidden')) ? 0 : parseInt($('#delay-menu').val(), 10);
                tapSound = $('#tap-sound').is(':checked');
                timeUpSound = $('#timeUp-sound').is(':checked');
                console.log(timeUpSound);
                this.model.set({activePlayer: 'P1', samePlayTimes: sameTimes, gameMode: gameMode, additionalTime: addlTime, playTapSound: tapSound, playTimeUpSound: timeUpSound, activePanel: 'clocks'});
                this.model.get('clock_model_p1').set('remainingMSecs', p1Time);
                this.model.get('clock_model_p2').set('remainingMSecs', p2Time);
                this.model.get('clock_model_p1').set('timeIsUp', false, {silent:true});
                this.model.get('clock_model_p2').set('timeIsUp', false, {silent:true});
                $('.message').html("").removeClass('shown');
                console.log(this.model.get('clock_model_p1').get('remainingMSecs'));

                var $timerBtn = $('#timer-btn');

                $timerBtn.removeClass('pause resume').addClass('start');
                $timerBtn + $('p').html('Start');

                CC.eventAgg.trigger('clocks set');
            },

            onCancel: function() {
                if ($('#clock-p1').length === 0) {
                    this.onSet();
                } else {
                    this.model.set('activePanel', 'clocks');
                }
            },

            hmsToMSecs: function(hours, minutes, seconds) {
                var msecs = 0;
                msecs += (parseInt(hours) * 3600000);
                msecs += (parseInt(minutes) * 60000);
                msecs += (parseInt(seconds) * 1000);
                return msecs;
            }
        });
        return Setup_Panel_View;
    });