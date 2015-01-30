define(['jquery', 'backbone', 'underscore', 'text!templates/setupTemplates/timeIncrementTemplate.html'],
    function ($, Backbone, _, timeIncrementTemplate) {

        var Time_Increment_View = Backbone.View.extend({

            template: timeIncrementTemplate,

            events: {
                'click .plus': 'onPlusClick',
                'click .minus': 'onMinusClick',
                'focus input[type=number]': 'onNumberFieldFocus',
                'blur input[type=number]': 'onFieldValueInput'
            },

            className: 'time-incrementer',

            initialize: function (options) {
                _.bindAll(this, 'render', 'onPlusClick', 'onMinusClick', 'onNumberFieldFocus', 'onFieldValueInput', 'validateFieldValue', 'addZeroes');

                //Time Increment View is expecting min, max, value & id to be passed to it.
                this.min = options.min;
                this.max = options.max;
                this.value = options.value;
                this.fieldId = options.fieldId;
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

            onNumberFieldFocus: function(evt) {
                evt.target.setSelectionRange(0,2);
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

                    fieldValue = self.addZeroes(fieldValue);
                    field.value = fieldValue;
                });
            },

            addZeroes: function (unit) {
                var leadingZero = "0",
                    displayUnit;

                if (unit.toString() === "NaN" || unit.toString().length === 0) {
                    displayUnit = '00';
                } else if (unit.toString().length < 2) {
                    displayUnit = leadingZero.concat(unit.toString())
                } else {
                    displayUnit = unit.toString();
                }

                return displayUnit;
            }
        });

        return Time_Increment_View;

    });

