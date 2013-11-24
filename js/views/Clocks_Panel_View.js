define(['backbone', 'jquery', 'underscore', 'views/clock/Player_View', 'text!templates/clocksPanelTemplate.html'],
    function (Backbone, $, _, Player_View, Clocks_Panel_Template) {
        var Clocks_Panel_View = Backbone.View.extend({

            events: {
//                'click .clock-wrap': 'playTapSound',
                'click #timer-btn': 'updateTimerState',
                'click #setup-btn': 'goToSetupPanel'
            },

            el: '#clocks-panel',

            template: Clocks_Panel_Template,

            initialize: function () {
                _.bindAll(this, 'updateTimerState', 'resetTimerState', 'goToSetupPanel', 'toggleListeners', 'setP1Active', 'setP2Active', 'playTapSound', 'onTimeUp', 'displayMessages', 'playTimeUpAlert');

                this.model = this.options.model;

                this.clickSound = document.getElementById('click-sound');
                this.timeUpSound = document.getElementById('timeUp-sound');

                this.model.on('change:gameMode', this.render, this);

            },

            render: function () {

                $(this.el).html(_.template(this.template));

                this.clock_model_p1 = this.model.get('clock_model_p1');
                this.clock_model_p2 = this.model.get('clock_model_p2');

                this.clock_model_p1.on('change:timeIsUp', this.onTimeUp);
                this.clock_model_p2.on('change:timeIsUp', this.onTimeUp);

                this.player_view_p1 = new Player_View({el: '#clock-p1', settings: this.model, model_lg: this.clock_model_p1, model_sm: this.clock_model_p2});
                this.player_view_p2 = new Player_View({el: '#clock-p2', settings: this.model, model_lg: this.clock_model_p2, model_sm: this.clock_model_p1});

                this.player_view_p1.render().el;
                this.player_view_p2.render().el;

                return this;
            },

            updateTimerState: function () {
                var $timerBtn = $('#timer-btn'),
                    add_, remove_, model_;

                if ($timerBtn.hasClass('start')) {
                    remove_ = 'start';
                    add_ = 'pause';
                    model_ = 'started';
                } else if ($timerBtn.hasClass('pause')) {
                    remove_ = 'pause';
                    add_ = 'resume';
                    model_ = 'paused';
                } else {
                    remove_ = 'resume';
                    add_ = 'pause';
                    model_ = 'resumed';
                }

                $timerBtn.removeClass(remove_).addClass(add_);
                this.model.set('clockState', model_);

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
                    $('#clock-p1').off();
                    $('#clock-p2').off();
                }
            },

            setP1Active: function () {
                this.model.set('activePlayer', 'P1');
                this.playTapSound(); //tap sound will only play if active player's button is tapped
                $('#clock-p1').on('click', this.setP2Active);
                $('#clock-p2').off();
            },

            setP2Active: function () {
                this.model.set('activePlayer', 'P2');
                this.playTapSound(); //tap sound will only play if active player's button is tapped
                $('#clock-p2').on('click', this.setP1Active);
                $('#clock-p1').off();
            },

            playTapSound: function () {
                if (this.model.get('playTapSound')) {
                    this.clickSound.load();
                    this.clickSound.play();
                }
            },

            onTimeUp: function () {
                this.displayMessages();
                this.playTimeUpAlert();
            },

            displayMessages: function () {
                var activePlayer = this.model.get('activePlayer'),
                    gameMode = this.model.get('gameMode'),
                    $p1Message = $('#clock-p1 .message'),
                    $p2Message = $('#clock-p2 .message'),
                    activePlayerMsg, inactivePlayerMsg;

                if (gameMode === "Word_Game") {
                    activePlayerMsg = "You Are In Overtime";
                    inactivePlayerMsg = "Your Opponent Is In Overtime";
                } else {
                    activePlayerMsg = "Your Time Has Expired";
                    inactivePlayerMsg = "Opponent's Time Has Expired";
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
                console.log(this.model.get('playTimeUpSound'));
                if (this.model.get('playTimeUpSound')) {
                    this.timeUpSound.load();
                    this.timeUpSound.play();
                }
            }

        });
        return Clocks_Panel_View;
    })
;