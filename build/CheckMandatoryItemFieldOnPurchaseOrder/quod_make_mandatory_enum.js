/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.errorHandling = exports.lookUpColumns = exports.ids = exports.itemType = exports.messages = void 0;
    exports.messages = {
        itemHasMandatoryField: "There is a mandatory field in the item!",
        itemHasMandatoryFieldToFill: "There is a mandatory field to fill! \n Field id:",
        missArg: { name: 'MISSING_REQ_ARG', message: "There is a mandatory field to fill! " }
    };
    exports.itemType = {
        sItem: 'serviceitem'
    };
    exports.ids = {
        fieldId: 'fieldId',
        sublistId: 'item',
        mandatoryCostFieldId: 'custcol_your_field_id',
    };
    exports.lookUpColumns = {
        idMandatoryFlagField: 'custitem_your_field_id',
        idNameField: 'displayname',
    };
    exports.errorHandling = {
        fcError: "fieldChanged error",
        srError: "saveRecord error",
        vlError: "validateLine error",
    };
});
