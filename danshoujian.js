const { itemData } = require('./itemData')
let outValue
/** 赋值装备名 */
const getItemName = (valueList) => {
	const itemNameObj = valueList.find(ele => ele.children.attributes?.class.indexOf('item-name') !== -1)
	return (itemNameObj.children[0].text)
}
/** 赋值装备描述 */
const getItemDescription = (valueList) => {
	const ItemDescriptionObj = valueList.find(ele => {
		if (ele.attributes?.class) {
			return ele.attributes?.class.indexOf('item-description-text') !== -1
		}
	})
	return (ItemDescriptionObj?.text) || ''
}
/** 赋值装备类型 */
const getItemType = (valueList) => {
	const itemTypeObj = valueList.find(ele => {
		if (ele.attributes?.class) {
			return ele.attributes?.class.indexOf('item-type') !== -1
		}
	})
	return (itemTypeObj.text)
}
const getItemBaseStats = (valueList) => {
	const itemBaseStatsObj = valueList.find(
		ele => {
			return (ele.attributes?.class.indexOf('item-base-stats')) !== -1 && ele.attributes?.class
		}
	)
	const getAttackSpeed = itemBaseStatsObj.children.find(ele => {
		return ele.children.some(e => e.text === '每秒攻击')
	})
	const attackValueList = itemBaseStatsObj.children.filter(ele => {
		const canReturn = /^点/.test(ele.children[0].text) && /伤害$/.test(ele.children[0].text)
		if (canReturn) {
			return true;
		}
	}
	).map(ele =>
		ele = {
			type: ele.children[0].text.replace('点', '').replace('伤害', ''),
			value: ele.text.split('-')
		}
	)
	const armorPiercing = itemBaseStatsObj.children.find(ele => {
		return ele.children.some(e => e.text === '穿刺转换')
	})
	console.log('--------------------')
	return {
		attackSpeed: getAttackSpeed?.children[1]?.text,
		armorPiercing: armorPiercing.text,
		attackValueList: attackValueList
	}
}
const itemBaseDispose = (item, index) => {
	const _item = {}
	_item.id = item['item-id']
	item.children.forEach(ele => {
		if (ele.attributes.class.indexOf('item-description') !== -1) {
			_item.name = getItemName(ele.children)
			_item.description = getItemDescription(ele.children)
			_item.itemType = getItemType(ele.children)
			_item.baseStats = getItemBaseStats(ele.children)
			if (_item.name === '鲜血领主的复仇') {
			}
		}
	})
	return _item
}
const data = JSON.parse(itemData)
const itemList = []
let itemRarity = ''

data.children.forEach(element => {
	if (element.attributes?.class.indexOf('item-list-group-header') !== -1) {
		itemRarity = element.text.split(' (')[0]
	}
	if (
		element.attributes?.class.indexOf('item-list-group') !== -1 &&
		element.attributes?.class.indexOf('item-list-group-header') === -1) {
		itemList.push({
			itemRarity: itemRarity,
			list: element.children.map(ele => itemBaseDispose(ele)),
		})
	}
});
const fs = require('fs')
// 创建一个可以写入的流，写入到文件 newJs.txt 中
var writerStream = fs.createWriteStream('./grimdown/itemList.json');
// 使用 utf8 编码写入数据
writerStream.write(JSON.stringify(itemList), 'UTF8');
// 标记文件末尾
writerStream.end();
// 处理流事件 完成和报错时执行
writerStream.on('finish', function () {
	console.log("写入完毕");
});
writerStream.on('error', function (err) {
	console.log(err.stack);
});
console.log("程序执行完毕");

