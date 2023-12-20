/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 * @NScriptType ClientScript
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "N/search", "N/log"], function (require, exports, search_1, log_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pageInit = void 0;
    search_1 = __importDefault(search_1);
    log_1 = __importDefault(log_1);
    function pageInit(context) {
        try {
            if (context.mode !== "copy")
                return;
            var linesToRemove = [];
            //Para cada linha de item inserida na fatura/For each line inserted in the transaction
            for (var i = 0; i < context.currentRecord.getLineCount({ sublistId: "item" }); i++) {
                //Get the item id
                var itemId = context.currentRecord.getSublistValue({ fieldId: "item", line: i, sublistId: "item" });
                //Checa se existe o id e executa lookup no campo inativo do item
                //Se o item estiver inaivo, adiciona o id do item no array linesToRemove
                if (itemId ? search_1.default.lookupFields({ columns: "isinactive", id: itemId, type: "serviceitem" }).isinactive : false)
                    linesToRemove.push(itemId);
            }
            //Checa se existem itens inativos
            if (linesToRemove.length == 0)
                return;
            //Remove os itens inativos
            linesToRemove.forEach(function (itemId) {
                context.currentRecord.removeLine({ line: context.currentRecord.findSublistLineWithValue({ fieldId: 'item', sublistId: 'item', value: itemId }), sublistId: "item" });
            });
            alert("Itens inativos removidos com sucesso!");
        }
        catch (error) {
            alert("Erro ao remover itens inativos, verifique a fatura");
            log_1.default.error('Erro Remove itens', error);
        }
    }
    exports.pageInit = pageInit;
});
