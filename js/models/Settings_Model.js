define(['backbone', 'jquery', 'underscore', 'models/clockModels/SuddenDeath_Clock', 'models/clockModels/Fischer_Clock', 'models/clockModels/Bronstein_Clock', 'models/clockModels/SimpleDelay_Clock', 'models/clockModels/WordGame_Clock'],
    function (Backbone, $, _, SuddenDeath_Clock, Fischer_Clock, Bronstein_Clock, SimpleDelay_Clock, WordGame_Clock) {

        var Settings_Model = Backbone.Model.extend({

            defaults: {
                'activePanel': 'setup', //setup, clocks
                'activePlayer': 'P1', //P1, P2
                'clockState': 'stopped', //started, paused, resumed, stopped, (ended?)
                'samePlayTimes': true,
                'gameMode': 'Sudden_Death', //Sudden_Death, Fischer, Bronstein, Simple_Delay, Word_Game
                'additionalTime': 0,
                'playTapSound': true,
                'playTimeUpSound': true,
                'p1StartTime': null,
                'p2StartTime': null
            },

            initialize: function () {
                _.bindAll(this, 'slidePanels', 'onGameModeChange', 'toggleActivePlayer', 'onClockStateChange', 'onAdditionalTimeChange', 'onP1StartTimeChange', 'onP2StartTimeChange');

                this.onGameModeChange();

                this.on('change:activePanel', this.slidePanels);
                this.on('change:gameMode', this.onGameModeChange);
                this.on('change:activePlayer', this.toggleActivePlayer);
                this.on('change:clockState', this.onClockStateChange);
                this.on('change:additionalTime', this.onAdditionalTimeChange);
                this.on('change:p1StartTime', this.onP1StartTimeChange);
                this.on('change:p2StartTime', this.onP2StartTimeChange);
            },

            slidePanels: function () {
                var $main = $('#main');

                if (this.get('activePanel') === 'setup') {
                    $main.removeClass('clocks-visible').addClass('setup-visible');
                } else {
                    $main.removeClass('setup-visible').addClass('clocks-visible');
                }
            },

            onGameModeChange: function () {
                var clockModelToUse;
                console.log(this.get('gameMode'));

                switch (this.get('gameMode')) {
                    case 'Sudden_Death':
                        clockModelToUse = SuddenDeath_Clock;
                        break;
                    case 'Bronstein':
                        clockModelToUse = Bronstein_Clock;
                        break;
                    case 'Fischer':
                        clockModelToUse = Fischer_Clock;
                        break;
                    case 'Simple_Delay':
                        clockModelToUse = SimpleDelay_Clock;
                        break;
                    case 'Word_Game':
                        clockModelToUse = WordGame_Clock;
                        break;
                    default:
                        clockModelToUse = SuddenDeath_Clock;
                        console.log('default');
                        break;
                }

                this.set({'clock_model_p1': new clockModelToUse(), 'clock_model_p2': new clockModelToUse()});


                //TODO: If you're going to reset the clock model, you're going to have to re-render the clocks view.
                //you should consider not rendering the clocks view until set has been hit, and re-rendering it whenever is hit again.
                //Why do I have to re-render the clocks view? Wouldn't it be more efficient to just reset the timers and clear any messages?
                //Actually probably not, because you'll also want to be accounting for a possible change in game mode too.
                //I'm not sure that changing the game mode requires a re-render. It just requires that the views are updated with the new models.

            },

            toggleActivePlayer: function () {
                var clockState = this.get('clockState');
                if (clockState === 'started' || clockState === 'resumed') {
                    if (this.get('activePlayer') === 'P1') {
                        this.get('clock_model_p1').startClock();
                        this.get('clock_model_p2').stopClock();
                    } else {
                        this.get('clock_model_p1').stopClock();
                        this.get('clock_model_p2').startClock();
                    }
                }
            },

            onClockStateChange: function () {
                var newClockState = this.get('clockState'),
                    modelToUpdate = (this.get('activePlayer') === 'P1') ? 'clock_model_p1' : 'clock_model_p2';

                switch (newClockState) {
                    case 'started':
                        this.get(modelToUpdate).startClock();
                        break;
                    case 'paused':
                        this.get(modelToUpdate).pauseClock();
                        break;
                    case 'resumed':
                        this.get(modelToUpdate).resumeClock();
                        break;
                    case 'stopped':
                        this.get(modelToUpdate).stopClock();
                        break;
                    default:
                        console.log(newClockState);
                        console.log('Houston, we have a problem: Settings_Model-onClockStateChange');
                }
            },

            onP1StartTimeChange: function () {
                var p1Time = this.get('p1StartTime');
                if (this.get('samePlayTime')) {
                    this.get('clock_model_p1').set('startMSecs', p1Time);
                    this.set('p1StartTime', p1Time);
                } else {
                    this.get('clock_model_p1').set('startMSecs', p1Time);
                }
            },

            onP2StartTimeChange: function () {
                var p2Time = this.get('p2StartTime');
                this.get('clock_model_p2').set('startMSecs', p2Time);
            },

            onAdditionalTimeChange: function () {
                var additionalTime = this.get('additionalTime');
                this.get('clock_model_p1').set('additionalTime', additionalTime);
                this.get('clock_model_p2').set('additionalTime', additionalTime);
            }
        });

        return Settings_Model;
    })
;
