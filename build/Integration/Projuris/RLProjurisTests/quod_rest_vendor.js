/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 * @version 2.0
 */
define(["require", "exports", "N/log", "../RLProjurisModules/quod_mod_vendor", "../RLProjurisModules/quod_mod_acs_bankaccount"], function (require, exports, log, vendorModule, accModule) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.post = void 0;
    /**
     * Handles the incoming POST request to create or update a vendor and associated ACS bank account.
     *
     * @param {Object} args - The request payload containing information about the vendor and bank account.
     * @returns {Object} - The response containing the status and IDs of the created or updated vendor and bank account.
     */
    function post(args) {
        try {
            // Log the incoming arguments
            log.error("args", args);
            // Check if the vendor exists based on the provided document (CNPJ or CPF)
            var checkVendor = vendorModule._fetchVendor(args.fornecedor.documento);
            // Extract the bank account details from the payload
            var objAcc = args.fornecedor.contabancaria;
            // Initialize variables to store vendor and bank account IDs
            var vendorId, accId;
            // Check if the vendor already exists
            vendorId = Number(checkVendor) > 0 ? checkVendor : vendorModule.createVendorRecord(args.fornecedor);
            // Check if bank account details are provided
            accId = objAcc ? accModule.fetchAcsBankAccount(objAcc, vendorId) : 0;
            // If the vendor ID is -1 (indicating an error during vendor creation), re-fetch the vendor ID
            vendorId = vendorId == -1 ? vendorModule._fetchVendor(args.fornecedor.documento) : vendorId;
            // If bank account details are provided, either update an existing account or create a new one
            if (objAcc) {
                accId > 0 ? accModule.setBankAccount(accId, +checkVendor) : accModule.createAcsBankAccountRecord(objAcc, vendorId);
            }
            // Check if the vendor already existed and return a response
            if (+checkVendor > 0) {
                return { msg: "The vendor already exists!", id: checkVendor };
            }
            // Log the vendor ID after creation or update
            log.error("checkVendor", checkVendor);
            // Return a response containing the vendor ID
            return { msg: checkVendor };
        }
        catch (error) {
            // Log any errors that occurred during processing
            log.error("Error post", error);
            return error;
        }
    }
    exports.post = post;
});
