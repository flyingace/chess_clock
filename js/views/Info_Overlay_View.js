define(['backbone', 'jquery', 'underscore', 'text!templates/infoOverlayTemplate.html'],
    function (Backbone, $, _, Info_Overlay_Template) {
        var Info_Overlay_View = Backbone.View.extend({

            el: '#main',

            template: Info_Overlay_Template,

            events: {
                'click .close-button': 'hideOverlay',
                'click #overlay-mask': 'hideOverlay'
            },

            className: 'time-incrementer',

            initialize: function (options) {
                _.bindAll(this, 'render', 'hideOverlay');

                this.model = options.model;

            },

            render: function () {

                $(this.el).prepend(_.template(this.template));

                return this;
            },

            hideOverlay: function () {
                //notify model that overlay is set to hidden
                this.model.set('overlayVisible',false);
            }
        });

        return Info_Overlay_View;

    });
