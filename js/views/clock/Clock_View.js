define(['backbone', 'jquery', 'underscore'],
    function (Backbone, $, _) {
        var Clock_View = Backbone.View.extend({

            events: {
            },

            initialize: function () {
                _.bindAll(this, 'updateTime');

                this.el = this.options.el;
                this.model = this.options.model;
                this.settings = this.options.settings;

                this.model.on('change:remainingTime', this.updateTime);
                this.model.on('change:timeIsUp', this.onTimeUp);
            },

            render: function () {
                this.updateTime();

                return this;
            },

            updateTime: function () {
                var HHMMSS = this.model.get('remainingTime');
                console.log(HHMMSS);

                $(this.el).html(HHMMSS);
            }
        });
        return Clock_View;
    });