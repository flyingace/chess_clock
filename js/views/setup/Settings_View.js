define(['backbone', 'jquery', 'underscore','text!templates/setupTemplates/settingsTemplate.html'],
    function (Backbone, $, _, Settings_Template) {
        var Settings_View = Backbone.View.extend({

            events: {
            },

            initialize: function () {
                _.bindAll(this)
            },

            render: function () {
                $(this.el).html(_.template(Settings_Template));
                return this;
            }
        });
        return Settings_View;
    });