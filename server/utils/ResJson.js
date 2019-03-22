/**
 * 接口返回的数据格式类
 * @copyright @Navinfo, all rights reserved.
 */
class ResJson {
    /**
     * 构造方法.
     * @returns {undefined}
     */
    constructor (errcode = 0, errmsg = '', data = null) {
        this.errcode = errcode;
        this.errmsg = errmsg;
        this.data = data;
    }
}

// export default ResJson;
module.exports = ResJson;