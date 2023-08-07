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