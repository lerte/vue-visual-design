<template>
    <div class="wrapper">
        <mu-appbar>
            <router-link to="/">
                <div class="title">
                    Vue Visual Design
                    <mu-badge class="description" content="可视化设计" color="#f06292" />
                </div>
            </router-link>
            <mu-button flat slot="right" @click="share.open=true">
                <mu-icon value="share"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" @click="setting.open=true">
                <mu-icon value="settings"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" href="https://github.com/lerte/vue-visual-design">
                <mu-icon value=":fa fa-2x fa-github"></mu-icon>
            </mu-button> 
        </mu-appbar>
        <main>
            <mu-row>
                <mu-col class="attributes" span="2">
                    <mu-sub-header class="header">
                        <mu-select class="select-field" autoWidth v-model="selectField.value">
                            <mu-option label="属性" value="属性"></mu-option>
                            <mu-option label="组件树" value="组件树"></mu-option>
                        </mu-select>
                        <span><a class="parent-component" v-if="parentComponent" @click="switchComponent">┡ {{parentComponent.info.name}}</a> {{current.info?' - '+current.info.name:''}}</span>
                    </mu-sub-header>
                    <attributes v-if="selectField.value==='属性'" class="attributes-content" />
                    <component-tree v-if="selectField.value==='组件树'" class="component-tree" :components="$store.state.components.filter(c=>!c.parentId)" />
                    <div class="attributes-bottom" v-if="current.info">
                        <mu-button flat @click="openUiDocument">UI文档</mu-button>
                        <mu-button flat @click="oprate">操作</mu-button>
                    </div>
                </mu-col>
                <mu-col class="preview" span="8">
                    <preview ref="preview" />
                </mu-col>
                <mu-col class="components" span="2">
                    <components ref="components" />
                </mu-col>
            </mu-row>
        </main>
        <mu-dialog :open="setting.open" @close="setting.open=false" title="设置" scrollable>
            <mu-checkbox label="选中边框效果" v-model="setting.selectEffect" @change="setSelectEffect" />
            <mu-button color="primary" @click="setting.open=false" slot="actions">
                关闭
            </mu-button>
        </mu-dialog>
        <mu-dialog :open="share.open" @close="share.open=false" title="分享当前布局" scrollable>
            <mu-button flat @click="createShare" v-if="!share.url">
                点击生成
            </mu-button>
            <mu-text-field v-model="share.url" type="url" :disabled="true" label="分享地址" label-float fullWidth />
            <mu-text-field v-model="share.experience" type="url" :disabled="true" label="体验地址" label-float fullWidth />
            <mu-button color="primary" @click="share.open=false" slot="actions">
                关闭
            </mu-button>
        </mu-dialog>
    </div>
</template>

<script>
import attributes from './attributes'
import components from './components'
import preview from './preview'
import componentTree from './componentTree.vue'
export default {
    name: 'mainPage',
    data() {
        return {
            setting: {
                open: false,
                selectEffect: true
            },
            share: {
                open: false,
                url: '',
                experience: ''
            },
            selectField: {
                value: '属性'
            }
        }
    },
    mounted() {
        this.setSelectEffect(this.setting.selectEffect)
    },
    computed: {
        current: { //预览视图中选中的组件
            get() {
                return this.$store.state.currentComponent
            }
        },
        parentComponent: {
            get() {
                let component
                if (this.current.parentId)
                    component = this.$store.state.components.find(c => c.info.id === this.current.parentId)
                else
                    component = null
                return component
            }
        },
        components: {
            get() {
                return this.$store.state.components
            }
        }
    },
    watch: {
        components: {
            deep: true,
            handler() {
                //布局修改后将分享的url设为空
                this.share.url = ''
                this.share.experience = ''
            }
        }
    },
    methods: {
        switchComponent() {
            let el = document.getElementById(this.parentComponent.info.id)
            el.click()
        },
        oprate(e) {
            // let components = await this.$store.dispatch('delComponent', this.current.info.id)
            // this.$refs.preview.fresh()
            this.$refs.preview.rightClick(e)
        },
        openUiDocument() {
            switch (this.current.info.ui) {
                case 'Muse-UI':
                    return window.open('http://www.muse-ui.org/#/' + this.current.info.name.replace(' ', ''))
                case 'Mint-UI':
                    return window.open('https://mint-ui.github.io/docs/#/zh-cn/' + this.current.info.name.replace(' ', '-'))
                case 'iView-UI':
                    return window.open('https://www.iviewui.com/components/' + this.current.info.name)
                default:
                    return this.$toast('无文档页')
            }
        },
        setSelectEffect(val) {
            let head = document.head
            let style = document.getElementById('vue-layout-style')
            if (!style) {
                style = document.createElement('style')
                style.id = 'vue-layout-style'
                style.type = 'text/css'
                head.appendChild(style)
            }

            let cssText
            if (val) {
                cssText = `[data-component-active="true"] {
                              box-shadow: inset 0px 0px 0px 1px pink!important;
                          }
                          [data-component-active]:hover {
                              box-shadow: inset 0px 0px 0px 1px pink!important;
                          }
                          [data-component-active]:focus {
                              box-shadow: inset 0px 0px 0px 1px pink!important;
                          }`
            } else {
                cssText = `[data-component-active="true"] {
                              box-shadow: none;
                              outline:none;
                          }
                          [data-component-active]:hover {
                              box-shadow: none;
                          }
                          [data-component-active]:focus {
                              box-shadow: none;
                          }`
            }
            let textNode = document.createTextNode(cssText)
            style.innerHTML = ''
            style.appendChild(textNode)
        },
        createShare() {
            let share = new this.$lean.Object('Share')
            share.set('store', this.$store.state)
            share.save().then(res => {
                this.share.url = location.origin + location.pathname + '#/share/' + res.id
                this.share.experience = location.origin + location.pathname + '#/preview/pc/' + res.id
            })
        }
    },
    components: {
        components,
        preview,
        attributes,
        componentTree
    }
}
</script>

<style lang="less" scoped>
@import '~muse-ui/src/styles/colors.less';
@previewBG: @deepPurple50;
* {
    -webkit-user-select: none;
}

::-webkit-scrollbar {
    display: none;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.title {
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
    .description {
        vertical-align: super;
    }
}

.main-content>div {
    transition: all .5s;
}

.client-height {
    height: 100vh;
    overflow: auto;
}

.attributes {
    .client-height;
    background-color: @previewBG;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .header {
        white-space: nowrap;
    }
    .select-field {
        width: 70px;
        vertical-align: top;
        text-align: center;
    }
}

.attributes-content {
    flex: 1;
}

.component-tree {
    flex: 1;
}

.attributes-bottom {
    position: relative;
    text-align: center;
    color: @grey500;
}

.preview {
    .client-height;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .117647), 0 1px 4px rgba(0, 0, 0, .117647);
    z-index: 1;
}

.components {
    .client-height;
    background-color: @previewBG;
    overflow-y: scroll;
}

.parent-component {
    cursor: pointer;
}
</style>
