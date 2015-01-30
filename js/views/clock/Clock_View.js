define(['backbone', 'jquery', 'underscore'],
    function (Backbone, $, _) {
        var Clock_View = Backbone.View.extend({

            events: {
            },

            initialize: function (options) {
                _.bindAll(this, 'updateTime', 'onTimeUp');

                this.el = options.el;
                this.model = options.model;
                this.settings = options.settings;

                this.listenTo(this.model, 'change:remainingTime', this.updateTime);
                this.listenTo(this.model, 'change:timeIsUp', this.onTimeUp);
            },

            render: function () {
                this.updateTime();

                return this;
            },

            updateTime: function () {
                var HHMMSS = this.model.get('remainingTime');
//                console.log(HHMMSS);

                $(this.el).html(HHMMSS);
            },

            onTimeUp: function () {
                if (this.model.get('timeIsUp')) {
                    $(this.el).addClass('inOvertime');
                }
            }

        });
        return Clock_View;
    });