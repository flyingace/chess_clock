define(['backbone', 'jquery', 'underscore','models/clockModels/Clock_Model'],
    function (Backbone, $, _, Clock_Model) {

        var SuddenDeath_Clock = Clock_Model.extend({

            //Sudden Death mimics the Clock_Model exactly at this point

            //if Sudden Death, no time is added before or after the turn
        });



        return SuddenDeath_Clock;
    });
