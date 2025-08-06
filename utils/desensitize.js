/**
 * 手机号脱敏
 * @param {string} phone
 * @returns {string}
 */

export function maskPhone(phone) {
    if (!phone) return '';
    return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
}
