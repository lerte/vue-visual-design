import { getStringTypeAttr } from '@/components/template'

export default function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            src: {
                type: 'text',
                value: './static/img_default.JPG'
            },
            alt:{
                type:'text',
                value:''
            },
            width:{
                type:'text',
                value:''
            },
            height:{
                type:'text',
                value:''
            }
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
    let template = `<img ${stringAttr} />`

    return { template, attributes, slots }
}
