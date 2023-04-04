<template>
    <div style="margin: 2px"
         v-loading="loading"
         element-loading-text="提交中"
         element-loading-spinner="el-icon-loading"
    >
        <p>评测流程：默认播放<span style="color:red">参考音频</span>。点击待评测音频AB方块以切换听音，并以参考音频为基准进行音色评价。最后请拖动对音频A、B以及参考音频进行前后听感排序（可调节音频混响来辅助判断）。<span style="color:red">注意前后哦~</span></p>
        <el-tabs
            @tab-click="changeTab"
            :stretch="true"
        >
            <el-tab-pane>
                <span slot="label"><i class="el-icon-wind-power"></i> 枪声</span>
                <three-audio
                    ref="thAudio0"
                    :audioList="audios[0]"
                    @onChildUpdate="onChildUpdate"
                    @onChildClick="onChildClick"
                ></three-audio>
                <el-divider></el-divider>
                <div>
                        <el-form :model="ruleForm0" :rules="rules" ref="ruleForm"
                                 size="mini">
                            <div v-show="currentSelectAudio0==='音频A'">
                                <el-form-item label="音色评价" prop="quality1">
                                    <div style="width: 50%; margin-left: 30%">
                                        <el-slider
                                            @change="changeToneScore"
                                            class="slider"
                                            v-model="ruleForm0.quality1"
                                            :step="1"
                                            :max="2"
                                            :min="0"
                                            :marks="marks"
                                            :show-tooltip="false"
                                            show-stops>
                                        </el-slider>
                                    </div>
                                </el-form-item>
                            </div>
                            <div v-show="currentSelectAudio0==='音频B'">
                                <el-form-item label="音色评价" prop="quality2">
                                    <div style="width: 50%; margin-left: 30%">
                                        <el-slider
                                            @change="changeToneScore"
                                            class="slider"
                                            v-model="ruleForm0.quality2"
                                            :step="1"
                                            :max="2"
                                            :min="0"
                                            :marks="marks"
                                            :show-tooltip="false"
                                            show-stops>
                                        </el-slider>
                                    </div>
                                </el-form-item>
                            </div>

                        </el-form>
<!--                    </div>-->
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-position"></i> 脚步</span>
                <three-audio
                    ref="thAudio1"
                    :audioList="audios[1]"
                    @onChildUpdate="onChildUpdate"
                    @onChildClick="onChildClick"
                ></three-audio>
                <el-divider></el-divider>
                <div>
                    <el-form :model="ruleForm1" :rules="rules" ref="ruleForm"
                             size="mini">
                        <div v-show="currentSelectAudio1==='音频A'">
                            <el-form-item label="音色评价" prop="quality1">
                                <div style="width: 50%; margin-left: 30%">
                                    <el-slider
                                        @change="changeToneScore"
                                        class="slider"
                                        v-model="ruleForm1.quality1"
                                        :step="1"
                                        :max="2"
                                        :min="0"
                                        :marks="marks"
                                        :format-tooltip="formatTooltipScore"
                                        :show-tooltip="false"
                                        show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                        </div>
                        <div v-show="currentSelectAudio1==='音频B'">
                            <el-form-item label="音色评价" prop="quality2">
                                <div style="width: 50%; margin-left: 30%">
                                    <el-slider
                                        @change="changeToneScore"
                                        class="slider"
                                        v-model="ruleForm1.quality2"
                                        :step="1"
                                        :max="2"
                                        :min="0"
                                        :marks="marks"
                                        :format-tooltip="formatTooltipScore"
                                        :show-tooltip="false"
                                        show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                        </div>

                    </el-form>
                    <!--                    </div>-->
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-male"></i> 男声</span>
                <three-audio
                    ref="thAudio2"
                    :audioList="audios[2]"
                    @onChildUpdate="onChildUpdate"
                    @onChildClick="onChildClick"
                ></three-audio>
                <el-divider></el-divider>
                <div>
                    <el-form :model="ruleForm2" :rules="rules" ref="ruleForm"
                             size="mini">
                        <div v-show="currentSelectAudio2==='音频A'">
                            <el-form-item label="音色评价" prop="quality1">
                                <div style="width: 50%; margin-left: 30%">
                                    <el-slider
                                        @change="changeToneScore"
                                        class="slider"
                                        v-model="ruleForm2.quality1"
                                        :step="1"
                                        :max="2"
                                        :min="0"
                                        :marks="marks"
                                        :format-tooltip="formatTooltipScore"
                                        :show-tooltip="false"
                                        show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                        </div>
                        <div v-show="currentSelectAudio2==='音频B'">
                            <el-form-item label="音色评价" prop="quality2">
                                <div style="width: 50%; margin-left: 30%">
                                    <el-slider
                                        @change="changeToneScore"
                                        class="slider"
                                        v-model="ruleForm2.quality2"
                                        :step="1"
                                        :max="2"
                                        :min="0"
                                        :marks="marks"
                                        :format-tooltip="formatTooltipScore"
                                        :show-tooltip="false"
                                        show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                        </div>

                    </el-form>
                    <!--                    </div>-->
                </div>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-female"></i> 女声</span>
                <three-audio
                    ref="thAudio3"
                    :audioList="audios[3]"
                    @onChildUpdate="onChildUpdate"
                    @onChildClick="onChildClick"
                ></three-audio>
                <el-divider></el-divider>
                <div>
                    <el-form :model="ruleForm3" :rules="rules" ref="ruleForm"
                             size="mini">
                        <div v-show="currentSelectAudio3==='音频A'">
                            <el-form-item label="音色评价" prop="quality1">
                                <div style="width: 50%; margin-left: 30%">
                                    <el-slider
                                        @change="changeToneScore"
                                        class="slider"
                                        v-model="ruleForm3.quality1"
                                        :step="1"
                                        :max="2"
                                        :min="0"
                                        :marks="marks"
                                        :format-tooltip="formatTooltipScore"
                                        :show-tooltip="false"
                                        show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                        </div>
                        <div v-show="currentSelectAudio3==='音频B'">
                            <el-form-item label="音色评价" prop="quality2">
                                <div style="width: 50%; margin-left: 30%">
                                    <el-slider
                                        @change="changeToneScore"
                                        class="slider"
                                        v-model="ruleForm3.quality2"
                                        :step="1"
                                        :max="2"
                                        :min="0"
                                        :marks="marks"
                                        :format-tooltip="formatTooltipScore"
                                        :show-tooltip="false"
                                        show-stops>
                                    </el-slider>
                                </div>
                            </el-form-item>
                        </div>

                    </el-form>
                    <!--                    </div>-->
                </div>
            </el-tab-pane>
        </el-tabs>


        <el-button v-if="(Number(this.stage) === 15)" style="margin-top: 3em" type="primary" @click="onNext">提交</el-button>
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
            tabIndex:0,
            marksReverb:{
                0: '未处理',
                1: '轻微混响',
                2: '较大混响'
            },
            marks:{
                0: '差异较大',
                1: '有一定偏差',
                2: '与参考相近'
            },

            loading:false,

            currentSelectAudio0:'音频A',
            currentSelectAudio1:'音频A',
            currentSelectAudio2:'音频A',
            currentSelectAudio3:'音频A',

            stage: '',

            audios: [],

            ruleForm0: {
                quality1:2,
                quality2:2,
            },
            ruleForm1: {
                quality1:2,
                quality2:2,
            },
            ruleForm2: {
                quality1:2,
                quality2:2,
            },
            ruleForm3: {
                quality1:2,
                quality2:2,
            },
            rules: {
                quality1: [
                    {required: true, message: '请拖动选择合适的一项', trigger: 'blur'},
                ],
                quality2: [
                    {required: true, message: '请拖动选择合适的一项', trigger: 'blur'},
                ],
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
        for(let i=0;i<4;i++){
            let resAudios = this.$storage.getObj('audioPairList')[i*16+ this.stage]
            resAudios.referAudio.formName = '参考音频'
            resAudios.audioList[0].formName = '音频A'
            resAudios.audioList[1].formName = '音频B'
            let audiosItem=[]
            audiosItem.push(resAudios.referAudio)
            audiosItem.push.apply(audiosItem, resAudios.audioList)
            this.audios.push(audiosItem)
        }
        console.log(this.audios)
        this.$nextTick(() => {
            this.$refs.thAudio0.play()
        })
    },
    mounted() {

    },

    methods: {
        changeTab(tab){
            if(this.$refs["thAudio"+this.tabIndex].getIsPlaying()) {
                // 如果原tab在放，则停一下
                this.$refs["thAudio"+this.tabIndex].play()
            }

            this.tabIndex=Number(tab.index)
            this.$refs["thAudio"+this.tabIndex].play()
            console.log("dad" + tab.index)
        },
        formatTooltipScore(val){
            if(val===0){
                return '差异较大'
            }else if(val===1){
                return  '有一定偏差'
            }else{
                return '与参考接近'
            }
        },
        changeToneScore(val){
            console.log("tone score"+val)
        },
        onNext() {
            this.$refs["ruleForm"].validate(valid => {
                if (valid) {
                    // 存排序序列，找referAudio
                    let order = []
                    let referAid;
                    for(let i=0;i<this.audios[this.tabIndex].length;i++){
                        order.push(this.audios[this.tabIndex][i].aid)
                        if(this.audios[this.tabIndex][i].formName==='参考音频'){
                            referAid = this.audios[this.tabIndex][i].aid
                        }
                    }
                    let count=0
                    for(let i=0;i<this.audios[this.tabIndex].length;i++){
                        if(this.audios[this.tabIndex][i].formName==='参考音频') continue
                        if(this.audios[this.tabIndex][i].formName==='音频A'){
                            this.audios[this.tabIndex][i].quality = this[`${'ruleForm' + this.tabIndex}`].quality1
                        }
                        if(this.audios[this.tabIndex][i].formName==='音频B'){
                            this.audios[this.tabIndex][i].quality = this[`${'ruleForm' + this.tabIndex}`].quality2
                        }
                        this.audios[this.tabIndex][i].order = order
                        this.audios[this.tabIndex][i].uid = Number(this.$storage.get('userid'))
                        this.audios[this.tabIndex][i].referAid = referAid
                        // 存入localStorage
                        let result = this.$storage.getObj('resultOfStep1')
                        result = eval(result)
                        result[2 * Number(this.stage) + count] = this.audios[this.tabIndex][i]
                        console.log(result)
                        this.$storage.set('resultOfStep1', result)
                        count++
                    }


                    let step = Number(this.$storage.get('stepActive'))
                    let stages = this.$storage.getObj('stages')
                    // 对应计数器++
                    stages[step]++
                    this.$storage.set('stages', stages)

                    if (Number(this.stage) === 15) {
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
            this.audios[this.tabIndex] = value
            console.log(this.audios)
        },
        onChildClick(value) {
            console.log(value)
            if(value!=='参考音频') this[`${'currentSelectAudio' + this.tabIndex}`] = value==='音频A'?'音频A':'音频B'
        }
    }
}
</script>
<style scoped>
.audioPlayer {
    display: inline-block;
}
.slider{
    /* fix slider last Chinese mark not breaking properly */
    word-break: keep-all;
}

</style>
