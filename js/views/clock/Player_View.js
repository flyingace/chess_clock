define(['backbone', 'jquery', 'underscore', 'views/clock/Clock_View', 'views/clock/Message_View', 'text!templates/playerViewTemplate.html'],
    function (Backbone, $, _, Clock_View, Message_View, Player_View_Template) {
        var Player_View = Backbone.View.extend({

            events: {
            },

            template: Player_View_Template,

            initialize: function () {
                _.bindAll(this);

                this.el = this.options.el;

                var model_lg = this.options.model_lg,
                    model_sm = this.options.model_sm,
                    settings = this.options.settings;

                this.lg_clock = new Clock_View({el: this.el + ' .clock-lg', model: model_lg, settings: settings});
                this.sm_clock = new Clock_View({el: this.el + ' .clock-sm', model: model_sm});
            },

            render: function () {
                $(this.el).html(_.template(this.template));

                this.lg_clock.render().el;
                this.sm_clock.render().el;

                return this;
            }
        });
        return Player_View;
    });