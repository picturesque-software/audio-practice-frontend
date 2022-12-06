<template>
    <div style="margin: 2px">
        <p>评测流程：点击播放，默认播放<span style="color:red">音频A</span>。</p>
        <p>点击待评测音频AB方块以切换听音，并拖动方块对音频AB进行排序。<span style="color:red">注意前后~</span></p>
        <two-audio
            :audioList="audios.audioList"
            @update="update"
        ></two-audio>

        <el-button style="margin-top: 3em" type="primary" @click="onNext">下一步</el-button>
        <!--        <el-button>取消</el-button>-->
    </div>
</template>

<script>
import twoAudio from "../components/audio/TwoAudio.vue";

export default {
    components: {twoAudio},
    inject:['reload'],

    data() {
        return {

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
        }
    },
    created() {
        this.stage = Number(this.$storage.get('stageOfStep'))
        console.log(this.stage)
        console.log(this.$storage.getObj('audioPairList')[this.stage - 1])
        // TODO 获取音频url及填入
        this.audios = this.$storage.getObj('audioPairList')[this.stage - 1]
        this.audios.audioList[0].formName = '音频A'
        this.audios.audioList[1].formName = '音频B'
        this.constAudioList = this.$storage.getObj('audioPairList')[this.stage - 1].audioList
    },
    mounted() {

    },

    methods: {
        onNext() {
            // this.$refs["ruleForm"].validate(valid => {
            //     if (valid) {
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
            // console.log(this.ruleForm)
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
            if (Number(this.stage) >= 8 && step === 1) {
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
                        this.$router.push({path: '/finishStep2'})
                    } else {
                        this.$message.error(data.msg);
                    }
                });
                return;
            } else if (Number(this.stage) >= 6 && step === 2) {
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
                        this.$router.push({path: '/finishStep3'})
                    } else {
                        this.$message.error(data.msg);
                    }
                });
                return;
            } else if (Number(this.stage) >= 4 && step === 3) {
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
                        this.$router.push({path: '/finishStep4'})
                    } else {
                        this.$message.error(data.msg);
                    }
                });
                return;
            } else if (Number(this.stage) >= 4 && step === 4) {
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
                        this.$router.push({path: '/finishStep5'})
                    } else {
                        this.$message.error(data.msg);
                    }
                });
                return;
            }
            location.reload()

            // this.reload()
            // this.$scrollTo()
            //     }
            // });
        },
        update(value) {
            console.log(value)
            this.audios.audioList = value
        }
    }
}
</script>
<style scoped>
.audioPlayer {
    display: inline-block;
}

</style>
