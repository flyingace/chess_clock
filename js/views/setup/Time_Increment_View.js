define(['jquery', 'backbone', 'underscore', 'text!templates/setupTemplates/timeIncrementTemplate.html'],
    function ($, Backbone, _, timeIncrementTemplate) {

        var Time_Increment_View = Backbone.View.extend({

            template: timeIncrementTemplate,

            events: {
                'click .plus': 'onPlusClick',
                'click .minus': 'onMinusClick',
                'blur input[type=number]': 'onFieldValueInput'
            },

            className: 'time-incrementer',

            initialize: function () {
                _.bindAll(this, 'render', 'onPlusClick', 'onMinusClick', 'onFieldValueInput', 'validateFieldValue', 'addLeadingZero');

                //Time Increment View is expecting min, max, value & id to be passed to it.
                this.min = this.options.min;
                this.max = this.options.max;
                this.value = this.options.value;
                this.fieldId = this.options.fieldId;
                this.fieldType = this.fieldId.slice(2, 4); //returns 'HH', 'MM' or 'SS'
            },

            render: function () {

                $(this.el).html(_.template(this.template, {min: this.min, max: this.max, value: this.value, fieldId: this.fieldId}));

                return this;
            },

            onPlusClick: function () {
//                console.log('onPlusClick');
                var $targetField = $('#' + this.fieldId),
                    $pairedFields = $("input[id$=" + this.fieldType + "]"),
                    fieldValue = parseInt($targetField[0].value, 10),
                    fieldsToValidate;

                fieldValue += 1;

                fieldsToValidate = ($('#same-times')[0].checked) ? $pairedFields : $targetField;

                this.validateFieldValue(fieldValue, fieldsToValidate);
            },

            onMinusClick: function () {
//                console.log('onMinusClick');
                var $targetField = $('#' + this.fieldId),
                    $pairedFields = $("input[id$=" + this.fieldType + "]"),
                    fieldValue = parseInt($targetField[0].value, 10),
                    fieldsToValidate;

                fieldValue -= 1;

                fieldsToValidate = ($('#same-times')[0].checked) ? $pairedFields : $targetField;

                this.validateFieldValue(fieldValue, fieldsToValidate);
            },

            onFieldValueInput: function () {
                var $targetField = $('#' + this.fieldId),
                    $pairedFields = $("input[id$=" + this.fieldType + "]"),
                    fieldValue = parseInt($targetField[0].value, 10),
                    fieldsToValidate;

                fieldsToValidate = ($('#same-times')[0].checked) ? $pairedFields : $targetField;

                this.validateFieldValue(fieldValue, fieldsToValidate);
            },

            validateFieldValue: function (fieldValue, fields) {
                var self = this;

                _.each(fields, function (field) {
                    if (fieldValue > self.max) {
                        fieldValue = self.min;
                    } else if (fieldValue < self.min) {
                        fieldValue = self.max;
                    }

                    fieldValue = self.addLeadingZero(fieldValue);
                    field.value = fieldValue;
                });
            },

            addLeadingZero: function (unit) {
                var leadingZero = "0",
                    displayUnit = (unit.toString().length < 2) ? leadingZero.concat(unit.toString()) : unit.toString();

                return displayUnit;
            }
        });

        return Time_Increment_View;

    });

