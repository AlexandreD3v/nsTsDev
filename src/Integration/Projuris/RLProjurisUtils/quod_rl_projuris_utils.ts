/**
 * @copyright © 2022, Oracle and/or its affiliates. All rights reserved.
 *
 * @NApiVersion 2.x
 * @NModuleScope Public
 */

/**
 * Utility module for handling common operations in NetSuite.
 *
 * @import {N/log} log - NetSuite log module.
 * @import {N/file} file - NetSuite file module.
 * @import {N/record} record - NetSuite record module.
 * @import {Object} rlEnum - Enumerations from RLProjurisEnums module.
 * @import {N/format} format - NetSuite format module.
 * @exports - Functions for common operations.
 */
import * as log from "N/log";
import * as file from "N/file";
import * as record from "N/record";
import * as format from "N/format";
import * as rlEnum from "../RLProjurisEnums/quod_enum_rl_projuris";

/**
 * Handles errors and returns an error message.
 *
 * @param {Object} objRet - The response object to be modified.
 * @param {number} cod - The error code.
 * @param {Error} e - The caught error.
 * @returns {Object} - The updated response object.
 */
export function errorMessage(objRet: any, cod: number, e: any): object {
    log.error(objRet.message, e);
    objRet = {
        status: "Error",
        codigo: cod,
        message: "" + e,
        internalid: -1
    };
    return objRet;
}

/**
 * Validates if any property in the object is empty.
 *
 * @param {Object} obj - The object to be validated.
 * @returns {boolean} - True if any property is empty, otherwise false.
 */
export function validaArray(obj: any): boolean {
    var ret;
    try {
        var existsEmpty = false;
        Object.keys(obj).forEach(function (param) {
            if (!obj[param])
                existsEmpty = true;
        });
        ret = existsEmpty;
        return ret;
    } catch (error) {
        log.error('Erro validaArray', error);
        ret = true;
        return ret;
    }
}

/**
 * Adds attachments to a NetSuite record.
 *
 * @param {Array} anexo - Array of attachments to be added.
 * @param {number} idPedido - The internal ID of the NetSuite record.
 * @param {number} folder - The internal ID of the NetSuite folder.
 * @returns {Object} - The result of the attachment addition.
 */
export function adicionarAnexo(anexo: Array<any>, idPedido: number, folder: any): any {
    try {
        for (var i = 0; i < anexo.length; i++) {
            var nomeArquivo = anexo[i].nome,
                extensao = nomeArquivo.split(".").pop(),
                conteudo = anexo[i].conteudo,
                arquivo = file.create({
                    name: nomeArquivo,
                    fileType: getFileType(extensao),
                    contents: conteudo,
                    description: "Attachment file for Projuris, purchase order ".concat(String(idPedido)),
                    folder: +folder,
                    isOnline: true
                }),
                arquivoid = arquivo.save();

            record.attach({
                record: { type: 'file', id: arquivoid },
                to: { type: record.Type.PURCHASE_ORDER, id: idPedido }
            });
        }
        return { cod: 1, msg: true };
    }
    catch (error) {
        log.error('Erro adicionarAnexo', error);
        return rlEnum.retStatusObj.errorAddingAttachments;
    }
}

/**
 * Formats a date using the NetSuite format module.
 *
 * @param {Date|string} dataRecebida - The date to be formatted.
 * @returns {Date} - The formatted date.
 */
export function formatDate(dataRecebida: Date | string): record.FieldValue {
    log.error({ title: 'date 1', details: dataRecebida });
    var dataFormatada = format.parse({
        value: dataRecebida,
        type: format.Type.DATE
    });
    log.error({ title: 'dateformat', details: dataFormatada });
    return dataFormatada;
}

/**
 * Gets the NetSuite file type based on the file extension.
 *
 * @param {string} extensao - The file extension.
 * @returns {string} - The NetSuite file type.
 * @throws {Error} - Throws an error if the file type is not recognized.
 */
export function getFileType(extensao: string): file.Type {
    try {
        let extType: file.Type;
        switch (extensao.toUpperCase()) {
            case "PDF":
                extType = file.Type.PDF;
                break;
            case "BMP":
                extType = file.Type.BMPIMAGE;
                break;
            case "CSV":
                extType = file.Type.CSV;
                break;
            case "XLSX":
            case "XLSM":
            case "XLS":
            case "XLSB":
            case "XLT":
            case "XLT":
            case "XLTM":
            case "XLTX":
            case "ODS":
            case "XLW":
            case "XLK":
                extType = file.Type.EXCEL;
                break;
            case "DOC":
            case "DOCX":
            case "ODT":
            case "SXW":
            case "ODT":
                extType = file.Type.WORD;
                break;
            case "GIF":
                extType = file.Type.GIFIMAGE;
                break;
            case "JPG":
            case "JPEG":
            case "JFIF":
            case "JP2":
                extType = file.Type.JPGIMAGE;
                break;
            default:
                extType = file.Type.PLAINTEXT;
                break;
        }
        return extType;
    }
    catch (e) {
        log.error('getFivarype err', e);
        throw e;
    }
}

