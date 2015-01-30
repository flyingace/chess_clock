define(['backbone', 'jquery', 'underscore','models/clockModels/Clock_Model'],
    function (Backbone, $, _, Clock_Model) {

        var Fischer_Clock = Clock_Model.extend({

            //if Fischer, additional time is added at the start of the turn
            startClock: function () {
                var startTime, currentTime, newTime, self = this;

                this.mSecsRemaining = this.get('remainingMSecs') + this.get('additionalTime');
                this.set('remainingMSecs', this.mSecsRemaining);

                startTime = Date.now();

                this.clockTick = window.setInterval(function () {
                    self.mSecsRemaining = self.get('remainingMSecs');
                    currentTime = Date.now();
                    self.mSecsRemaining -= (currentTime - startTime);
                    newTime = self.mSecsToHMS(self.mSecsRemaining);
                    self.set('remainingTime', newTime);
                    self.isTimeUp(self.mSecsRemaining);
                }, 100);
            }
        });

        return Fischer_Clock;
    });
