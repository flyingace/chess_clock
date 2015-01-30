define(['backbone', 'jquery', 'underscore'],
    function (Backbone, $, _) {
        var Audio_Settings_View = Backbone.View.extend({

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
        return Audio_Settings_View;
    });