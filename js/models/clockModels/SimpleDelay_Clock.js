define(['backbone', 'jquery', 'underscore', 'models/clockModels/Clock_Model'],
    function (Backbone, $, _, Clock_Model) {

        var SimpleDelay_Clock = Clock_Model.extend({

            //if Simple Delay, the clock won't start counting down until the amount of additional time has elapsed
            startClock: function () {
                var startTime, currentTime, newTime, self = this;

                window.setTimeout(function () {

                    startTime = new Date().getTime();

                    self.clockTick = window.setInterval(function () {
                        self.mSecsRemaining = self.get('remainingMSecs');
                        currentTime = new Date().getTime();
                        self.mSecsRemaining -= (currentTime - startTime);
                        newTime = self.mSecsToHMS(self.mSecsRemaining);
                        self.set('remainingTime', newTime);
                        self.isTimeUp(self.mSecsRemaining);
                    }, 100);
                }, this.get('additionalTime'));
            },
        });

        return SimpleDelay_Clock;
    });
