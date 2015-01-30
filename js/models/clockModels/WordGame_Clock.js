define(['backbone', 'jquery', 'underscore', 'models/clockModels/Clock_Model'],
    function (Backbone, $, _, Clock_Model) {

        var WordGame_Clock = Clock_Model.extend({

            //if Word Game, no additional time is added, but when the clock reaches zero it begins counting back up
            startClock: function () {
                var startTime, currentTime, newTime, self = this,
                    direction;

                startTime = Date.now();

                this.clockTick = window.setInterval(function () {
                    self.mSecsRemaining = self.get('remainingMSecs');
                    currentTime = Date.now();
                    //if the player goes into overtime, change the clock's direction by multiplying by -1
                    direction = (self.get('timeIsUp')) ? -1 : 1;
                    self.mSecsRemaining -= ((currentTime - startTime) * direction);
                    newTime = self.mSecsToHMS(self.mSecsRemaining);
                    self.set('remainingTime', newTime);
                    self.isTimeUp(self.mSecsRemaining);
                }, 100);
            },

            resumeClock: function () {
                this.startClock();
            },

            isTimeUp: function (mSecs) {
                if (mSecs <= 100) {
                    this.stopClock();
                    this.set('remainingMSecs', 0);
                    this.set('timeIsUp', true);
                    this.startClock();
                }
            }
        });

        return WordGame_Clock;
    });
