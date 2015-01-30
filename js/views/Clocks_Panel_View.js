define(['backbone', 'jquery', 'underscore', 'views/clock/Player_View', 'text!templates/clocksPanelTemplate.html'],
    function (Backbone, $, _, Player_View, Clocks_Panel_Template) {
        var Clocks_Panel_View = Backbone.View.extend({

            events: {
                'click #timer-btn': 'updateTimerState',
                'click #setup-btn': 'goToSetupPanel'
            },

            el: '#clocks-panel',

            template: Clocks_Panel_Template,

            initialize: function (options) {
                _.bindAll(this, 'cleanUpPlayerViews', 'updateTimerState', 'resetTimerState', 'goToSetupPanel', 'toggleListeners', 'setP1Active', 'setP2Active', 'toggleActiveClock', 'disableClockListeners', 'playTapSound', 'onTimeUp', 'displayMessages', 'playTimeUpAlert');

                this.model = options.model;

                //this is where you need to build out the click-handling-audio methods using
                //var media = new Media(src, mediaSuccess, [mediaError], [mediaStatus]);
                //release audio after complete?
                //load audio into memory?
                this.clickSound = new Media('audio/click1.wav', null, function(error) {
                    alert(error.code, error.message);
                }); //document.getElementById('click-sound');
                this.timeUpSound = new Media('audio/ExpiredBell.mp3'); //document.getElementById('timeUp-sound');


                this.listenTo(this.model, 'change:gameMode', this.render, this);

            },

            render: function () {

                $(this.el).html(_.template(this.template));

                this.clock_model_p1 = this.model.get('clock_model_p1');
                this.clock_model_p2 = this.model.get('clock_model_p2');

                this.listenTo(this.clock_model_p1, 'change:timeIsUp', this.onTimeUp);
                this.listenTo(this.clock_model_p2, 'change:timeIsUp', this.onTimeUp);

                this.cleanUpPlayerViews();

                this.player_view_p1 = new Player_View({el: '#clock-p1', settings: this.model, model_lg: this.clock_model_p1, model_sm: this.clock_model_p2});
                this.player_view_p2 = new Player_View({el: '#clock-p2', settings: this.model, model_lg: this.clock_model_p2, model_sm: this.clock_model_p1});

                this.player_view_p1.render().el;
                this.player_view_p2.render().el;

                return this;
            },

            cleanUpPlayerViews: function () {
                if (this.player_view_p1) {
                    this.player_view_p1.cleanClocks();
                    this.player_view_p2.cleanClocks();
                    this.player_view_p1.remove();
                    this.player_view_p2.remove();
                }
            },

            //TODO: Add "ended" button to sequence
            updateTimerState: function () {
                var $timerBtn = $('#timer-btn'),
                    add_, remove_, state_;

                if ($timerBtn.hasClass('ended')) {
//                    break;
                } else if ($timerBtn.hasClass('start')) {
                    remove_ = 'start';
                    add_ = 'pause';
                    state_ = 'started';
                } else if ($timerBtn.hasClass('pause')) {
                    remove_ = 'pause';
                    add_ = 'resume';
                    state_ = 'paused';
                } else {
                    remove_ = 'resume';
                    add_ = 'pause';
                    state_ = 'resumed';
                }

                $timerBtn.removeClass(remove_).addClass(add_);
                this.model.set('clockState', state_);

                this.toggleListeners();
            },

            goToSetupPanel: function () {
                var $timerBtn = $('#timer-btn'),
                    $timerLabel = $('#timer-btn p');

                if ($timerBtn.hasClass('pause')) {
                    $timerBtn.removeClass('pause').addClass('resume');
                    $timerLabel.html('Resume');
                    this.model.set('clockState', 'paused');
                }

                this.model.set('activePanel', 'setup');

                this.toggleListeners();
            },

            resetTimerState: function () {
                this.model.set('clockState', 'stopped');
            },

            toggleListeners: function () {
                var clockState = this.model.get('clockState'),
                    isTicking = (clockState === 'started' || clockState === 'resumed'),
                    activePlayer = this.model.get('activePlayer');

                if (isTicking && activePlayer === "P1") {
                    this.setP1Active();
                } else if (isTicking) {
                    this.setP2Active();
                } else {
                    this.disableClockListeners();
                }
            },

            setP1Active: function () {
                this.model.set('activePlayer', 'P1');
                this.playTapSound(); //tap sound will only play if active player's button is tapped
                this.player_view_p1.delegateEvents({'click' : this.setP2Active});
                this.player_view_p2.undelegateEvents();
                this.toggleActiveClock('p1')
            },

            setP2Active: function () {
                this.model.set('activePlayer', 'P2');
                this.playTapSound(); //tap sound will only play if active player's button is tapped
                this.player_view_p2.delegateEvents({'click' : this.setP1Active});
                this.player_view_p1.undelegateEvents();
                this.toggleActiveClock('p2')
            },

            toggleActiveClock: function (activeClock) {
                console.log('activeClock:' + activeClock);
                var $p1Large = $('#clock-p1 .clock-lg'),
                    $p2Large = $('#clock-p2 .clock-lg');
                if (activeClock === 'p1') {
                    $p1Large.addClass('active');
                    $p2Large.removeClass('active');
                } else if (activeClock === 'p2') {
                    $p1Large.removeClass('active');
                    $p2Large.addClass('active');
                } else {
                    $p1Large.removeClass('active');
                    $p2Large.removeClass('active');
                }
            },

            disableClockListeners: function () {
                this.player_view_p1.undelegateEvents();
                this.player_view_p2.undelegateEvents();
                this.toggleActiveClock()
            },

            playTapSound: function () {
                if (this.model.get('playTapSound')) {
                    this.clickSound.play();
                }
            },

            onTimeUp: function () {
                this.displayMessages();
                this.playTimeUpAlert();
                if (this.model.get('gameMode') !== 'Word_Game') {
                    this.disableClockListeners();
                    $('#timer-btn').removeClass('start pause resume').addClass('ended');
                    this.model.set('clockState', 'ended');
                } else {

                }

//                this.toggleListeners();
            },

            displayMessages: function () {
                var activePlayer = this.model.get('activePlayer'),
                    gameMode = this.model.get('gameMode'),
                    $p1Message = $('#clock-p1 .message'),
                    $p2Message = $('#clock-p2 .message'),
                    activePlayerMsg, inactivePlayerMsg;

                if (gameMode !== "Word_Game") {
                    activePlayerMsg = "Your Time Has Expired";
                    inactivePlayerMsg = "Opponent's Time Has Expired";
                } else if ($p1Message.hasClass('shown')) {
                    activePlayerMsg = "Both Players Are In Overtime";
                    inactivePlayerMsg = "Both Players Are In Overtime";
                } else {
                    activePlayerMsg = "You Are In Overtime";
                    inactivePlayerMsg = "Your Opponent Is In Overtime";
                }

                if (activePlayer === 'P1') {
                    $p1Message.html(activePlayerMsg);
                    $p2Message.html(inactivePlayerMsg);
                } else {
                    $p1Message.html(inactivePlayerMsg);
                    $p2Message.html(activePlayerMsg);
                }

                $p1Message.addClass('shown');
                $p2Message.addClass('shown');
            },

            playTimeUpAlert: function () {
                if (this.model.get('playTimeUpSound')) {
                    this.timeUpSound.play();
                }
            }

        });
        return Clocks_Panel_View;
    })
;