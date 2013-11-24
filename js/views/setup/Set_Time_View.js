define(['backbone', 'jquery', 'underscore'],
    function (Backbone, $, _) {
        var Set_Time_View = Backbone.View.extend({

            events: {
            },

            el: '.elementClassName#orId',

            //            tagName: 'elementType',
            //            className: 'class-name',

            initialize: function () {
                _.bindAll(this)
            },

            render: function () {
                return this;
            }
        });
        return Set_Time_View;
    });