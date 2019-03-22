import dbHelper from '../dbHelper/DBConnection'
var logger = require('../../log4js').logger;

/**
 * 用户查询统计的接口类
 */
class StatisticsInfo {

    /**
	 * 浏览器版本分布的统计
	 */
    browserList() {
		let sql = `SELECT browser, COUNT(browser) num FROM user_info GROUP BY browser`;
		return dbHelper.execPromiseSelect(sql).then(function (data) {
			let list = [];
			for (let i = 0; i < data.length; i++) {
				list.push({
					value: data[i].num,
					name: data[i].browser
				})
			}
			return list;
		});
	}
}

export default StatisticsInfo;
