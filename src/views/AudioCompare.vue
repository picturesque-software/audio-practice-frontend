<template>
    <div style="margin: 2px">
        <p>评测流程：点击播放，默认播放<span style="color:red">参考音频</span>。点击待评测音频AB方块以切换听音，并以参考音频为基准进行音质评价。最后请拖动对音频AB进行排序。<span style="color:red">注意前后~</span></p>
        <three-audio
            :referAudio="audios.referAudio"
            :audioList="audios.audioList"
            @onChildUpdate="onChildUpdate"
            @onChildClick="onChildClick"
        ></three-audio>
        <div style="display: flex;margin-top: 2em">
            <div style="width: 20%;display: flex">
                <div style="margin: auto;font-size: medium">{{currentAudio}}</div>
            </div>
            <div style="width: 80%">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm"
                         size="mini">
                    <div v-if="currentAudio==='音频A'">
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
                    <div v-if="currentAudio!=='音频A'">
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

        <el-button type="primary" @click="onNext">下一步</el-button>
        <!--        <el-button>取消</el-button>-->
    </div>
</template>

<script>
import threeAudio from "../components/audio/ThreeAudio.vue";

export default {
    components: {threeAudio},
    inject: ['reload'],

    data() {
        return {
            currentAudio:'音频A',

            stage: '',

            constAudioList: [],
            audios: {
                audioList: [
                    {
                        id: 1,
                        name: '',
                        url: '',
                    },
                    {
                        id: 1,
                        name: '',
                        url: '',
                    },
                ],
                referAudio: {
                    id: 1,
                    name: '',
                    url: '',
                },
            },


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
        this.stage = Number(this.$storage.get('stageOfStep'))
        console.log(this.stage)
        console.log(this.$storage.getObj('audioPairList')[this.stage - 1])
        // TODO 获取音频url及填入
        this.audios = this.$storage.getObj('audioPairList')[this.stage - 1]
        this.audios.audioList[0].formName='音频A'
        this.audios.audioList[1].formName='音频B'
        // formName
        this.constAudioList = this.$storage.getObj('audioPairList')[this.stage - 1].audioList
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
                    console.log(this.audios.audioList)
                    // this.$http({
                    //     url: this.$api.submitAudioForm,
                    //     method: "post",
                    //     data: this.ruleForm
                    // }).then(({data}) => {
                    //     if (data && data.code === "0") {
                    //         this.$message({
                    //             message: data.msg,
                    //             type: "success",
                    //             duration: 1000,
                    //         });
                    //     } else {
                    //         this.$message.error(data.message);
                    //     }
                    // });
                    console.log(this.ruleForm)
                    for (let i = 0; i < this.constAudioList.length; i++) {
                        let res = {}
                        if (this.constAudioList[i].id === this.audios.audioList[i].id) {
                            if (this.constAudioList[i].processMode === 1) {
                                // 前向
                                res.score = i === 0 ? "1-0" : "0-1"

                            } else {
                                res.score = i === 0 ? "0-1" : "1-0";
                            }
                        } else {
                            if (this.constAudioList[i].processMode === 1) {
                                // 前向
                                res.score = i === 0 ? "0-1" : "1-0"

                            } else {
                                res.score = i === 0 ? "1-0" : "0-1";
                            }
                        }
                        res.articulation = this.ruleForm['articulation' + (i + 1).toString()]
                        res.lightNess = this.ruleForm['lightNess' + (i + 1).toString()]
                        res.distortion = this.ruleForm['distortion' + (i + 1).toString()]
                        res.uid = Number(this.$storage.get('userid'))
                        res.aid = this.constAudioList[i].id
                        res.material = this.constAudioList[i].material
                        res.processMode = this.constAudioList[i].processMode
                        console.log(res)

                        let result = this.$storage.getObj('resultOfStep1')
                        result = eval(result)

                        result[2 * (Number(this.stage) - 1) + i] = res
                        console.log(result)
                        this.$storage.set('resultOfStep1', result)
                    }
                    console.log(this.stage)


                    let step = Number(this.$storage.get('stepActive'))
                    let stages = this.$storage.getObj('stages')
                    // 对应计数器++
                    stages[step] = this.stage
                    this.$storage.set('stages', stages)
                    // stage++
                    this.$storage.set('stageOfStep', (Number(this.stage) + 1).toString())
                    if (Number(this.stage) >= 8) {
                        // 结束第一轮！
                        let data = {}
                        data.scoreList = eval(this.$storage.getObj('resultOfStep1'))
                        this.$http({
                            url: this.$api.submitStep1,
                            method: "post",
                            data: data
                        }).then(({data}) => {
                            if (data && data.code === "0") {
                                this.$message({
                                    message: data.msg,
                                    type: "success",
                                    duration: 1000,
                                })
                                this.$router.push({path: '/finishStep1'})
                            } else {
                                this.$message.error(data.msg);
                            }
                        });
                        return;
                    }
                    location.reload()

                    // this.reload()
                    // this.$scrollTo()
                }
            });
        },
        onChildUpdate(value) {
            console.log(value)
            this.audios.audioList = value
        },
        onChildClick(value) {
            console.log(value)
            this.currentAudio=value
        }
    }
}
</script>
<style scoped>
.audioPlayer {
    display: inline-block;
}

</style>
