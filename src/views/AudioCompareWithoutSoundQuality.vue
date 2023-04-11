<template>
    <div
        style="margin: 2px"
        v-loading="loading"
        element-loading-text="提交中"
        element-loading-spinner="el-icon-loading"
    >
        <p>评测流程：默认播放<span style="color:red">音频A</span>。</p>
        <p>点击待评测音频AB方块以切换听音，并拖动方块对音频AB进行排序。<span style="color:red">注意前后~</span></p>
        <el-tabs
            @tab-click="changeTab"
            :stretch="true"
        >
            <el-tab-pane>
                <span slot="label"><i class="el-icon-wind-power"></i> 枪声</span>
                <two-audio
                    ref="thAudio0"
                    :audios="audios[0]"
                    @update="update"
                ></two-audio>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-position"></i> 脚步</span>
                <two-audio
                    ref="thAudio1"
                    :audios="audios[1]"
                    @update="update"
                ></two-audio>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-male"></i> 男声</span>
                <two-audio
                    ref="thAudio2"
                    :audios="audios[2]"
                    @update="update"
                ></two-audio>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-female"></i> 女声</span>
                <two-audio
                    ref="thAudio3"
                    :audios="audios[3]"
                    @update="update"
                ></two-audio>
            </el-tab-pane>
        </el-tabs>

        <el-button
            v-if="(Number(this.stage) === 15 && step === 1) || (Number(this.stage) === 11 && step === 2) || (Number(this.stage) === 7 && step === 3) || (Number(this.stage) === 7 && step === 4)"
            style="margin-top: 3em" type="primary" @click="onNext">提交
        </el-button>
        <el-button v-else style="margin-top: 3em" type="primary" @click="onNext">下一步</el-button>
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
            tabIndex: 0,
            marks: {
                0: '差异较大',
                1: '有一定偏差',
                2: '与参考相近'
            },
            loading: false,
            step: '',
            stage: '',
            // 用于第五轮瑞士轮迭代
            firstIndex: '',
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
            for (let i = 0; i < 4; i++) {
                this.audios.push(audioPairList[this.stage * 4 + i].audioList)
            }
        } else if (step === 3) {
            // 冒泡比较
            for (let i = 0; i < 4; i++) this.audios.push([])
            if (this.stage % 2 === 0) {
                // 首次,【0和1】
                for (let i = 0; i < 2; i++) {
                    this.audios[0].push(audioPairList[(this.stage / 2) * 3 + i].audioList[0])
                    this.audios[1].push(audioPairList[(this.stage / 2) * 3 + i].audioList[1])
                    this.audios[2].push(audioPairList[(this.stage / 2) * 3 + i].audioList[2])
                    this.audios[3].push(audioPairList[(this.stage / 2) * 3 + i].audioList[3])
                }
            } else {
                // 首次,【0和1】
                for (let i = 1; i <= 2; i++) {
                    this.audios[0].push(audioPairList[(this.stage - 1) / 2 * 3 + i].audioList[0])
                    this.audios[1].push(audioPairList[(this.stage - 1) / 2 * 3 + i].audioList[1])
                    this.audios[2].push(audioPairList[(this.stage - 1) / 2 * 3 + i].audioList[2])
                    this.audios[3].push(audioPairList[(this.stage - 1) / 2 * 3 + i].audioList[3])
                }
            }
        } else {
            // firstIndex * 4为音频真正下标
            if (this.stage % 4 < 2) {
                if (this.stage % 2 === 0) {
                    this.firstIndex = this.stage / 2
                } else {
                    this.firstIndex = (this.stage + 1) / 2
                }
            } else {
                if (this.stage % 2 === 0) {
                    this.firstIndex = (this.stage - 2) / 2
                } else {
                    this.firstIndex = (this.stage - 1) / 2
                }
            }
            for (let i = 0; i < 4; i++) {
                this.audios.push(audioPairList[this.firstIndex * 4 + i].audioList)
            }
        }
        for (let i = 0; i < 4; i++) {
            this.audios[i][0].formName = '音频A'
            this.audios[i][1].formName = '音频B'
        }
        console.log(this.audios)
        this.$nextTick(() => {
            this.$refs.thAudio0.play()
        })
    },
    mounted() {

    },

    methods: {
        changeTab(tab) {
            if (this.$refs["thAudio" + this.tabIndex].getIsPlaying()) {
                // 如果原tab在放，则停一下
                this.$refs["thAudio" + this.tabIndex].play()
            }

            this.tabIndex = Number(tab.index)
            this.$refs["thAudio" + this.tabIndex].play()
            console.log("dad" + tab.index)
        },
        onNext() {
            if (this.step < 3) {
                // 存排序序列
                let order = []
                for (let i = 0; i < this.audios[this.tabIndex].length; i++) {
                    order.push(this.audios[this.tabIndex][i].aid)
                }
                for (let i = 0; i < this.audios[this.tabIndex].length; i++) {
                    this.audios[this.tabIndex][i].order = order
                    this.audios[this.tabIndex][i].uid = Number(this.$storage.get('userid'))
                    // 存入localStorage
                    let result = this.$storage.getObj('resultOfStep1')
                    result = eval(result)
                    result[2 * Number(this.stage) + i] = this.audios[this.tabIndex][i]
                    console.log(result)
                    this.$storage.set('resultOfStep1', result)
                }
            } else if (this.step === 3) {
                this.updateAudioPairList()
            } else if (this.step === 4) {
                let audioPairList = this.$storage.getObj('audioPairList')
                // 更新分数
                if (this.audios[this.tabIndex][0].algorithm === audioPairList[this.firstIndex * 4].audioList[0].algorithm) {
                    // 顺序没变
                    if (this.audios[this.tabIndex][0].processMode === 1) {
                        this.addScore(audioPairList[this.firstIndex * 4].audioList[0])
                        this.subScore(audioPairList[this.firstIndex * 4].audioList[1])
                    }else{
                        this.addScore(audioPairList[this.firstIndex * 4].audioList[1])
                        this.subScore(audioPairList[this.firstIndex * 4].audioList[0])
                    }
                } else {
                    // 顺序变了
                    if (this.audios[this.tabIndex][0].processMode === 1) {
                        this.addScore(audioPairList[this.firstIndex * 4].audioList[1])
                        this.subScore(audioPairList[this.firstIndex * 4].audioList[0])
                    }else{
                        this.addScore(audioPairList[this.firstIndex * 4].audioList[0])
                        this.subScore(audioPairList[this.firstIndex * 4].audioList[1])
                    }
                }
                this.$storage.set('audioPairList', audioPairList)
                audioPairList = this.$storage.getObj('audioPairList')

                // 0 1(update) 2 3   4 5(update) 6 7
                if (this.stage % 4 === 1) {
                    // update 2 3
                    // 暂存组好的于两个数组
                    let audioPair2 = [{audioList: []}, {audioList: []}, {audioList: []}, {audioList: []}]
                    let audioPair3 = [{audioList: []}, {audioList: []}, {audioList: []}, {audioList: []}]
                    for (let i = this.firstIndex - 1; i < this.firstIndex + 1; i++) {
                        let audioFirstPairList = audioPairList[i * 4].audioList
                        for (let j = 0; j < audioFirstPairList.length; j++) {
                            if (audioFirstPairList[j].score === "1-0") {
                                // 入1-0的
                                for (let m = 0; m < 4; m++) {
                                    audioPair2[m].audioList.push(audioPairList[i * 4 + m].audioList[j])
                                }
                            } else {
                                // 入0-1的
                                for (let m = 0; m < 4; m++) {
                                    audioPair3[m].audioList.push(audioPairList[i * 4 + m].audioList[j])
                                }
                            }
                        }
                    }
                    // 放回原数组
                    for (let i = this.firstIndex - 1; i < this.firstIndex + 1; i++) {
                        if (i === this.firstIndex - 1) {
                            for (let m = 0; m < 4; m++) {
                                audioPairList[i * 4 + m] = audioPair2[m]
                            }
                        } else {
                            // 入0-1的
                            for (let m = 0; m < 4; m++) {
                                audioPairList[i * 4 + m] = audioPair3[m]
                            }
                        }
                    }
                }
                this.$storage.set('audioPairList', audioPairList)
            }

            let step = Number(this.$storage.get('stepActive'))
            let stages = this.$storage.getObj('stages')
            // 对应计数器++
            stages[step]++
            this.$storage.set('stages', stages)

            if (Number(this.stage) === 15 && step === 1) {
                // 结束第2轮！
                this.loading = true
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
                        this.loading = false
                        this.$router.push({path: '/finishStep2'})
                    } else {
                        this.$message.error(data.msg);
                    }
                });
                return;
            } else if (Number(this.stage) === 11 && step === 2) {
                // 结束第3轮！
                this.loading = true
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
                        this.loading = false
                        this.$router.push({path: '/finishStep3'})
                    } else {
                        this.$message.error(data.msg);
                    }
                });
                return;
            } else if (Number(this.stage) === 7 && step === 3) {
                // 结束第4轮！
                this.loading = true
                let audioPairList = eval(this.$storage.getObj('audioPairList'))
                let params = {}
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
                        this.loading = false
                        this.$router.push({path: '/finishStep4'})
                    } else {
                        this.$message.error(data.msg);
                    }
                });
                return;
            } else if (Number(this.stage) === 7 && step === 4) {
                // 结束第5轮！
                this.loading = true
                let audioPairList = eval(this.$storage.getObj('audioPairList'))
                let params = {}
                params.uid = Number(this.$storage.get('userid'))
                this.$http({
                    url: this.$api.submitStep5,
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
                        this.loading = false
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
            this.audios[this.tabIndex] = value
        },
        updateAudioPairList() {
            let audioPairList = this.$storage.getObj('audioPairList')
            let firstIndex = this.stage % 2 === 0 ? (this.stage / 2) * 3 : (this.stage - 1) / 2 * 3 + 1
            // 冒泡，吧比较好的移到后一个
            if (this.audios[this.tabIndex][0].processMode === 1) {
                if (this.audios[this.tabIndex][0].algorithm === audioPairList[firstIndex].audioList[0].algorithm) {
                    let temp = audioPairList[firstIndex]
                    audioPairList[firstIndex] = audioPairList[firstIndex + 1]
                    audioPairList[firstIndex + 1] = temp
                }
            } else {
                if (this.audios[this.tabIndex][0].algorithm !== audioPairList[firstIndex].audioList[0].algorithm) {
                    let temp = audioPairList[firstIndex]
                    audioPairList[firstIndex] = audioPairList[firstIndex + 1]
                    audioPairList[firstIndex + 1] = temp
                }
            }
            this.$storage.set('audioPairList', audioPairList)
        },
        addScore(audio) {
            if (audio.score === null) audio.score = "0-0"
            let strs = audio.score.split("-")
            audio.score = (Number(strs[0]) + 1).toString() + "-" + strs[1]
        },
        subScore(audio) {
            if (audio.score === null) audio.score = "0-0"
            let strs = audio.score.split("-")
            audio.score = strs[0] + "-" + (Number(strs[1]) + 1).toString()
        }
    }
}
</script>
<style scoped>
.audioPlayer {
    display: inline-block;
}

</style>
