<template>
<!--    <div @click="clickAudio(index)" class="item" v-for="(element, index) in myAudios" :key="element.name">-->
    <div>
        <div style="height: 100%;width: 100%; display: flex" @click.stop.prevent="onClick">
            <div style="margin: auto">{{audio.formName}}</div>
        </div>
    </div>
<!--    </div>-->
</template>

<script>
export default {
    name: "DragItem",
    props:{
        audio:{
            type:Object
        }
    },
    methods:{
        onClick(){
            this.$emit("itemClick", this.audio)
        }
    }
}
</script>

<style scoped>

</style>
