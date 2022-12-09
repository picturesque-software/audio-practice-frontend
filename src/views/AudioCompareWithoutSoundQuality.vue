<template>
    <div style="margin: 2px">
        <p>评测流程：点击播放，默认播放<span style="color:red">音频A</span>。</p>
        <p>点击待评测音频AB方块以切换听音，并拖动方块对音频AB进行排序。<span style="color:red">注意前后~</span></p>
        <two-audio
            :audios="audios"
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
    inject: ['reload'],

    data() {
        return {
            step: '',
            stage: '',
            audios: []
        }
    },
    created() {
        let step = Number(this.$storage.get('stepActive'))
        let stages = this.$storage.getObj('stages')
        this.stage = stages[step]
        this.step = step
        console.log(this.stage)
        let audioPairList = this.$storage.getObj('audioPairList')
        if (step < 3) {
            console.log(audioPairList[this.stage])
            // stage 0-1 2-3 4-5
            this.audios = audioPairList[this.stage].audioList
        } else if(step === 3){
            // 冒泡比较
            if (this.stage % 2 === 0) {
                // 首次,a【0和1】
                console.log(audioPairList[this.stage / 2])
                this.audios = audioPairList[this.stage / 2].audioList.slice(0, 2)
            } else {
                // 胜者与3比较
                this.audios.push(audioPairList[(this.stage - 1)/2].audioList[1])
                this.audios.push(audioPairList[(this.stage - 1)/2].audioList[2])
            }
        }else{
            if(this.stage%4<2){
                this.audios = audioPairList[this.stage].audioList
            }else{
                this.audios = audioPairList[this.stage-2].audioList
            }
        }
        this.audios[0].formName = '音频A'
        this.audios[1].formName = '音频B'
    },
    mounted() {

    },

    methods: {
        onNext() {
            if (this.step < 3) {
                // 存排序序列
                let order = []
                for (let i = 0; i < this.audios.length; i++) {
                    order.push(this.audios[i].aid)
                }
                for (let i = 0; i < this.audios.length; i++) {
                    this.audios[i].order = order
                    this.audios[i].uid = Number(this.$storage.get('userid'))
                    // 存入localStorage
                    let result = this.$storage.getObj('resultOfStep1')
                    result = eval(result)
                    result[2 * Number(this.stage) + i] = this.audios[i]
                    console.log(result)
                    this.$storage.set('resultOfStep1', result)
                }
            } else if (this.step === 3) {
                this.updateAudioPairList()
            } else if(this.step === 4){
                let audioPairList = this.$storage.getObj('audioPairList')
                if(this.audios[0].processMode === 1){
                    // front compare
                    this.addScore(this.audios[0])
                    this.subScore(this.audios[1])
                }else{
                    this.addScore(this.audios[1])
                    this.subScore(this.audios[0])
                }

                audioPairList[this.stage%4<2?this.stage:this.stage-2].audioList = this.audios
                // 0 1 2 3   4 5 6 7
                if(this.stage%4===1){
                    // update 2 3
                    let audioPair2={audioList:[]}
                    let audioPair3={audioList:[]}
                    for(let i=0;i<audioPairList.length;i++){
                        let audioList = audioPairList[i].audioList
                        for(let j=0;j<audioList.length;j++){
                            if(audioList[j].score==="1-0") audioPair2.audioList.push(audioList[j])
                            else audioPair3.audioList.push(audioList[j])
                        }
                    }
                    audioPairList[this.stage-1] = audioPair2
                    audioPairList[this.stage] = audioPair3
                }
                this.$storage.set('audioPairList', audioPairList)
            }

            let step = Number(this.$storage.get('stepActive'))
            let stages = this.$storage.getObj('stages')
            // 对应计数器++
            stages[step]++
            this.$storage.set('stages', stages)

            if (Number(this.stage) >= 7 && step === 1) {
                // 结束第2轮！
                let scoreList = eval(this.$storage.getObj('resultOfStep1'))
                this.$http({
                    url: this.$api.submitStep2,
                    method: "post",
                    data: scoreList
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
            } else if (Number(this.stage) >= 5 && step === 2) {
                // 结束第3轮！
                let scoreList = eval(this.$storage.getObj('resultOfStep1'))
                this.$http({
                    url: this.$api.submitStep3,
                    method: "post",
                    data: scoreList
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
            } else if (Number(this.stage) >= 3 && step === 3) {
                // 结束第4轮！
                let audioPairList = eval(this.$storage.getObj('audioPairList'))
                let params={}
                params.uid = Number(this.$storage.get('userid'))
                this.$http({
                    url: this.$api.submitStep4,
                    method: "post",
                    data: audioPairList,
                    params: params
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
            } else if (Number(this.stage) >= 3 && step === 4) {
                // 结束第5轮！
                let audioPairList = eval(this.$storage.getObj('audioPairList'))
                let params={}
                params.uid = Number(this.$storage.get('userid'))
                this.$http({
                    url: this.$api.submitStep5,
                    method: "post",
                    data: audioPairList,
                    params:params
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
        },
        update(value) {
            console.log(value)
            this.audios = value
        },
        updateAudioPairList() {
            console.log(this.$storage.getObj('audioPairList')[this.stage % 2 === 0 ? this.stage : this.stage - 1])
            let audioPairList = this.$storage.getObj('audioPairList')
            let audioList = []
            if (this.stage % 2 === 0) {
                // 第一次冒泡
                audioList = audioPairList[this.stage/2].audioList
                audioList[0] = this.audios[0].processMode === 1 ? this.audios[1] : this.audios[0]
                audioList[1] = this.audios[0].processMode === 1 ? this.audios[0] : this.audios[1]
            }else{
                // second
                audioList = audioPairList[(this.stage-1)/2].audioList
                audioList[1] = this.audios[0].processMode === 1 ? this.audios[1] : this.audios[0]
                audioList[2] = this.audios[0].processMode === 1 ? this.audios[0] : this.audios[1]
            }
            this.$storage.set('audioPairList', audioPairList)
        },
        addScore(audio){
            if(audio.score===null) audio.score = "0-0"
            let strs = audio.score.split("-")
            audio.score = (Number(strs[0])+1).toString()+"-"+strs[1]
        },
        subScore(audio){
            if(audio.score===null) audio.score = "0-0"
            let strs = audio.score.split("-")
            audio.score = strs[0]+"-"+(Number(strs[1])+1).toString()
        }
    }
}
</script>
<style scoped>
.audioPlayer {
    display: inline-block;
}

</style>
