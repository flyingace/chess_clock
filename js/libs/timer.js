(function() {

    //You'll have to build this to handle the separate functions related to each clock variant
    function Timer(callback, delay) {
        var timerId, startTime, remaining = delay, clockRunning = false;

        this.start = function() {
            clockRunning = true;
            this.resume();
        };

        this.pause = function() {
            window.clearTimeout(timerId);
            remaining -= new Date() - startTime;
        };

        this.resume = function() {
            if (clockRunning) {
                startTime = new Date();
                //not sure how this is getting set back to the original value for delay
                timerId = window.setTimeout(callback, remaining);
            }
        };

        this.stop = function() {
            clockRunning = false;
        };

        this.resume();
    }

    return new Timer;

}());

