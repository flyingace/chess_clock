define(['backbone', 'jquery', 'underscore', 'models/clockModels/Clock_Model'],
    function (Backbone, $, _, Clock_Model) {

        var SimpleDelay_Clock = Clock_Model.extend({

            //if Simple Delay, the clock won't start counting down until the amount of additional time has elapsed
            startClock: function () {
                var startTime, currentTime, newTime, self = this,
                    addlTime = this.get('additionalTime');
                //Simple Delay clock has this setTimeout added to its startClock method
                self.delayClock = window.setTimeout(function () {

                    startTime = Date.now();

                    self.clockTick = window.setInterval(function () {
                        self.mSecsRemaining = self.get('remainingMSecs');
                        currentTime = Date.now();
                        self.mSecsRemaining -= (currentTime - startTime);
                        newTime = self.mSecsToHMS(self.mSecsRemaining);
                        self.set('remainingTime', newTime);
                        self.isTimeUp(self.mSecsRemaining);
                    }, 100);
                }, addlTime);
            },

            stopClock: function () {
                console.log('stop clock called');

                window.clearTimeout(this.delayClock);
                window.clearInterval(this.clockTick);
                this.set('remainingMSecs', this.mSecsRemaining);
            }

        });

        return SimpleDelay_Clock;
    });
