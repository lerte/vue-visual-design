<template>
    <section>
        <div v-for="(component, index) in components" :key="index">
            <a @click="click(component.info.id)">
                <mu-icon @click="show=!show" :value="show?'keyboard_arrow_down':'keyboard_arrow_right'" style="vertical-align:middle;" />
                {{c.info.name}}</a>
            <div v-for="(slot, key) in component.slots" v-show="show" :key="key">
                <componentTree :components="slotToComponents(component.slots[key])" v-if="Object.keys(component.slots).filter(slot=>component.slots[slot].length).length" />
            </div>
        </div>
    </section>
</template>
<script>
export default {
    name: 'componentTree',

    data() {
        return {
            show: true
        }
    },
    props: {
        components: {
            type: Array,
            default: null
        }
    },
    methods: {
        slotToComponents(slot) {
            return this.$store.state.components.filter(c => slot.findIndex(item => item.id === c.info.id) !== -1)
        },
        click(id) {
            let el = document.getElementById(id)
            el.click()
        }
    }
}
</script>
<style lang="css" scoped>
a {
    cursor: pointer;
}

section {
    margin-left: 20px;
}
</style>
