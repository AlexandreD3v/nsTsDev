/**
 * @NApiVersion 2.0
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 */

/**
 * Module for creating and fetching Vendor records in NetSuite.
 *
 * @imports {N/record} record - NetSuite record module.
 * @imports {N/log} log - NetSuite log module.
 * @imports {N/search} search - NetSuite search module.
 * @imports {Object} rlEnum - Enumerations from RLProjurisEnums module.
 * @exports {Object} - Functions for creating and fetching Vendor records.
 */
import * as record from "N/record";
import * as log from "N/log";
import * as search from "N/search";
import * as rlEnum from "../RLProjurisEnums/quod_enum_rl_projuris.js";

/**
 * Creates a Vendor record in NetSuite.
 *
 * @param {Object} vendObj - Vendor details object.
 * @returns {number} - The ID of the created Vendor or an error code.
 */
export function createVendorRecord(vendObj: any): any {
    try {
        // Create a dynamic Vendor record.
        var createVendor = record.create({
            type: record.Type.VENDOR,
            isDynamic: true
        }),
            tipoDocumento = "", idVendor;

        // Determine the type of document (CNPJ or CPF) and set the appropriate fields.
        if (String(vendObj.documento).length > 14) {
            tipoDocumento = "custentity_psg_br_cnpj";
            createVendor.setValue("companyname", vendObj.nomeempresa);
        } else {
            var splitName = String(vendObj.nomepessoa ? vendObj.nomepessoa : vendObj.nomeempresa).split(" "),
                lastname = splitName.length > 3 ? String(splitName.slice(2, splitName.length)).replace(",", " ") : String(splitName[2]);

            tipoDocumento = "custentity_psg_br_cpf";
            createVendor.setValue({ fieldId: "companyname", value: String(vendObj.nomeempresa) });

            if (splitName.length > 2) {
                createVendor.setValue({ fieldId: "firstname", value: String(splitName[0]) })
                    .setValue({ fieldId: "middlename", value: String(splitName[1]) })
                    .setValue({ fieldId: "lastname", value: lastname });
            } else {
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
    } catch (error) {
        // Log error details in case of an exception.
        log.error("Erro ao tentar criar o fornecedor", error);
        return rlEnum.retStatusObj.errorCreatingVendor.cod;
    }
}

/**
 * Fetches the Vendor ID based on the provided document (CNPJ or CPF).
 *
 * @param {string} documento - The document (CNPJ or CPF) of the Vendor.
 * @returns {number} - The ID of the fetched Vendor or an error code.
 */
export function _fetchVendor(documento: string): number {
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
    } catch (error) {
        // Log error details in case of an exception.
        log.error({ details: error, title: "Erro _fetchVendor" });
        return rlEnum.retStatusObj.errorFetchingVendor.cod;
    }
}

/**
 * Checks the type of document (CNPJ or CPF) and returns the corresponding field ID.
 *
 * @param {string} documento - The document (CNPJ or CPF) of the Vendor.
 * @returns {string} - The field ID for the document.
 */
export function checkIdFieldDocumento(documento: string): string {
    return String(documento).length > 14 ? "custentity_psg_br_cnpj" : "custentity_psg_br_cpf";
}

