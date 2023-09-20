/**
* @copyright by 杭州利鹏科技有限公司
* @createTime 2023-05-05 14:15:56
* @author mopisces 1105734919@qq.com
* @description 判断是否是数组
* @param arg
* @return arg is any[]|boolean
*/
export function isArray(arg) {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
}

/**
* @copyright by 杭州利鹏科技有限公司
* @createTime 2023-07-28 16:39:30
* @author mopisces 1105734919@qq.com
* @description axios请求移除空字符串，null, undefined
* @param {object} {}
* @return {object} {}
*/

export function clearAxiosEmptyParam( config ) {
	['data', 'params'].forEach((item)=>{
		if (config[item]) {
			const keys = Object.keys(config[item]);
			if (keys.length) {
				keys.forEach((row) => {
					const rawType = toRawType(config[item]);
					if (['', undefined, null].includes(config[item][row]) && ['Object'].includes(rawType) ) {
						delete config[item][row];
					}
				});
			}
		}
	})
}

/**
* @copyright by 杭州利鹏科技有限公司
* @createTime 2023-07-28 16:38:28
* @author mopisces 1105734919@qq.com
* @description 获取原始类型
* @param {*} value
* @return {String} 类型字符串，如'String', 'Object', 'Null', 'Boolean', 'Number', 'Array'
*/
export function toRawType( value ){
	return Object.prototype.toString.call(value).slice(8, -1);
}

/**
* @copyright by 杭州利鹏科技有限公司
* @createTime 2023-09-15 12:00:00
* @author mopisces 1105734919@qq.com
* @description 数字转中文
* @param {*} value
* @return {Number} 类型
*/
export function digitToChi(n)
{
	var fraction = ['角', '分'];
	var digit = [
		'零', '壹', '贰', '叁', '肆',
		'伍', '陆', '柒', '捌', '玖'
	]
	var unit = [
		['元', '万', '亿'],
		['', '拾', '佰', '仟']
	]
	var head = n < 0 ? '欠' : ''
	n = Math.abs(n)
	var s = ''
	for (var i = 0; i < fraction.length; i++) {
		s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
	}
	s = s || '整'
	n = Math.floor(n)
	for (var i = 0; i < unit[0].length && n > 0; i++) {
		var p = ''
		for (var j = 0; j < unit[1].length && n > 0; j++) {
			p = digit[n % 10] + unit[1][j] + p
			n = Math.floor(n / 10)
		}
		s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
	}
	return head + s.replace(/(零.)*零元/, '元')
		.replace(/(零.)+/g, '零')
		.replace(/^整$/, '零元整')
}