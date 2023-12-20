/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 * @NScriptType ClientScript
 * @Author: Alexandre J. C. - 09/12/22
 */

import { EntryPoints } from "N/types";
import * as log from "N/log";
import * as search from "N/search";
import * as error from "N/error";
import * as mmEnum from "./quod_make_mandatory_enum";

let hasNotSaved = false, fieldName = "", mandatoryCostFieldItsNotEmpty;

/**
 * Function that runs when a field is changed
 * @param context - function script context
 * @returns if the process it's not needed to flag a mandatory item field
 */
export function fieldChanged(context: EntryPoints.Client.fieldChangedContext): void {
    try {
        //Check if is a line item field that's been changed, if not, it return to break the process
        if (context.fieldId != mmEnum.ids.fieldId) return;

        let lineItemId = Number(context.currentRecord.getCurrentSublistValue({ sublistId: mmEnum.ids.sublistId, fieldId: mmEnum.ids.fieldId }));

        //If the id isn't on the sublist, return to break the process
        if (Number(lineItemId) <= 0) return;

        //Get the parameter in the service item to check if should enable the requirement for the mandatory field
        let itemIsMandatory = search.lookupFields({ type: mmEnum.itemType.sItem, columns: mmEnum.lookUpColumns.idMandatoryFlagField, id: lineItemId }),

            //Loads the item name
            itemName: any = search.lookupFields({ type: mmEnum.itemType.sItem, columns: mmEnum.lookUpColumns.idNameField, id: lineItemId });

        //If isn't mandatory, it allows to set the item in the line
        if (itemIsMandatory.custitem_quod_make_mandatory != true) return;

        //Otherwise, will show up the message
        alert(mmEnum.messages.itemHasMandatoryField);

        //Set a flag isn the script to block the save record function
        hasNotSaved = true;

        //Save the item name to show in the save record alert
        itemName = String(itemName.displayname);

    } catch (error) {//Error handling
        log.error(mmEnum.errorHandling.fcError, error);
        throw error;
    }
}

/**
 * saveRecord function that check the mandatory field in the item when it's added directly 
 * @param context - function script context
 */
export function saveRecord(context: EntryPoints.Client.saveRecordContext) {
    try {
        //Check if the mandatory cost field is not empty
        mandatoryCostFieldItsNotEmpty = context.currentRecord.getCurrentSublistValue({ fieldId: mmEnum.ids.mandatoryCostFieldId, sublistId: mmEnum.ids.sublistId });

        //If there isn't not saved itens and the itens have they mandatory cost item fullfiled, it allow to save the record
        if (!hasNotSaved || mandatoryCostFieldItsNotEmpty) return true;

        //Show an alert with the item name and stop the execution of the script case there is a unsaved item or a empty cost field
        throw error.create({
            name: mmEnum.messages.missArg.name,
            message: mmEnum.messages.missArg.message + fieldName + "!"
        });
    } catch (error) {
        log.error(mmEnum.errorHandling.srError, error);
        throw error;
    }
}

/**
 * Checks the existence of empty mandatory fields in a item to be added in the item sublist
 * @param context - function script context
 * @returns true|false to allow or block an item to be added in the purchase order
 */
export function validateLine(context: EntryPoints.Client.validateLineContext) {
    try {
        //Check if the mandatory cost field is not empty
        mandatoryCostFieldItsNotEmpty = context.currentRecord.getCurrentSublistValue({ fieldId: mmEnum.ids.mandatoryCostFieldId, sublistId: mmEnum.ids.fieldId });

        //If didn't exists a unsaved item or if it exists but with their mandatory cost field filled
        //restarts the logic and allow to save the item
        if (!hasNotSaved || hasNotSaved && mandatoryCostFieldItsNotEmpty) {
            //Reinicia as variáveis auxíliares
            hasNotSaved = false;
            fieldName = "";

            return true;
        }

        //Otherwise, show the alert message and block the item to be saved
        alert(mmEnum.messages.itemHasMandatoryFieldToFill + fieldName);

        return false;

    } catch (error) {//Error handling
        log.error(mmEnum.errorHandling.vlError, error);
        throw error;
    }
}