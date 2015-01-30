define(['backbone', 'jquery', 'underscore', 'text!templates/setupTemplates/setButtonsTemplate.html'],
    function (Backbone, $, _, Set_Buttons_Template) {
        var Set_Buttons_View = Backbone.View.extend({

            events: {
            },

            initialize: function (options) {
                _.bindAll(this);

                this.model = options.model;
            },

            render: function () {
                $(this.el).html(_.template(Set_Buttons_Template));

                return this;
            },
        });
        return Set_Buttons_View;
    });