<template>
    <div class="jianbian">
        <!-- <el-card>

        </el-card> -->
        <!--        <router-view></router-view>-->
        <h1>漂亮！你已完成第五阶段的听音!</h1>
<!--        <h1>此素材的听音到此结束！休息一下吧</h1>-->
        <p>本次主观评价流程全部结束！放松一下吧~</p>
        <img v-if="!congratulate" src="../assets/home.gif" alt class="gif" />
        <img v-if="congratulate" src="../assets/congratulations.gif" alt="gif">
        <!-- 内容区域 -->
        <!-- <img src="../assets/src=http___p4.itc.cn_q_70_images01_20210506_628477c0733b44ac898ed640b2e473c1.jpeg&refer=http___p4.itc.webp" alt class="tupian-img" /> -->
        <el-button type="primary" @click="enter">庆祝一下</el-button>
        <el-button type="primary" @click="back">返回</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            congratulate:false
        };
    },
    created() {},
    mounted() {

    },
    methods: {
        enter(){
            this.congratulate=true
        },
        back(){
            this.$router.push({path:'/welcome'})
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

