import { getStringTypeAttr } from '@/components/template'

export default function(_attr, _slots) {
    //定义默认属性
    let attributes = {
            text: {
                type: 'text',
                value: 'Link'
            },
            href:{
                type:'text',
                value:''
            },
            target: {
                type: 'selection',
                value: '',
                items: ['_blank', 'self', '_parent', '_top']
            },
            title:{
                type:'text',
                value:''
            }
        },
        slots = {}

    //覆盖默认属性
    Object.assign(slots, _slots)
    Object.assign(attributes, _attr)

    //设置当前组件的slot
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
    let template = `<a ${stringAttr}>
                        ${attributes.text.value||'&nbsp;'}
                    </a>`

    template = template.replace(/text=".*?"/g, '')//模板字符串中删除text属性


    return { template, attributes, slots }
}
