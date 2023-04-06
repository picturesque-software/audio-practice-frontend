<template>
    <div>
        <div style="float:left">
            <span style="margin-right: 0.5em">LOOP</span>
            <el-switch v-model="isLoop"></el-switch>
        </div>

        <div style="width: 100%; height:4em;display: flex">
            <el-button style="margin: auto" size="big" v-if="!isPlaying" @click="play" type="primary"
                       icon="el-icon-video-play">播放
            </el-button>
            <el-button style="margin: auto" v-if="isPlaying" @click="play" type="primary" icon="el-icon-video-pause">
                暂停
            </el-button>
        </div>
        <div style="display: flex">
            <div style="margin: auto;width: 50%">
                <span>混响调节</span>
                <el-slider
                    @change="changeReverb"
                    class="slider"
                    v-model="reverb"
                    :step="1"
                    :max="2"
                    :min="0"
                    :marks="marksReverb"
                    :format-tooltip="formatTooltipReverb"
                    :show-tooltip="false"
                    show-stops>
                </el-slider>
            </div>
        </div>
        <audio @ended="overPlay" :loop="isLoop" ref="参考音频reverb0" :src="constAudios[0].url"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="参考音频reverb1" :src="constAudios[0].reverb1"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="参考音频reverb2" :src="constAudios[0].reverb2"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Areverb0" :src="constAudios[1].url"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Areverb1" :src="constAudios[1].reverb1"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Areverb2" :src="constAudios[1].reverb2"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Breverb0" :src="constAudios[2].url"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Breverb1" :src="constAudios[2].reverb1"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Breverb2" :src="constAudios[2].reverb2"></audio>
<!--        <el-button @click="clickRefer">参考音频</el-button>-->
        <!--        </div>-->

        <div style="display: flex;margin-top: 1em">
            <div style="width: 10%; color: #e74c3c">前</div>
            <draggable style="width: 80%;height: 6em" @end="onEnd" v-model="myAudios" chosen-class="chosen" force-fallback="true"
                       fallbackTolerance="3" group="material" animation="1000">
                <transition-group style="height: 100%; display: flex">
                    <template v-for="(element, index) in myAudios">
                        <drag-item @itemClick="clickAudio(element)" :class="currentFormAudio === element.formName ? 'activeItem':'item'" :key="element.formName" :index="index"
                                   :audio="element">
                        </drag-item>
                    </template>
                </transition-group>
            </draggable>
            <div style="width: 10%; color: #e74c3c">后</div>
        </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import dragItem from './DragItem'

export default {
    components: {draggable, dragItem},
    name: "ThreeAudio",
    props: {
        tabIndex:{
            type: Number,
            default:0
        },
        audioList: {
            type: Array,
            default: () => [
                {
                    "id": 17,
                    "name": "参考音频",
                    "formName": "参考音频",
                    "url": "https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B02k-3.5k.wav",
                    "processMode": 0,
                    "algorithm": 0,
                    "material": 1,
                    "reverb1":"https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_front5__L.wav",
                    "reverb2":"https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_front6__L.wav",

                },
                {
                    "id": 1,
                    "name": "音频1",
                    "formName": "音频A",
                    "url": "https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_back1__L.wav",
                    "processMode": 1,
                    "algorithm": 1,
                    "material": 1,
                    "reverb1":"https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_front8__L.wav",
                    "reverb2":"https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_front9__L.wav",
                },
                {
                    "id": 9,
                    "name": "音频9",
                    "formName":"音频B",
                    "url": "https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_back9__L.wav",
                    "processMode": 1,
                    "algorithm": 9,
                    "material": 1,
                    "reverb1":"https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_front16__L.wav",
                    "reverb2":"https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_front14__L.wav",
                }
            ]
        },
    },
    data() {
        return {
            reverb: 0,
            marksReverb:{
                0: '未处理',
                1: '轻微混响',
                2: '较大混响'
            },

            constAudios:this.audioList,
            myAudios: this.audioList,

            isPlaying: false,

            audioRefs: ['参考音频reverb0','参考音频reverb1','参考音频reverb2', '音频Areverb0', '音频Areverb1', '音频Areverb2', '音频Breverb0', '音频Breverb1', '音频Breverb2'],

            currentAudio: '参考音频reverb0',
            currentFormAudio:'参考音频',

            isLoop: true,

            urls:[]
        }
    },
    created() {
        console.log(this.audioList)
    },
    methods: {
        changeReverb(val){
            if(! (this.currentAudio.at(this.currentAudio.length-1) === val.toString()) ){
                console.log(val)
                if(this.currentFormAudio==='参考音频'){
                    for(let i=0;i<3;i++){
                        if(i===val){
                            this.$refs['参考音频reverb'+i].muted = false
                            this.$refs['音频Areverb'+i].muted = true
                            this.$refs['音频Breverb'+i].muted = true
                        }else{
                            this.$refs['参考音频reverb'+i].muted = true
                            this.$refs['音频Areverb'+i].muted = true
                            this.$refs['音频Breverb'+i].muted = true
                        }
                    }
                    this.currentAudio = '参考音频reverb'+val
                }else if(this.currentFormAudio==='音频A'){
                    for(let i=0;i<3;i++){
                        if(i===val){
                            this.$refs['参考音频reverb'+i].muted = true
                            this.$refs['音频Areverb'+i].muted = false
                            this.$refs['音频Breverb'+i].muted = true
                        }else{
                            this.$refs['参考音频reverb'+i].muted = true
                            this.$refs['音频Areverb'+i].muted = true
                            this.$refs['音频Breverb'+i].muted = true
                        }
                    }
                    this.currentAudio = '音频Areverb'+val
                }else{
                    for(let i=0;i<3;i++){
                        if(i===val){
                            this.$refs['参考音频reverb'+i].muted = true
                            this.$refs['音频Areverb'+i].muted = true
                            this.$refs['音频Breverb'+i].muted = false
                        }else{
                            this.$refs['参考音频reverb'+i].muted = true
                            this.$refs['音频Areverb'+i].muted = true
                            this.$refs['音频Breverb'+i].muted = true
                        }
                    }
                    this.currentAudio = '音频Breverb'+val
                }
            }
        },
        formatTooltipReverb(val){
            if(val===0){
                return '未处理'
            }else if(val===1){
                return  '轻微混响'
            }else{
                return '较大混响'
            }
        },
        play() {
            if (!this.isPlaying) {
                for (let i = 0; i < this.audioRefs.length; i++) {
                    if (this.audioRefs[i] === this.currentAudio) continue
                    this.$refs[this.audioRefs[i]].muted = true
                }

                for(let i = 0;i < 3; i++){
                    this.$refs['音频Areverb'+i].play()
                    this.$refs['音频Breverb'+i].play()
                    this.$refs['参考音频reverb'+i].play()
                }

                this.isPlaying = true
            } else {
                for(let i = 0;i < 3; i++){
                    this.$refs['音频Areverb'+i].pause()
                    this.$refs['音频Breverb'+i].pause()
                    this.$refs['参考音频reverb'+i].pause()
                }

                this.isPlaying = false
            }
        },
        clickAudio(element) {
            console.log(element)
            if (element.formName === "参考音频") {
                for(let i=0;i<3;i++){
                    if(i===0){
                        this.$refs['参考音频reverb'+i].muted = false
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = true
                    }else{
                        this.$refs['参考音频reverb'+i].muted = true
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = true
                    }
                }
            } else if(element.formName === "音频A"){
                for(let i=0;i<3;i++){
                    if(i===0){
                        this.$refs['参考音频reverb'+i].muted = true
                        this.$refs['音频Areverb'+i].muted = false
                        this.$refs['音频Breverb'+i].muted = true
                    }else{
                        this.$refs['参考音频reverb'+i].muted = true
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = true
                    }
                }
            } else if(element.formName === "音频B"){
                for(let i=0;i<3;i++){
                    if(i===0){
                        this.$refs['参考音频reverb'+i].muted = true
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = false
                    }else{
                        this.$refs['参考音频reverb'+i].muted = true
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = true
                    }
                }
            }
            this.reverb=0
            this.currentAudio = element.formName+'reverb0'
            this.currentFormAudio = element.formName
            this.$emit("onChildClick", element.formName)
            console.log("after click")
            console.log(this.currentAudio)
        },
        clickLoop() {
            this.isLoop = !this.isLoop
        },
        // end drag
        onEnd() {
            let value = this.myAudios
            console.log(value)
            this.$emit("onChildUpdate", value)
        },
        overPlay() {
            if (!this.isLoop) {
                this.isPlaying = false
            }
        },
        getIsPlaying(){
            return this.isPlaying
        }
    }
}
</script>

<style scoped>
.item {
    width: 40%;
    height: 100%;
    padding: 6px;
    display: flex;
    background-color: #fdfdfd;
    border: solid 2px #989595;
    margin: auto;
    cursor: move;
}

.item:active {
    background-color: #d3d1d1;
    cursor: move;
}
.activeItem{
    width: 40%;
    height: 100%;
    padding: 6px;
    display: flex;
    background-color: rgba(133, 190, 245, 0.99);
    border: solid 2px #989595;
    margin: auto;
    cursor: move;
}
.chosen {
    border: solid 2px #409EFF !important;
}
.slider{
    /* fix slider last Chinese mark not breaking properly */
    word-break: keep-all;
}
</style>
