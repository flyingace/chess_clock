define(['backbone', 'jquery', 'underscore', 'models/clockModels/Clock_Model'],
    function (Backbone, $, _, Clock_Model) {
        var Clocks_Collection = Backbone.Collection.extend({

            model: Clock_Model,

            initialize: function () {
            }
        });

        return Clocks_Collection;
    });
