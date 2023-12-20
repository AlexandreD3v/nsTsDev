/**
 * @NApiVersion 2.0
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 */
define(["require", "exports", "N/record", "N/log", "N/search", "../RLProjurisEnums/quod_enum_rl_projuris.js"], function (require, exports, record, log, search, rlEnum) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkIdFieldDocumento = exports._fetchVendor = exports.createVendorRecord = void 0;
    /**
     * Creates a Vendor record in NetSuite.
     *
     * @param {Object} vendObj - Vendor details object.
     * @returns {number} - The ID of the created Vendor or an error code.
     */
    function createVendorRecord(vendObj) {
        try {
            // Create a dynamic Vendor record.
            var createVendor = record.create({
                type: record.Type.VENDOR,
                isDynamic: true
            }), tipoDocumento = "", idVendor;
            // Determine the type of document (CNPJ or CPF) and set the appropriate fields.
            if (String(vendObj.documento).length > 14) {
                tipoDocumento = "custentity_psg_br_cnpj";
                createVendor.setValue("companyname", vendObj.nomeempresa);
            }
            else {
                var splitName = String(vendObj.nomepessoa ? vendObj.nomepessoa : vendObj.nomeempresa).split(" "), lastname = splitName.length > 3 ? String(splitName.slice(2, splitName.length)).replace(",", " ") : String(splitName[2]);
                tipoDocumento = "custentity_psg_br_cpf";
                createVendor.setValue({ fieldId: "companyname", value: String(vendObj.nomeempresa) });
                if (splitName.length > 2) {
                    createVendor.setValue({ fieldId: "firstname", value: String(splitName[0]) })
                        .setValue({ fieldId: "middlename", value: String(splitName[1]) })
                        .setValue({ fieldId: "lastname", value: lastname });
                }
                else {
                    createVendor.setValue("firstname", splitName[0])
                        .setValue("lastname", splitName[1]);
                }
            }
            // Set common fields for both CNPJ and CPF depending if is it a person or not.
            createVendor.setValue(tipoDocumento, vendObj.documento)
                .setValue("isperson", tipoDocumento == "custentity_psg_br_cnpj" ? "F" : "T")
                .setValue("subsidiary", vendObj.subsidiariaprincipal);
            // Save the Vendor record.
            idVendor = createVendor.save();
            // Return the ID if successful, otherwise return an error code.
            return idVendor > 0 ? idVendor : rlEnum.retStatusObj.errorCreatingVendor;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error("Erro ao tentar criar o fornecedor", error);
            return rlEnum.retStatusObj.errorCreatingVendor.cod;
        }
    }
    exports.createVendorRecord = createVendorRecord;
    /**
     * Fetches the Vendor ID based on the provided document (CNPJ or CPF).
     *
     * @param {string} documento - The document (CNPJ or CPF) of the Vendor.
     * @returns {number} - The ID of the fetched Vendor or an error code.
     */
    function _fetchVendor(documento) {
        try {
            // Determine the type of document (CNPJ or CPF).
            var tipoDocumento = checkIdFieldDocumento(documento);
            // Create a search object for Vendors based on the document.
            var srcVendor = search.create({
                type: "vendor",
                filters: [
                    [tipoDocumento, "contains", documento]
                ]
            });
            // Get the count of search results.
            var searchResultCount = srcVendor.runPaged().count;
            // Return 0 if no results are found.
            return searchResultCount > 0 ? +srcVendor.run().getRange({ start: 0, end: searchResultCount })[0].id : 0;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error({ details: error, title: "Erro _fetchVendor" });
            return rlEnum.retStatusObj.errorFetchingVendor.cod;
        }
    }
    exports._fetchVendor = _fetchVendor;
    /**
     * Checks the type of document (CNPJ or CPF) and returns the corresponding field ID.
     *
     * @param {string} documento - The document (CNPJ or CPF) of the Vendor.
     * @returns {string} - The field ID for the document.
     */
    function checkIdFieldDocumento(documento) {
        return String(documento).length > 14 ? "custentity_psg_br_cnpj" : "custentity_psg_br_cpf";
    }
    exports.checkIdFieldDocumento = checkIdFieldDocumento;
});
