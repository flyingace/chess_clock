define(['backbone', 'jquery', 'underscore','fastclick','models/Settings_Model','views/Info_Overlay_View','views/Setup_Panel_View', 'views/Clocks_Panel_View'],
    function (Backbone, $, _, FastClick, Settings_Model, Info_Overlay_View, Setup_Panel_View, Clocks_Panel_View) {

        var App_View = Backbone.View.extend({
            el: '#main',

            initialize: function () {
                //create an even aggregator as a property of the global CC
                CC.eventAgg = _.extend({}, Backbone.Events);

                //attach FastClick to the document's body so touch events will lose their 300ms delay
                FastClick.attach(document.body);

                //set central model and two main views
                var settings_model = new Settings_Model();
                this.info_overlay_view  = new Info_Overlay_View({model:settings_model});
                this.setup_panel_view = new Setup_Panel_View({model:settings_model});
                this.clocks_panel_view = new Clocks_Panel_View({model:settings_model});
            },

            render: function () {
                this.info_overlay_view.render().el;
                this.setup_panel_view.render().el;
                this.clocks_panel_view.render().el;

                return this;
            }
        });
        return App_View;
    });
