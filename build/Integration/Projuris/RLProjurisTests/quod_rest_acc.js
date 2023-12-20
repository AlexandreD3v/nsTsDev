/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 * @version 2.0
 */
define(["require", "exports", "N/log", "../RLProjurisModules/quod_mod_acs_bankaccount"], function (require, exports, log, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.post = void 0;
    /**
     * Handles the incoming POST request to create or update an ACS bank account.
     *
     * @param {Object} args - The request payload containing information about the bank account.
     * @returns {Object} - The response containing the status and IDs of the created or updated bank account.
     */
    function post(args) {
        try {
            log.error("args", args.acc);
            // Check if essential information is provided
            if (!args.acc.agencia || !args.acc.banco || !args.acc.conta) {
                return { msg: "Error - missing information" };
            }
            // Create an object with bank account details
            var accObj = {
                agencia: args.acc.agencia,
                banco: args.acc.banco,
                digitoBanco: "",
                conta: args.acc.conta,
                digitoConta: args.acc.digitoConta,
                codigo: args.acc.codigo,
            };
            // Fetch ACS bank account details
            var idAcc = acc.fetchAcsBankAccount(accObj, 0);
            // Check if the bank account details were successfully fetched
            if (Number(idAcc) <= 0) {
                return { msg: "Error locating bank account", idAcc: idAcc };
            }
            // Determine whether to update an existing bank account or create a new one
            var idAccN = idAcc.id > 0 ? acc.setBankAccount(idAcc, your_id) : +acc.createAcsBankAccountRecord(accObj, 0, idAcc);
            // Log the details of the created or updated bank account
            log.error("id conta", idAcc);
            log.error("id contaN", idAccN);
            // Return the response with the details of the created or updated bank account
            return { idAcc: idAcc, idAccN: idAccN };
        }
        catch (error) {
            // Log any errors that occurred during processing
            log.error("Error post", error);
            return error;
        }
    }
    exports.post = post;
});
