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

        <audio @ended="overPlay" :loop="isLoop" ref="音频Areverb0" :src="constAudios[0].url"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Areverb1" :src="constAudios[0].reverb1"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Areverb2" :src="constAudios[0].reverb2"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Breverb0" :src="constAudios[1].url"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Breverb1" :src="constAudios[1].reverb1"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频Breverb2" :src="constAudios[1].reverb2"></audio>

        <div style="display: flex;margin-top: 2em; height: 8em">
            <div style="width: 10%; color: #e74c3c">前</div>
            <draggable style="width: 80%" @end="onEnd" v-model="myAudios" chosen-class="chosen" force-fallback="true"
                       fallbackTolerance="3" group="material" animation="1000">
                <transition-group style="height: 7em; display: flex">
                    <template v-for="(element, index) in myAudios">
                        <drag-item @itemClick="clickAudio(element)" :class="currentFormAudio === element.formName ? 'activeItem':'item'" :key="element.name" :index="index"
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
    name: "TwoAudio",
    props: {
        audios: {
            type: Array,
            default: () => []
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
            myAudios: this.audios,
            constAudios:this.audios,

            isPlaying: false,

            audioRefs: ['音频Areverb0', '音频Areverb1', '音频Areverb2', '音频Breverb0', '音频Breverb1', '音频Breverb2'],

            currentAudio: '音频Areverb0',
            currentFormAudio:'音频A',

            isLoop: true,

        }
    },
    created() {
      console.log(this.audios)
    },
    mounted() {

    },
    methods: {
        changeReverb(val){
            if(! (this.currentAudio.at(this.currentAudio.length-1) === val.toString()) ){
                console.log(val)
                if(this.currentFormAudio==='音频A'){
                    for(let i=0;i<3;i++){
                        if(i===val){
                            this.$refs['音频Areverb'+i].muted = false
                            this.$refs['音频Breverb'+i].muted = true
                        }else{
                            this.$refs['音频Areverb'+i].muted = true
                            this.$refs['音频Breverb'+i].muted = true
                        }
                    }
                    this.currentAudio = '音频Areverb'+val
                }else{
                    for(let i=0;i<3;i++){
                        if(i===val){
                            this.$refs['音频Areverb'+i].muted = true
                            this.$refs['音频Breverb'+i].muted = false
                        }else{
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
                }

                this.isPlaying = true
            } else {
                for(let i = 0;i < 3; i++){
                    this.$refs['音频Areverb'+i].pause()
                    this.$refs['音频Breverb'+i].pause()
                }

                this.isPlaying = false
            }
        },
        clickAudio(element) {
            if(element.formName === "音频A"){
                for(let i=0;i<3;i++){
                    if(i===0){
                        this.$refs['音频Areverb'+i].muted = false
                        this.$refs['音频Breverb'+i].muted = true
                    }else{
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = true
                    }
                }
            } else if(element.formName === "音频B"){
                for(let i=0;i<3;i++){
                    if(i===0){
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = false
                    }else{
                        this.$refs['音频Areverb'+i].muted = true
                        this.$refs['音频Breverb'+i].muted = true
                    }
                }
            }
            this.reverb=0
            this.currentAudio = element.formName+'reverb0'
            this.currentFormAudio = element.formName
            console.log("after click")
            console.log(this.currentAudio)
        },
        clickLoop() {
            this.isLoop = !this.isLoop
        },
        onEnd() {
            let value = this.myAudios
            console.log(value)
            this.$emit("update", value)
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

* {
    user-select: none;
    -webkit-user-select: none;
}

input, textarea {
    user-select: text;
    -webkit-user-select: text;
}
.slider{
    /* fix slider last Chinese mark not breaking properly */
    word-break: keep-all;
}
</style>
