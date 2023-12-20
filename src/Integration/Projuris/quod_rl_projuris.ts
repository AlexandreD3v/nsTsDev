/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 * @version 2.0
 */

/**
 * Restlet module for handling Purchase Orders, Vendors, and Bank Accounts in NetSuite.
 *
 * @imports {Object} vendorModule - Module for Vendor operations.
 * @imports {Object} poModule - Module for Purchase Order operations.
 * @imports {Object} accModule - Module for Bank Account operations.
 * @imports {N/log} log - NetSuite log module.
 * @imports {Object} utils - Utilities from RLProjurisUtils module.
 * @imports {Object} rlEnum - Enumerations from RLProjurisEnums module.
 * @exports {Object} - Functions for handling Purchase Orders, Vendors, and Bank Accounts.
 */
import * as vendorModule from "./RLProjurisModules/quod_mod_vendor.js";
import * as poModule from "./RLProjurisModules/quod_mod_purchaseorder.js";
import * as accModule from "./RLProjurisModules/quod_mod_acs_bankaccount.js";
import * as log from "N/log";
import * as utils from "./RLProjurisUtils/quod_rl_projuris_utils.js";
import * as rlEnum from "./RLProjurisEnums/quod_enum_rl_projuris.js";
var objRespRestlet = {};

/**
 * Handles GET requests for retrieving Purchase Order details.
 *
 * @param {Object} context - The context object containing request parameters.
 * @returns {Object} - The response object with Purchase Order details.
 */
export function get(context: any): object {
    var searchRes;
    try {
        if (!context.externalid) return { erro: rlEnum.retStatusObj.missingExternalId }; // Check if external ID is provided as a parameter

        // Fetch Purchase Order details based on external ID.
        searchRes = poModule._fetchPoGet(context.externalid);
        log.audit("Retorno searchRes", searchRes);

        if (+searchRes.internalid[0].value > 0) { // If found, fetch status and return success
            objRespRestlet = {
                status: "Success",
                statusPedido: searchRes.approvalstatus.value = 0 ? 0 : searchRes.approvalstatus[0].text,
                statusPedidoId: searchRes.approvalstatus[0].value,
                codigo: 1,
                message: "Purchase Order located successfully",
                internalid: searchRes.internalid[0].value,
                externalid: context.externalid,
                numPedido: searchRes.tranid
            };
            log.audit("objRespRestlet", objRespRestlet);

            return objRespRestlet;
        } else { // If not found, return error status
            objRespRestlet = {
                status: "Error",
                statusPedido: "Not found",
                codigo: 4,
                message: "Purchase Order not located",
                externalid: context.externalid
            };
            return objRespRestlet;
        }
    } catch (e: any) { // Exception handling
        objRespRestlet = {
            status: "Error",
            codigo: 3,
            message: searchRes ? searchRes.msg : "" + e.message,
            externalid: context.externalid
        };
        log.error("Error in get", e);
        return objRespRestlet;
    }
}

/**
 * Handles POST requests for creating Vendors and Purchase Orders.
 *
 * @param {Object} receivedPo - The received Purchase Order details.
 * @returns {Object} - The response object with creation status.
 */
export function post(receivedPo: any): object {
    try {
        log.audit("Received Purchase Order:", receivedPo);

        // Validate the received JSON structure.
        if (!receivedPo.pedidoDeCompra || utils.validaArray(receivedPo.pedidoDeCompra))
            return { pedido: receivedPo.pedidoDeCompra, erro: rlEnum.retStatusObj.invalidJsonOrder };

        // Check if Vendor information is provided.
        if (!receivedPo.pedidoDeCompra.fornecedor)
            return { pedido: receivedPo, vendor: receivedPo.pedidoDeCompra.fornecedor, erro: rlEnum.retStatusObj.invalidJsonVendor };

        // Check if the Purchase Order already exists.
        var checkPo: any = poModule._fetchPo(receivedPo.pedidoDeCompra.externalid);
        log.audit("Verification - Purchase Order", checkPo);

        if (checkPo < 0 || Number(checkPo.cod) < 0)
            return { msg: rlEnum.retStatusObj.errorFetchingOrder, externalId: receivedPo.pedidoDeCompra.externalid };

        if (checkPo > 0)
            return { msg: rlEnum.retStatusObj.orderAlreadyExists, externalId: receivedPo.pedidoDeCompra.externalid, internalid: checkPo };

        // Fetch or create the Vendor based on provided information.
        var fetchVendorId = Number(vendorModule._fetchVendor(receivedPo.pedidoDeCompra.fornecedor.documento));
        if (fetchVendorId < -1)
            return { msg: rlEnum.retStatusObj.errorFetchingVendor, obj: fetchVendorId, externalId: receivedPo.pedidoDeCompra.externalid };

        var vendorId = fetchVendorId > 0 ? fetchVendorId : vendorModule.createVendorRecord(receivedPo.pedidoDeCompra.fornecedor);
        if (vendorId < -1 || Number(vendorId.cod) < -1)
            return { msg: rlEnum.retStatusObj.errorCreatingAccount, obj: fetchVendorId, externalId: receivedPo.pedidoDeCompra.externalid };

        // If bank account information is provided, fetch or create the bank account.
        if (receivedPo.pedidoDeCompra.fornecedor.contabancaria != null) {
            var accRetObj: any = accModule.fetchAcsBankAccount(receivedPo.pedidoDeCompra.fornecedor.contabancaria, vendorId);
            if (Number(accRetObj) <= 0)
                return { msg: rlEnum.retStatusObj.errorFetchingAccount, obj: accRetObj, externalId: receivedPo.pedidoDeCompra.externalid };

            log.audit("Bank account located", accRetObj);

            var vendorIsZero = Number(accRetObj.idVendor) == 0;
            var vandorIsEquals = Number(accRetObj.idVendor == vendorId);

            // Check and set the bank account.
            var checkAcc: any = accRetObj.id > 0 && (vendorIsZero || vandorIsEquals) ? accModule.setBankAccount(accRetObj, vendorId)
                : accModule.createAcsBankAccountRecord(receivedPo.pedidoDeCompra.fornecedor.contabancaria, vendorId, accRetObj);

            if (checkAcc < 0 || Number(checkAcc.cod < 0))
                return { msg: rlEnum.retStatusObj.errorSettingAccount, obj: checkAcc, externalId: receivedPo.pedidoDeCompra.externalid };
        }

        // Create the Purchase Order.
        return poModule.createPoRecord(receivedPo.pedidoDeCompra, vendorId);
    } catch (error) {
        // Handle errors and return an error message.
        return utils.errorMessage(objRespRestlet, 3, error);
    }
}

