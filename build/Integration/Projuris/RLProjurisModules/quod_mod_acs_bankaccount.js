/**
 * @NApiVersion 2.0
 * Autor : Alexandre J. Corrêa <alexandre.j.correa@hotmail.com>
 * @since 13/07/2022
 * @version 2.0
 */
define(["require", "exports", "N/record", "N/log", "N/search", "../RLProjurisEnums/quod_enum_rl_projuris"], function (require, exports, record, log, search, rlEnum) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.setBankAccount = exports.fetchAcsBankAccount = exports.createAcsBankAccountRecord = void 0;
    /**
     * Creates a record for ACS Bank Account.
     *
     * @param {Object} acc - The account details object.
     * @param {number} vendorId - The vendor ID.
     * @param {Object} accRet - The account return details object.
     * @returns {number} - The ID of the created ACS Bank Account or an error code.
     */
    function createAcsBankAccountRecord(acc, vendorId, accRet) {
        var ret;
        try {
            // Log the account details for debugging purposes.
            log.error({ title: "acc", details: acc });
            // Create a dynamic record for ACS Bank Account.
            var createAcsBankAccount = record.create({
                type: rlEnum.nsRecTypes.acsBankAcc,
                isDynamic: true,
            }), idAcsBankAccount = 0;
            // Set account values for the created ACS Bank Account record.
            createAcsBankAccount
                .setValue(rlEnum.nsColunms.accConta, "" + acc.account)
                .setValue(rlEnum.nsColunms.accDigitoConta, "" + acc.accountDigit)
                .setValue(rlEnum.nsColunms.accAgencia, "" + acc.agency);
            // Set bank value based on conditions.
            if (Number(accRet.idDet) > 0) {
                createAcsBankAccount.setValue(rlEnum.nsColunms.accBanco, accRet.idDet);
            }
            else {
                var idDetalhe = fetchAcsBankDetId(String(acc.code));
                log.error('iddetalhe', idDetalhe);
                createAcsBankAccount.setValue(rlEnum.nsColunms.accBanco, "" + idDetalhe);
            }
            // If the bank exists, set the name in the record to be saved.
            if (isNaN(acc.bank))
                createAcsBankAccount.setValue(rlEnum.nsColunms.accBancoName, "" + acc.bank);
            // If the bank digit exists, set the bank digit in the record to be saved.
            if (+rlEnum.nsColunms.accDigitoBanco > 0)
                createAcsBankAccount.setValue(rlEnum.nsColunms.accDigitoBanco, "" + acc.accountDigit);
            // If the vendor digit exists, set the vendor in the record to be saved.
            if (vendorId > 0)
                createAcsBankAccount.setValue(rlEnum.nsColunms.accFornecedor, "" + vendorId);
            // Log the created ACS Bank Account before saving.
            log.audit("createAcsBankAccount before save", createAcsBankAccount);
            // Save the created ACS Bank Account and get its ID.
            idAcsBankAccount = createAcsBankAccount.save({ ignoreMandatoryFields: true });
            // Log success message.
            log.audit("BANK CREATED SUCCESSFULLY", idAcsBankAccount);
            // Set the return value based on the created ID or an error code.
            ret = idAcsBankAccount > 0 ? idAcsBankAccount : rlEnum.retStatusObj.errorCreatingAccount.cod;
            // Return the result.
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error(rlEnum.retStatusObj.errorCreatingAccount.msg, error);
            ret = rlEnum.retStatusObj.errorCreatingAccount.cod;
            return ret;
        }
    }
    exports.createAcsBankAccountRecord = createAcsBankAccountRecord;
    /**
     * Fetches ACS Bank Account information based on provided parameters.
     *
     * @param {Object} objAcsBankAccount - The ACS Bank Account details object.
     * @param {number} vendId - The vendor ID.
     * @returns {Object} - An object containing the ACS Bank Account ID and vendor ID, or an error code.
     */
    function fetchAcsBankAccount(objAcsBankAccount, vendId) {
        var ret;
        try {
            // Define filter criteria for searching ACS Bank Account records.
            var filtro = [
                [rlEnum.nsColunms.accVendor, "ANYOF", "@NONE@", "" + vendId],
                "AND",
                [rlEnum.nsColunms.accAgencia, "STARTSWITH", "" + objAcsBankAccount.agency],
                "AND",
                [rlEnum.nsColunms.accConta, "STARTSWITH", "" + objAcsBankAccount.account],
                "AND",
                [rlEnum.nsColunms.accDigitoConta, "STARTSWITH", objAcsBankAccount.accountDigit],
                "AND",
                [rlEnum.nsColunms.accCodigo, "STARTSWITH", objAcsBankAccount.code],
                "AND",
                buildFilterDigitoBanco(String(objAcsBankAccount.accountDigit))
            ], accId = { id: 0, idVendor: 0 };
            // Log the filter criteria for debugging purposes.
            log.audit("filtro", filtro);
            // Search for ACS Bank Account records based on the defined filter.
            search.create({
                type: rlEnum.nsRecTypes.acsBankAcc,
                filters: filtro,
                columns: [
                    rlEnum.nsColunms.accFornecedor,
                    { name: "internalid", join: "CUSTRECORD_ACS_BA_BANK_LS" }
                ]
            }).run().each(function (acc) {
                // Retrieve and store the ACS Bank Account ID and vendor ID.
                accId.id = +acc.id;
                accId.idVendor = Number(acc.getValue({ name: rlEnum.nsColunms.accFornecedor }));
                return true;
            });
            // Set the return value with the ACS Bank Account ID and vendor ID.
            ret = accId;
            // Return the result.
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error({ details: error, title: "Error in fetchAcsBankAccount" });
            ret = rlEnum.retStatusObj.errorFetchingAccount.cod;
            return ret;
        }
    }
    exports.fetchAcsBankAccount = fetchAcsBankAccount;
    /**
     * Fetches ACS Bank Detail ID based on the provided code.
     *
     * @param {string} cod - The code used to search for ACS Bank Details.
     * @returns {number} - The ACS Bank Detail ID or an error code.
     */
    function fetchAcsBankDetId(cod) {
        var ret;
        try {
            // Define filter criteria for searching ACS Bank Detail records.
            var filter = [
                [rlEnum.nsColunms.accBancoDet, "STARTSWITH", "" + cod]
            ];
            // Create a search object for ACS Bank Detail records.
            var srcDetBank = search.create({
                type: rlEnum.nsRecTypes.acsBankDet,
                filters: filter
            });
            // Get the count of search results.
            var searchResultCount = srcDetBank.runPaged().count;
            // Retrieve ACS Bank Detail ID if results are found.
            ret = searchResultCount > 0 ? +srcDetBank.run().getRange({ start: 0, end: searchResultCount })[0].id : 0;
            // Return the result.
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error({ details: error, title: "Error in fetchAcsBankDetId" });
            ret = rlEnum.retStatusObj.errorFetchingAccount.cod;
            return ret;
        }
    }
    /**
     * Sets the vendor ID for a given bank account if conditions are met.
     *
     * @param {Object} accountRet - The bank account return details object.
     * @param {number} idVendor - The vendor ID to set for the bank account.
     * @returns {number} - The ID of the updated bank account or an error code.
     */
    function setBankAccount(accountRet, idVendor) {
        var ret;
        try {
            // Check if the vendor ID in the accountRet matches the provided idVendor or if it's already set.
            if (accountRet.idVendor == idVendor || accountRet.idVendor > 0) {
                return 0; // Return 0 and doesn't update the vendor record
            }
            // Load the bank account record using its ID.
            var accRec = record.load({
                id: accountRet.id,
                type: rlEnum.nsRecTypes.acsBankAcc,
            });
            // Set the vendor ID for the bank account.
            accRec.setValue({
                fieldId: rlEnum.nsColunms.accFornecedor,
                value: idVendor
            });
            // Save the updated bank account and get the ID.
            var idRet = accRec.save({ ignoreMandatoryFields: true });
            // Set the return value based on the saved ID or an error code.
            ret = idRet > 0 ? idRet : rlEnum.retStatusObj.errorSettingAccount.cod;
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error(rlEnum.retStatusObj.errorSettingAccount.msg, error);
            // Set the return value to the error code.
            ret = rlEnum.retStatusObj.errorSettingAccount.cod;
            return ret;
        }
    }
    exports.setBankAccount = setBankAccount;
    /**
     * Builds a search filter for ACS Bank Account based on the provided digit for the bank.
     *
     * @param {string} bankDigit - The digit for the bank.
     * @returns {Array} - An array representing the search filter for ACS Bank Account.
     */
    function buildFilterDigitoBanco(bankDigit) {
        var ret;
        try {
            // Check if the provided digit for the bank is greater than 0.
            ret = Number(bankDigit) > 0 ?
                [rlEnum.nsColunms.accDigitoBanco, "STARTSWITH", bankDigit] :
                [rlEnum.nsColunms.accDigitoBanco, "ISEMPTY", ""];
            // Return the search filter array.
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error(rlEnum.retStatusObj.errorSettingAccount.msg, error);
            // Set the return value to the error code.
            ret = rlEnum.retStatusObj.errorSettingAccount.cod;
            return ret;
        }
    }
});
