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
        <audio @ended="overPlay" :loop="isLoop" :muted="isMutedAudio1" ref="音频A" :src="urls[0]"></audio>
        <audio @ended="overPlay" :loop="isLoop" :muted="isMutedAudio2" ref="音频B" :src="urls[1]"></audio>
        <!--        </div>-->

        <div style="display: flex;margin-top: 1em">
            <div style="width: 10%; color: #e74c3c">前</div>
            <draggable style="width: 80%" @end="onEnd" v-model="myAudios" chosen-class="chosen" force-fallback="true"
                       fallbackTolerance="3" group="material" animation="1000">
                <transition-group style="height: 7em; display: flex">
                    <template v-for="(element, index) in myAudios">
                        <drag-item @itemClick="clickAudio(element)" :class="currentAudio === element.formName ? 'activeItem':'item'" :key="element.name" :index="index"
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
            myAudios: this.audios,

            isPlaying: false,

            audioRefs: ['音频A', '音频B'],

            currentAudio: '音频A',

            isMutedAudio1: true,
            isMutedAudio2: false,

            isLoop: true,

            urls:[]
        }
    },
    mounted() {
        console.log(this.myAudios)
        for(let i=0;i<this.audios.length;i++){
            this.urls.push(this.audios[i].url)
        }
        // this.play()
    },
    methods: {
        play() {
            if (this.$refs['音频A'].paused && this.$refs['音频B'].paused) {
                for (let i = 0; i < this.audioRefs.length; i++) {
                    if (this.audioRefs[i] === this.currentAudio) continue
                    this.$refs[this.audioRefs[i]].muted = true
                }

                this.$refs['音频A'].play()
                this.$refs['音频B'].play()

                this.isPlaying = true
            } else {
                this.$refs['音频A'].pause()
                this.$refs['音频B'].pause()

                this.isPlaying = false
            }
        },
        clickAudio(element) {
            if (element.formName==='音频A') {
                this.$refs['音频A'].muted = false
                this.$refs['音频B'].muted = true
                this.currentAudio = "音频A"
            } else {
                this.$refs['音频A'].muted = true
                this.$refs['音频B'].muted = false
                this.currentAudio = "音频B"
            }
            this.$emit("onChildClick", element.formName)
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
</style>
