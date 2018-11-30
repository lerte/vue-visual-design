import { getSlotContent } from '@/components/template'

export default function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            text: {
                type: 'text',
                value: '正文'
            },
            indset:{
                type:'boolean',
                value:false
            }
        },
        slots = {
            default: []
        }

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //根据组件不同需要做的不同操作


    //获取插槽模板内容
    var subContent = getSlotContent(slots)

    //设置当前组件的slot
    if (attributes.slot && attributes.slot!=='default') {
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

    let template = `<mu-sub-header >${subContent||attributes.text.value}</mu-sub-header>`

    return { template, attributes, slots }
}
