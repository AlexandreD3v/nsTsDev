/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 * @NScriptType ClientScript
 */

import { EntryPoints } from "N/types";
import nsrch from "N/search"
import nlog from "N/log"

export function pageInit(context: EntryPoints.Client.pageInitContext): void {
    try {
        if (context.mode !== "copy") return;

        let linesToRemove = [];
        //Para cada linha de item inserida na fatura/For each line inserted in the transaction
        for (let i = 0; i < context.currentRecord.getLineCount({ sublistId: "item" }); i++) {
            //Get the item id
            let itemId = context.currentRecord.getSublistValue({ fieldId: "item", line: i, sublistId: "item" });
            //Checa se existe o id e executa lookup no campo inativo do item
            //Se o item estiver inaivo, adiciona o id do item no array linesToRemove
            if (itemId ? nsrch.lookupFields({ columns: "isinactive", id: itemId, type: "serviceitem" }).isinactive : false) linesToRemove.push(itemId);
        }

        //Checa se existem itens inativos
        if (linesToRemove.length == 0) return;
        //Remove os itens inativos
        linesToRemove.forEach(itemId => {
            context.currentRecord.removeLine({ line: context.currentRecord.findSublistLineWithValue({ fieldId: 'item', sublistId: 'item', value: itemId }), sublistId: "item" });
        });
        alert("Itens inativos removidos com sucesso!")
    } catch (error) {
        alert("Erro ao remover itens inativos, verifique a fatura")
        nlog.error('Erro Remove itens', error)
    }
}