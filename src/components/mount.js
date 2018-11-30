import Vue from 'vue'

//给定模板，和要挂载的元素id，挂载组件
export default function(id, _component) {
    let components = window._Vue.$store.state.components
    let component = components.find(c => c.info.id === id)
    return new Promise(resolve => {
        //需要延迟才能取到document.getElementById(id)
        setTimeout(() => {
            let data={}
            if (_component.attributes) {
                Object.keys(_component.attributes).forEach(key => {
                    data[key] = _component.attributes[key].value
                })
            }
            
            if (component.uid) { //销毁旧实例

            }
            let vm = new Vue({
                name: id.toString(),
                data() {
                    return data
                },
                template: _component.template,
                el: document.getElementById(id),
                mounted() {
                    this.$el.id = id
                    if (component) {
                        component.uid = this._uid
                    }

                    //添加选中效果
                    let info = window._Vue.$store.state.currentComponent.info
                    if (!info)
                        this.$el.click()

                }
            })
            resolve(vm)

        }, 200)
    })
}
