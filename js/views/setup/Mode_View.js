define(['backbone', 'jquery', 'underscore', 'text!templates/setupTemplates/modeTemplate.html'],
    function (Backbone, $, _, Mode_Template) {
        var Mode_View = Backbone.View.extend({

            events: {
                'change #mode-menu': 'onModeMenuChange',
                'change #delay-menu': 'onDelayMenuChange'

            },

            initialize: function (options) {
                _.bindAll(this, 'onModeMenuChange');

                this.model = options.model;
            },

            render: function () {
                $(this.el).html(_.template(Mode_Template));

                return this;
            },

            onModeMenuChange: function (event) {
                var menuValue = event.target.value,
                    $delayMenu = $('#delay-menu-wrapper');

                switch (menuValue) {
                    case "Bronstein":
                    case "Fischer":
                    case "Simple_Delay":
                        $delayMenu.removeClass('hidden');
                        break;
                    case "Sudden_Death":
                    case "Word_Game":
                        $delayMenu.addClass('hidden');
                        break;
                    default:
                        $delayMenu.addClass('hidden');
                        break;
                }
            }
        });
        return Mode_View;
    });