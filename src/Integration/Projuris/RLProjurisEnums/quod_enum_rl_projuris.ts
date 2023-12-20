/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */

// Define an object for response codes
export const retCod = {
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
export const retMsg = {
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
export const retStatusObj = {
    success: { cod: retCod.success, msg: retMsg.success },
    unknownError: { cod: retCod.unknownError, msg: retMsg.unknownError },
    invalidJsonOrder: { cod: retCod.invalidJsonOrder, msg: retMsg.invalidJsonOrder },
    invalidJsonVendor: { cod: retCod.invalidJsonVendor, msg: retMsg.invalidJsonVendor },
    errorFetchingOrder: { cod: retCod.errorFetchingOrder, msg: retMsg.errorFetchingOrder },
    orderAlreadyExists: { cod: retCod.orderAlreadyExists, msg: retMsg.orderAlreadyExists },
    errorFetchingVendor: { cod: retCod.errorFetchingVendor, msg: retMsg.errorFetchingVendor },
    errorCreatingVendor: { cod: retCod.errorCreatingVendor, msg: retMsg.errorCreatingVendor },
    errorFetchingAccount: { cod: retCod.errorFetchingAccount, msg: retMsg.errorFetchingAccount },
    errorSettingAccount: { cod: retCod.errorSettingAccount, msg: retMsg.errorSettingAccount },
    errorCreatingAccount: { cod: retCod.errorCreatingAccount, msg: retMsg.errorCreatingAccount },
    errorFetchingAccountDetails: { cod: retCod.errorFetchingAccountDetails, msg: retMsg.errorFetchingAccountDetails },
    errorAddingAttachments: { cod: retCod.errorAddingAttachments, msg: retMsg.errorAddingAttachments },
    errorCreatingOrder: { cod: retCod.errorCreatingOrder, msg: retMsg.errorCreatingOrder },
    missingExternalId: { cod: retCod.missingExternalId, msg: retMsg.missingExternalId },
    orderNotFound: { cod: retCod.orderNotFound, msg: retMsg.orderNotFound },
}

// Define an object for NetSuite column names
export const nsColunms = {
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
export const nsRecTypes = {
    acsBankAcc: "customrecord_acs_bankaccount",
    acsBankDet: "customrecord_acs_bankdetails",
};

