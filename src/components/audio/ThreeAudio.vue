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
        <audio @ended="overPlay" :loop="isLoop" ref="参考音频" :src="urls[0]"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频A" :src="urls[1]"></audio>
        <audio @ended="overPlay" :loop="isLoop" ref="音频B" :src="urls[2]"></audio>
<!--        <el-button @click="clickRefer">参考音频</el-button>-->
        <!--        </div>-->

        <div style="display: flex;margin-top: 1em">
            <div style="width: 10%; color: #e74c3c">前</div>
            <draggable style="width: 80%;height: 6em" @end="onEnd" v-model="myAudios" chosen-class="chosen" force-fallback="true"
                       fallbackTolerance="3" group="material" animation="1000">
                <transition-group style="height: 100%; display: flex">
                    <template v-for="(element, index) in myAudios">
                        <drag-item @itemClick="clickAudio(element)" :class="currentAudio === element.formName ? 'activeItem':'item'" :key="element.formName" :index="index"
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
                    "material": 1
                },
                {
                    "id": 1,
                    "name": "音频1",
                    "formName": "音频A",
                    "url": "https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_back1__L.wav",
                    "processMode": 1,
                    "algorithm": 1,
                    "material": 1
                },
                {
                    "id": 9,
                    "name": "音频9",
                    "formName":"音频B",
                    "url": "https://audio-practice.oss-cn-hangzhou.aliyuncs.com/%E6%9E%AA%E5%A3%B0/%E6%9E%AA%E5%A3%B0_HRTF_back9__L.wav",
                    "processMode": 1,
                    "algorithm": 9,
                    "material": 1
                }
            ]
        },
    },
    data() {
        return {
            myAudios: this.audioList,

            isPlaying: false,

            audioRefs: ['参考音频', '音频A', '音频B'],

            currentAudio: '参考音频',

            isMutedRefer: true,
            isMutedAudio1: true,
            isMutedAudio2: false,

            isLoop: true,

            urls:[]
        }
    },
    mounted() {
        for(let i=0;i<this.audioList.length;i++){
            this.urls.push(this.audioList[i].url)
        }
        // this.play()
    },
    methods: {
        play() {
            if (this.$refs['音频A'].paused && this.$refs['音频B'].paused && this.$refs['参考音频'].paused) {
                for (let i = 0; i < this.audioRefs.length; i++) {
                    if (this.audioRefs[i] === this.currentAudio) continue
                    this.$refs[this.audioRefs[i]].muted = true
                }

                this.$refs['音频A'].play()
                this.$refs['音频B'].play()
                this.$refs['参考音频'].play()

                this.isPlaying = true
            } else {
                this.$refs['音频A'].pause()
                this.$refs['音频B'].pause()
                this.$refs['参考音频'].pause()

                this.isPlaying = false
            }
        },
        clickAudio(element) {
            console.log(element)
            if (element.formName === "参考音频") {
                this.$refs['音频A'].muted = true
                this.$refs['音频B'].muted = true
                this.$refs['参考音频'].muted = false
            } else if(element.formName === "音频A"){
                this.$refs['音频A'].muted = false
                this.$refs['音频B'].muted = true
                this.$refs['参考音频'].muted = true
            } else if(element.formName === "音频B"){
                this.$refs['音频A'].muted = true
                this.$refs['音频B'].muted = false
                this.$refs['参考音频'].muted = true
            }
            this.currentAudio = element.formName
            this.$emit("onChildClick", element.formName)
        },
        clickLoop() {
            this.isLoop = !this.isLoop
        },
        // end drag
        onEnd() {
            let value = this.myAudios
            console.log(value)
            console.log(this.audioList)
            this.$emit("onChildUpdate", value)
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
</style>
