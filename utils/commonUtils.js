/**
 * 手机号脱敏
 * @param {string} phone
 * @returns {string}
 */

 function maskPhone(phone) {
    if (!phone) return '';
    return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
}

/**
 * 判断路径是否是线上文件（http/https）
 * @param {string} path 文件路径
 * @returns {boolean}
 */
function isOnlineFile(path) {
    return /^https?:\/\//.test(path);
}

export {
    isOnlineFile,
    maskPhone
}