import { getStringTypeAttr } from '@/components/template'

export default function(_attr, _slots) {
    //定义默认属性
    let attributes = {
        },
        slots = {}

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    if (attributes.slot && attributes.slot !== 'default') {
        attributes.slot = {
            type: 'text',
            value: attributes.slot
        }
    } else {
        attributes.slot = {
            type: 'text',
            value: ''
        }
    }

    //字符串模板操作
    let stringAttr = getStringTypeAttr(attributes)
    let template = `<br ${stringAttr}/>`

    return { template, attributes, slots }
}
