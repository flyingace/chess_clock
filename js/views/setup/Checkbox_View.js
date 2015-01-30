define(['backbone', 'jquery', 'underscore'],
    function (Backbone, $, _) {
        var Checkbox_View = Backbone.View.extend({

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
        return Checkbox_View;
    });