<template>
    <div>
<!--        <div>-->
            <div style="float:left">
                <span style="margin-right: 0.5em">LOOP</span><el-switch v-model="isLoop"></el-switch>
<!--                <span style="float: right">当前播放：{{this.currentAudio==='referAudio'?'参考音频':(this.currentAudio==='audio1'?'音频A':'音频B')}}</span>-->
            </div>

            <div style="width: 100%; height:4em;display: flex">
                <el-button style="margin: auto" size="big" v-if="!isPlaying" @click="play" type="primary" icon="el-icon-video-play">播放</el-button>
                <el-button style="margin: auto" v-if="isPlaying" @click="play" type="primary" icon="el-icon-video-pause">暂停</el-button>
            </div>
            <audio @ended="overPlay" :loop="isLoop" :muted="isMutedRefer" ref="referAudio" :src="myAudios[0].url"></audio>
            <audio @ended="overPlay" :loop="isLoop" :muted="isMutedAudio1" ref="audio1" :src="myAudios[1].url"></audio>
            <audio @ended="overPlay" :loop="isLoop" :muted="isMutedAudio2" ref="audio2" :src="myAudios[2].url"></audio>
            <el-button @click="clickRefer">参考音频</el-button>
<!--        </div>-->

        <div style="display: flex;margin-top: 1em">
            <div style="width: 10%; color: #e74c3c">前</div>
            <draggable style="width: 80%" @end="onEnd" v-model="myAudios" chosen-class="chosen" force-fallback="true" fallbackTolerance="3" group="material" animation="1000">
                <transition-group style="height: 7em; display: flex">
                    <template v-for="(element, index) in myAudios">
                        <drag-item @itemClick="clickAudio(element)" class="item" :key="element.name" :index="index" :audio="element">
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
    components:{draggable, dragItem},
    name: "ThreeAudio",
    props:{

        audioList:{
            type:Array,
            default:() => []
        },
    },
    data(){
        return{
            myAudios: this.audioList,

            isPlaying:false,

            audioRefs:['referAudio','audio1','audio2'],

            currentAudio:'referAudio',

            isMutedRefer:true,
            isMutedAudio1:true,
            isMutedAudio2:false,

            isLoop:true,


        }
    },
    mounted() {

    },
    methods:{
        play(){
            if(this.$refs.audio1.paused && this.$refs.audio2.paused && this.$refs.referAudio.paused){
                for(let i=0;i<this.audioRefs.length;i++){
                    if(this.audioRefs[i]===this.currentAudio) continue
                    this.$refs[this.audioRefs[i]].muted=true
                }

                this.$refs.audio1.play()
                this.$refs.audio2.play()
                this.$refs.referAudio.play()

                this.isPlaying=true
            }else{
                this.$refs.audio1.pause()
                this.$refs.audio2.pause()
                this.$refs.referAudio.pause()

                this.isPlaying=false
            }
        },
        clickAudio(element){
            console.log(index)
            if(index===0){
                this.$refs.audio1.muted=false
                this.$refs.audio2.muted=true
                this.$refs.referAudio.muted=true
                this.currentAudio="audio1"
            }else{
                this.$refs.audio1.muted=true
                this.$refs.audio2.muted=false
                this.$refs.referAudio.muted=true
                this.currentAudio="audio2"
            }
            this.$emit("onChildClick", this.myAudios[index].formName)
        },
        clickRefer(){
            this.$refs.audio1.muted=true
            this.$refs.audio2.muted=true
            this.$refs.referAudio.muted=false
            this.currentAudio="referAudio"
        },
        clickLoop(){
            this.isLoop=!this.isLoop
        },
        // end drag
        onEnd(){
            let value=this.myAudios
            console.log(value)
            this.$emit("onChildUpdate", value)
        },
        overPlay(){
            if(!this.isLoop){
                this.isPlaying=false
            }
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

.chosen {
    border: solid 2px #409EFF !important;
}
</style>
