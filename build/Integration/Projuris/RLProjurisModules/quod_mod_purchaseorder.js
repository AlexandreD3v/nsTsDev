/**
 * @NApiVersion 2.1
 * @author Rafael Oliveira <rafael.oliveira@quod.com.br>
 * @since 19/05/2021
 * @version 1.0
 * Review - Alexandre J. Corrêa <alexandre.correa@quod.com.br>
 * @since 13/07/2022
 * @version 2.0
 */
define(["require", "exports", "N/record", "N/log", "N/search", "N/runtime", "../RLProjurisUtils/quod_rl_projuris_utils", "../RLProjurisEnums/quod_enum_rl_projuris"], function (require, exports, record, log, search, runtime, utils, rlEnum) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._fetchPoGet = exports._fetchPo = exports.getNumPedido = exports.createPoRecord = void 0;
    /**
     * Creates a Purchase Order record in NetSuite.
     *
     * @param {Object} poObj - Purchase Order details object.
     * @param {number} idVendor - Vendor ID for the Purchase Order.
     * @returns {Object} - Status and details of the created Purchase Order.
     */
    function createPoRecord(poObj, idVendor) {
        var ret = {};
        try {
            // Create a dynamic Purchase Order record.
            var createPurchaseOrder = record.create({
                type: record.Type.PURCHASE_ORDER,
                isDynamic: true,
            }), formattedDueDate = utils.formatDate(poObj.dueDate), idPurchaseOrder = 0;
            // Set values for the Purchase Order record.
            createPurchaseOrder.setValue("customform", runtime.getCurrentScript().getParameter({ name: 'custscript_quod_form' }))
                .setValue("employee", poObj.employee > 0 ? poObj.employee : runtime.getCurrentScript().getParameter({ name: 'custscript_quod_std_employee' }))
                .setValue("externalid", poObj.externalid)
                .setValue("entity", idVendor)
                .setValue("duedate", formattedDueDate)
                .setValue("custbody_acs_justificativa_compra", poObj.descricao);
            //...Other values to set
            // Set line items for the Purchase Order.
            for (var i = 0; i < poObj.itens.length; i++) {
                createPurchaseOrder.selectNewLine({ sublistId: 'item' })
                    .setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: poObj.itens[i].item })
                    .setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: poObj.itens[i].valor })
                    .commitLine({ sublistId: 'item' });
            }
            // Save the Purchase Order record.
            idPurchaseOrder = createPurchaseOrder.save();
            // Add an attachment to the Purchase Order.
            var checkAddAtt = utils.adicionarAnexo(poObj.anexo, idPurchaseOrder, runtime.getCurrentScript().getParameter({ name: 'custscript_quod_folder_projuris' })), attchamentStatus = checkAddAtt.cod < 0 ? { msg: checkAddAtt.msg, obj: checkAddAtt, externalId: poObj.externalid } : "Sucess";
            // Update the Purchase Order with a saved attachment.
            var idSavedAtt = record.load({ id: idPurchaseOrder, type: record.Type.PURCHASE_ORDER }).setValue("custbodydocumento_fiscal_recebido", true).save();
            // Set the return value based on the saved ID or an error code.
            ret = {
                status: rlEnum.retStatusObj.success,
                externalid: poObj.externalid,
                internalid: idPurchaseOrder,
                numPedido: getNumPedido(idPurchaseOrder).tranid,
                message: "Purchase order created sucesfully",
                statusanexo: idSavedAtt > 0 ? attchamentStatus : 'Fail'
            };
            // Return the result.
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error("Erro ao tentar criar o pedido de compra", error);
            ret = {
                status: rlEnum.retStatusObj.errorCreatingOrder,
                externalid: poObj.externalid,
                internalid: poObj.externalid,
                erro: error,
            };
            return ret;
        }
    }
    exports.createPoRecord = createPoRecord;
    /**
     * Retrieves the Purchase Order number based on its ID.
     *
     * @param {number} idPo - Purchase Order ID.
     * @returns {Object} - Purchase Order number details.
     */
    function getNumPedido(idPo) {
        try {
            return search.lookupFields({ columns: "tranid", id: idPo, type: "purchaseorder" });
        }
        catch (error) {
            throw error;
        }
    }
    exports.getNumPedido = getNumPedido;
    /**
     * Fetches a Purchase Order ID based on its external ID.
     *
     * @param {string} idExt - External ID of the Purchase Order.
     * @returns {Object} - Purchase Order ID details or an error code.
     */
    function _fetchPo(idExt) {
        var ret = {};
        try {
            // Search for the Purchase Order based on its external ID.
            var srcPo = searchPo(idExt), searchResultCount = srcPo.runPaged().count;
            // Log the count of search results.
            log.audit("searchResultCount", searchResultCount);
            // Return 0 if no results are found.
            if (searchResultCount == 0)
                return searchResultCount;
            // Retrieve the Purchase Order ID from the search results.
            var idRet = Number(srcPo.run().getRange({ start: 0, end: searchResultCount })[0].id);
            // Log the retrieved Purchase Order ID.
            log.audit("_fetchPo idRet", idRet);
            // Set the return value based on the retrieved ID or an error code.
            ret = idRet > 0 ? idRet : rlEnum.retStatusObj.errorFetchingOrder;
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error({ details: error, title: rlEnum.retStatusObj.errorFetchingOrder.msg });
            ret = rlEnum.retStatusObj.errorFetchingOrder.cod;
            return ret;
        }
    }
    exports._fetchPo = _fetchPo;
    /**
     * Fetches Purchase Order details based on its external ID.
     *
     * @param {string} idExt - External ID of the Purchase Order.
     * @returns {Object} - Purchase Order details or an error code.
     */
    function _fetchPoGet(idExt) {
        var ret;
        try {
            // Search for the Purchase Order based on its external ID.
            var searchId = searchPo(idExt).run().getRange({ start: 0, end: 1 })[0];
            // Log the search result.
            log.audit("searchId", searchId);
            log.audit("searchId", searchId.id);
            // Return 0 if the ID is undefined.
            ret = searchId.id === undefined ? 0 : search.lookupFields({ columns: ["internalid", "approvalstatus", "tranid"], id: searchId.id, type: "purchaseorder" });
            return ret;
        }
        catch (error) {
            // Log error details in case of an exception.
            log.error({ details: error, title: rlEnum.retStatusObj.orderNotFound.msg });
            ret = rlEnum.retStatusObj.orderNotFound;
            return ret;
        }
    }
    exports._fetchPoGet = _fetchPoGet;
    /**
     * Creates a search object for Purchase Orders based on external ID.
     *
     * @param {string} id - External ID of the Purchase Order.
     * @returns {Object} - Purchase Order search object.
     */
    function searchPo(id) {
        try {
            return search.create({
                type: "purchaseorder",
                filters: [
                    ["type", "ANYOF", "PurchOrd"],
                    "AND",
                    ["externalid", "ANYOF", id],
                    "AND",
                    ["mainline", "IS", "T"]
                ]
            });
        }
        catch (e) {
            // Log error details in case of an exception.
            log.error("Erro searchPo ", e);
        }
    }
});
