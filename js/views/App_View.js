define(['backbone', 'jquery', 'underscore','models/Settings_Model','views/Setup_Panel_View', 'views/Clocks_Panel_View'],
    function (Backbone, $, _, Settings_Model, Setup_Panel_View, Clocks_Panel_View) {

        var App_View = Backbone.View.extend({
            el: '#main',

            initialize: function () {
                CC.eventAgg = _.extend({}, Backbone.Events);
                var settings_model = new Settings_Model();
                this.setup_panel_view = new Setup_Panel_View({model:settings_model});
                this.clocks_panel_view = new Clocks_Panel_View({model:settings_model});
            },

            render: function () {
                this.setup_panel_view.render().el;
                this.clocks_panel_view.render().el;

                return this;
            }
        });
        return App_View;
    });
