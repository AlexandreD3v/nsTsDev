/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.nsRecTypes = exports.nsColunms = exports.retStatusObj = exports.retMsg = exports.retCod = void 0;
    // Define an object for response codes
    exports.retCod = {
        success: 1,
        unknownError: 0,
        invalidJsonOrder: -1,
        invalidJsonVendor: -2,
        errorFetchingOrder: -3,
        orderAlreadyExists: -4,
        errorFetchingVendor: -5,
        errorCreatingVendor: -6,
        errorFetchingAccount: -7,
        errorSettingAccount: -8,
        errorCreatingAccount: -9,
        errorFetchingAccountDetails: -10,
        errorAddingAttachments: -11,
        errorCreatingOrder: -12,
        missingExternalId: -13,
        orderNotFound: -14,
    };
    // Define an object for response messages
    exports.retMsg = {
        success: "Success",
        unknownError: "Unknown error, please contact the Administrator.",
        invalidJsonOrder: "JSON of the purchase order does not meet the requirements, please review it.",
        invalidJsonVendor: "JSON of the vendor does not meet the requirements, please review it.",
        errorFetchingOrder: "Error locating the purchase order.",
        orderAlreadyExists: "The purchase order already exists!",
        errorFetchingVendor: "Error locating the vendor!",
        errorCreatingVendor: "Error creating the vendor.",
        errorFetchingAccount: "Error locating the bank account for the vendor.",
        errorSettingAccount: "Error setting the bank account for the vendor.",
        errorCreatingAccount: "Error creating the bank account.",
        errorFetchingAccountDetails: "Error locating the bank account details for the vendor.",
        errorAddingAttachments: "Error adding attachments.",
        errorCreatingOrder: "Error creating the purchase order.",
        missingExternalId: "GET Error - external ID was not provided.",
        orderNotFound: "GET Error - purchase order not located.",
    };
    // Define an object for response status objects
    exports.retStatusObj = {
        success: { cod: exports.retCod.success, msg: exports.retMsg.success },
        unknownError: { cod: exports.retCod.unknownError, msg: exports.retMsg.unknownError },
        invalidJsonOrder: { cod: exports.retCod.invalidJsonOrder, msg: exports.retMsg.invalidJsonOrder },
        invalidJsonVendor: { cod: exports.retCod.invalidJsonVendor, msg: exports.retMsg.invalidJsonVendor },
        errorFetchingOrder: { cod: exports.retCod.errorFetchingOrder, msg: exports.retMsg.errorFetchingOrder },
        orderAlreadyExists: { cod: exports.retCod.orderAlreadyExists, msg: exports.retMsg.orderAlreadyExists },
        errorFetchingVendor: { cod: exports.retCod.errorFetchingVendor, msg: exports.retMsg.errorFetchingVendor },
        errorCreatingVendor: { cod: exports.retCod.errorCreatingVendor, msg: exports.retMsg.errorCreatingVendor },
        errorFetchingAccount: { cod: exports.retCod.errorFetchingAccount, msg: exports.retMsg.errorFetchingAccount },
        errorSettingAccount: { cod: exports.retCod.errorSettingAccount, msg: exports.retMsg.errorSettingAccount },
        errorCreatingAccount: { cod: exports.retCod.errorCreatingAccount, msg: exports.retMsg.errorCreatingAccount },
        errorFetchingAccountDetails: { cod: exports.retCod.errorFetchingAccountDetails, msg: exports.retMsg.errorFetchingAccountDetails },
        errorAddingAttachments: { cod: exports.retCod.errorAddingAttachments, msg: exports.retMsg.errorAddingAttachments },
        errorCreatingOrder: { cod: exports.retCod.errorCreatingOrder, msg: exports.retMsg.errorCreatingOrder },
        missingExternalId: { cod: exports.retCod.missingExternalId, msg: exports.retMsg.missingExternalId },
        orderNotFound: { cod: exports.retCod.orderNotFound, msg: exports.retMsg.orderNotFound },
    };
    // Define an object for NetSuite column names
    exports.nsColunms = {
        accVendor: "custrecord_acs_ba_vendor_ls",
        accConta: "custrecord_acs_ba_number_ds",
        accAgencia: "custrecord_acs_ba_bankbranch_ds",
        accBanco: "custrecord_acs_ba_bank_ls",
        accBancoDet: "custrecord_acs_bd_bankid_ds",
        accBancoName: "name",
        accFornecedor: "custrecord_acs_ba_vendor_ls",
        accCodigo: "custrecord_acs_ba_bank_ls.custrecord_acs_bd_bankid_ds",
        accDigitoBanco: "custrecord_acs_ba_checkdigibankbranch_ds",
        accDigitoConta: "custrecord_acs_ba_checkdigitnumber_ds"
    };
    // Define an object for NetSuite record types
    exports.nsRecTypes = {
        acsBankAcc: "customrecord_acs_bankaccount",
        acsBankDet: "customrecord_acs_bankdetails",
    };
});
