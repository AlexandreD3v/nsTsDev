/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */

export const messages = {
    itemHasMandatoryField : "There is a mandatory field in the item!",
    itemHasMandatoryFieldToFill : "There is a mandatory field to fill! \n Field id:",
    missArg : {name: 'MISSING_REQ_ARG', message:"There is a mandatory field to fill! "}
}

export const itemType = {
    sItem : 'serviceitem'
}
export const ids = {
    fieldId : 'fieldId',
    sublistId : 'item',
    mandatoryCostFieldId : 'custcol_your_field_id',
}
export const lookUpColumns = {
    idMandatoryFlagField : 'custitem_your_field_id',
    idNameField : 'displayname',
}
export const errorHandling = {
    fcError : "fieldChanged error",
    srError : "saveRecord error",
    vlError : "validateLine error",
}