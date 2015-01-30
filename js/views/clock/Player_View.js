define(['backbone', 'jquery', 'underscore', 'views/clock/Clock_View', 'views/clock/Message_View', 'text!templates/playerViewTemplate.html'],
    function (Backbone, $, _, Clock_View, Message_View, Player_View_Template) {
        var Player_View = Backbone.View.extend({

            events: {
            },

            template: Player_View_Template,

            initialize: function (options) {
                _.bindAll(this, 'cleanClocks');

                this.el = options.el;

                var model_lg = options.model_lg,
                    model_sm = options.model_sm,
                    settings = options.settings;

                this.lg_clock = new Clock_View({el: this.el + ' .clock-lg', model: model_lg, settings: settings});
                this.sm_clock = new Clock_View({el: this.el + ' .clock-sm', model: model_sm});
            },

            render: function () {
                $(this.el).html(_.template(this.template));

                this.lg_clock.render().el;
                this.sm_clock.render().el;

                return this;
            },

            cleanClocks: function() {
                this.stopListening();
                this.lg_clock.remove();
                this.sm_clock.remove();
            }
        });
        return Player_View;
    });