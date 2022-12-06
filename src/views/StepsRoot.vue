<template>
    <div>
        <el-steps align-center :active="active" finish-status="success">
            <el-step title="step 1"></el-step>
            <el-step title="step 2"></el-step>
            <el-step title="step 3"></el-step>
            <el-step title="step 4"></el-step>
            <el-step title="step 5"></el-step>
        </el-steps>
        <router-view></router-view>
        <div style="padding-top: 0.5em;">
            <template v-if="active===0">{{stages[active]+'/8次'}}</template>
            <template v-if="active===1">{{stages[active]+'/8次'}}</template>
            <template v-if="active===2">{{stages[active]+'/6次'}}</template>
            <template v-if="active===3">{{stages[active]+'/4次'}}</template>
            <template v-if="active===4">{{stages[active]+'/4次'}}</template>
        </div>

    </div>
</template>

<script>
export default {
    name: "StepsRoot",
    data(){
        return{
            active:'',
            stages:[],
        }
    },
    mounted() {
        this.active = Number(this.$storage.get('stepActive'))
        console.log(this.$storage.getObj('stages'))
        this.stages=this.$storage.getObj('stages')
    }
}
</script>

<style scoped>

</style>
