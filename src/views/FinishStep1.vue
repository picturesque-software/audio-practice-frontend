<template>
    <div class="jianbian">
        <!-- <el-card>

        </el-card> -->
        <!--        <router-view></router-view>-->
        <h1>很好！你已完成第一阶段的听音</h1>

        <p >接下来，您只需要专注于音频的纵深定位比较，让我们进入第二阶段，继续愉快旅程吧！</p>
        <img src="../assets/home.gif" alt class="gif" />
        <!-- 内容区域 -->
        <!-- <img src="../assets/src=http___p4.itc.cn_q_70_images01_20210506_628477c0733b44ac898ed640b2e473c1.jpeg&refer=http___p4.itc.webp" alt class="tupian-img" /> -->
        <el-button type="primary" @click="enter">进入</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    created() {},
    mounted() {

    },
    methods: {
        enter(){
            let params={}
            params.uid=this.$storage.get('userid')
            this.$http({
                url: this.$api.getAudiosStep2,
                method: "get",
                params: params
            }).then(({data}) => {
                if (data && data.code === "0") {
                    let audioPairList = data.data
                    this.$storage.set('audioPairList', audioPairList)
                    console.log(this.$storage.getObj('audioPairList'))
                    // step
                    this.$storage.set('stepActive',1)
                    let stages = this.$storage.getObj('stages')
                    for(let i=1;i<stages.length;i++) stages[i] = 0
                    this.$storage.set('stages', stages)

                    let result=JSON.parse(JSON.stringify([]))
                    console.log(result)
                    for(let i=0;i<audioPairList.length/4;i++){
                        result.push({})
                        result.push({})
                    }
                    this.$storage.set('resultOfStep1',result)

                    this.$router.push({path:'stepsRoot/audioCompareWithoutSoundQuality'})
                } else {
                    this.$message.error(data.msg);
                }
            });

        }
    },
};
</script>

<style scoped>
h1 {
    padding-top: 1em;
    font-size: 20px;
    width: 0;
    height: 150px;
    line-height: 150px;
    margin-top: 100px;
    margin-left: auto;
    color: #fff;
    /* background: lightcoral; */
    white-space: nowrap;
    animation: w 2s steps(13) forwards;
    text-align: center;
}
@keyframes w {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}

.gif{
    width: 100%;
}
.jianbian {
    height: 1000px;
    width: 100%;
    /* margin: 0;
              padding: 0; */
    font-family: "montserrat";
    background-image: linear-gradient(
        45deg,
        #2c3e50,
        #27ae60,
        #2980b9,
        #e74c3c,
        #8e44ad
    );
    background-size: 400%;
    animation: bganimation 15s infinite;
    margin-top: -100px;
}
@keyframes bganimation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>

