<template>
    <div style="margin: 2px"
         v-loading="loading"
         element-loading-text="提交中"
         element-loading-spinner="el-icon-loading"
    >
        <p>评测流程：点击播放，默认播放<span style="color:red">参考音频</span>。点击待评测音频AB方块以切换听音，并以参考音频为基准进行音质评价。最后请拖动对音频A、B以及参考音频进行纵深排序。<span style="color:red">注意前后~</span></p>
        <three-audio
            :audioList="audios"
            @onChildUpdate="onChildUpdate"
            @onChildClick="onChildClick"
        ></three-audio>
        <div style="display: flex;margin-top: 2em">
            <div style="width: 20%;display: flex">
                <div style="margin: auto;font-size: medium">{{currentSelectAudio}}</div>
            </div>
            <div style="width: 80%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
                         size="mini">
                    <div v-if="currentSelectAudio==='音频A'">
                        <el-form-item label="明亮度" prop="lightNess1">
                            <el-radio-group v-model="ruleForm.lightNess1" size="mini">
                                <el-radio :label="1">正常</el-radio>
                                <el-radio :label="0">刺耳/暗淡</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="清晰度" prop="articulation1" style="flex: auto">
                            <el-radio-group v-model="ruleForm.articulation1" size="mini">
                                <el-radio :label="1">清晰</el-radio>
                                <el-radio :label="0">模糊</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="失真与变调" prop="distortion1" style="flex: auto">
                            <el-radio-group v-model="ruleForm.distortion1" size="mini">
                                <el-radio :label="1">无失真</el-radio>
                                <el-radio :label="0">有失真</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                    <div v-if="currentSelectAudio==='音频B'">
                        <el-form-item label="明亮度" prop="lightNess2" style="flex: auto">
                            <el-radio-group v-model="ruleForm.lightNess2" size="mini">
                                <el-radio :label="1">正常</el-radio>
                                <el-radio :label="0">刺耳/暗淡</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="清晰度" prop="articulation2" style="flex: auto">
                            <el-radio-group v-model="ruleForm.articulation2" size="mini">
                                <el-radio :label="1">清晰</el-radio>
                                <el-radio :label="0">模糊</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="失真与变调" prop="distortion2" style="flex: auto">
                            <el-radio-group v-model="ruleForm.distortion2" size="mini">
                                <el-radio :label="1">无失真</el-radio>
                                <el-radio :label="0">有失真</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>

                </el-form>
            </div>
        </div>

        <el-button v-if="(Number(this.stage) === 63)" style="margin-top: 3em" type="primary" @click="onNext">提交</el-button>
        <el-button v-else style="margin-top: 3em" type="primary" @click="onNext">下一步</el-button>
    </div>
</template>

<script>
import threeAudio from "../components/audio/ThreeAudio.vue";

export default {
    components: {threeAudio},
    inject: ['reload'],

    data() {
        return {
            loading:false,

            currentSelectAudio:'音频A',

            stage: '',

            constAudioList: [],
            audios: [],


            ruleForm: {
                lightNess1: '',
                lightNess2: '',
                articulation1: '',
                articulation2: '',
                distortion1: '',
                distortion2: '',
            },
            rules: {
                lightNess1: [
                    {required: true, message: '请选择你认为合适的选项', trigger: 'blur'},
                ],
                articulation1: [
                    {required: true, message: '请选择你认为合适的选项', trigger: 'blur'},
                ],
                distortion1: [
                    {required: true, message: '请选择你认为合适的选项', trigger: 'blur'},
                ],
                lightNess2: [
                    {required: true, message: '请选择你认为合适的选项', trigger: 'blur'},
                ],
                articulation2: [
                    {required: true, message: '请选择你认为合适的选项', trigger: 'blur'},
                ],
                distortion2: [
                    {required: true, message: '请选择你认为合适的选项', trigger: 'blur'},
                ]
            }
        }
    },
    created() {
        let step = Number(this.$storage.get('stepActive'))
        let stages = this.$storage.getObj('stages')
        this.stage = stages[step]
        console.log(this.stage)
        console.log(this.$storage.getObj('audioPairList')[this.stage])
        // 处理成audios[0]为参考音频，1,2为A、B
        let resAudios = this.$storage.getObj('audioPairList')[this.stage]
        resAudios.referAudio.formName = '参考音频'
        resAudios.audioList[0].formName = '音频A'
        resAudios.audioList[1].formName = '音频B'
        this.audios.push(resAudios.referAudio)
        this.audios.push.apply(this.audios, resAudios.audioList)
        console.log(this.audios)
    },
    mounted() {

    },

    methods: {
        onNext() {
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    if(this.ruleForm.articulation1==='' || this.ruleForm.lightNess1==='' ||this.ruleForm.distortion1===''){
                        this.$message.error("音频A还有部分未选择哦！")
                        return;
                    }
                    if(this.ruleForm.articulation2==='' || this.ruleForm.lightNess2==='' ||this.ruleForm.distortion2===''){
                        this.$message.error("音频B还有部分未选择哦！")
                        return;
                    }
                    console.log(this.ruleForm)
                    console.log(this.audios)
                    // 存排序序列，找referAudio
                    let order = []
                    let referAid;
                    for(let i=0;i<this.audios.length;i++){
                        order.push(this.audios[i].aid)
                        if(this.audios[i].formName==='参考音频'){
                            referAid = this.audios[i].aid
                        }
                    }
                    let count=0
                    for(let i=0;i<this.audios.length;i++){
                        if(this.audios[i].formName==='参考音频') continue
                        if(this.audios[i].formName==='音频A'){
                            this.audios[i].articulation = this.ruleForm.articulation1
                            this.audios[i].lightNess = this.ruleForm.lightNess1
                            this.audios[i].distortion = this.ruleForm.distortion1
                        }
                        if(this.audios[i].formName==='音频B'){
                            this.audios[i].articulation = this.ruleForm.articulation2
                            this.audios[i].lightNess = this.ruleForm.lightNess2
                            this.audios[i].distortion = this.ruleForm.distortion2
                        }
                        this.audios[i].order = order
                        this.audios[i].uid = Number(this.$storage.get('userid'))
                        this.audios[i].referAid = referAid
                        // 存入localStorage
                        let result = this.$storage.getObj('resultOfStep1')
                        result = eval(result)
                        result[2 * Number(this.stage) + count] = this.audios[i]
                        console.log(result)
                        this.$storage.set('resultOfStep1', result)
                        count++
                    }


                    let step = Number(this.$storage.get('stepActive'))
                    let stages = this.$storage.getObj('stages')
                    // 对应计数器++
                    stages[step]++
                    this.$storage.set('stages', stages)

                    if (Number(this.stage) === 63) {
                        // 结束第一轮！
                        this.loading=true
                        let scoreList = eval(this.$storage.getObj('resultOfStep1'))
                        this.$http({
                            url: this.$api.submitStep1,
                            method: "post",
                            data: scoreList,
                        }).then(({data}) => {
                            if (data && data.code === "0") {
                                this.$message({
                                    message: data.msg,
                                    type: "success",
                                    duration: 1000,
                                })
                                this.loading=false
                                this.$router.push({path: '/finishStep1'})
                            } else {
                                this.$message.error(data.msg);
                            }
                        });
                        return;
                    }
                    location.reload()
                }
            });
        },
        onChildUpdate(value) {
            console.log(value)
            this.audios = value
        },
        onChildClick(value) {
            console.log(value)
            if(value!=='参考音频') this.currentSelectAudio = value==='音频A'?'音频A':'音频B'
        }
    }
}
</script>
<style scoped>
.audioPlayer {
    display: inline-block;
}
</style>
