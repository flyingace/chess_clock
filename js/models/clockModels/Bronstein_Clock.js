define(['backbone', 'jquery', 'underscore', 'models/clockModels/Clock_Model'],
    function (Backbone, $, _, Clock_Model) {

        var Bronstein_Clock = Clock_Model.extend({

            //if Bronstein, additional time is added at the end of the turn, equal to the duration of the turn, unless it exceeds the amount of additional time specified
            stopClock: function () {

                var addlTime, timeToAdd, adjustedMSecs, adjustedHHMMSS;

                //stop the clock
                window.clearInterval(this.clockTick);
                //get additional time value (addlTime)
                addlTime = this.get('additionalTime');
                //get the difference between remainingMSecs & this.mSecsRemaining
                //& add it to any time elapsed before pause was clicked
                this.elapsedTime += this.get('remainingMSecs') - this.mSecsRemaining;
                //if the difference is less than addlTime, add that to the remaining time
                //if not, add addlTime to the remaining time
                timeToAdd = (this.elapsedTime < addlTime) ? this.elapsedTime : addlTime;
                adjustedMSecs = this.mSecsRemaining + timeToAdd;
                adjustedHHMMSS = this.mSecsToHMS(adjustedMSecs);

                this.set({'remainingMSecs': adjustedMSecs, 'remainingTime': adjustedHHMMSS});
            }
        });

        return Bronstein_Clock;
    });
