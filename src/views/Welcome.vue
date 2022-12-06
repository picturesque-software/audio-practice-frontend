<template>
    <div class="jianbian">
        <!-- <el-card>

        </el-card> -->
        <!--        <router-view></router-view>-->
        <h1 class="h1">欢迎来到空间音频主观评价系统！</h1>
        <img src="../assets/home.gif" alt class="gif" />
        <p class="p">您即将开启一段愉快的听音评价之旅，涉及音质和纵深定位评价两个部分。在您第一次听到一个音频时，需要为它的音质给出您的评价，往后只需要着重去听音频的纵深感受即可！祝您评价顺利！</p>
        <el-button v-if="!hasRecord" type="primary" @click="enter">进入</el-button>
        <div v-if="hasRecord">
            <p>请选择：</p>
            <el-button type="primary" @click="goLast">继续上一次</el-button>
            <!--                <el-button style="" type="text" @click="findPassword()">找回密码</el-button>-->
            <el-button type="primary" @click="restart">重新开始</el-button>
        </div>

<!--        &lt;!&ndash; 内容区域 &ndash;&gt;-->
<!--         <img src="../assets/src=http___p4.itc.cn_q_70_images01_20210506_628477c0733b44ac898ed640b2e473c1.jpeg&refer=http___p4.itc.webp" alt class="tupian-img" /> -->
<!--        <div style="margin: 3em">-->
<!--            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="auto" :label-position="labelPosition" size="mini">-->
<!--                <el-form-item label="用户名" prop="username" class="white-label-item">-->
<!--                    <el-input type="text" v-model="ruleForm.username"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="密码" prop="password" class="white-label-item">-->
<!--                    <el-input type="password" v-model="ruleForm.password"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-button style="display: block; color: white; font-weight: bold" type="text" @click="register">注册</el-button>-->
<!--                &lt;!&ndash;                <el-button style="" type="text" @click="findPassword()">找回密码</el-button>&ndash;&gt;-->
<!--                <el-button type="primary" @click="enter">登录</el-button>-->

<!--            </el-form>-->
<!--        </div>-->

    </div>
</template>

<script>
export default {
    data() {
        return {
            hasRecord:''
        };
    },
    created() {},
    mounted() {
        let params = {
            id: this.$storage.get("userid")
        }
        this.$http({
            url: this.$api.getUserById,
            method: "get",
            params: params
        }).then(({data}) => {
            if (data && data.code === "0") {
                this.hasRecord = data.data.step !== 0
            } else {
                this.$message.error(data.msg);
            }
        });

    },
    methods: {
        goLast(){
            // this.$router.push({path:'/register'})
        },
        restart(){

        },
        enter(){
            this.$http({
                url: this.$api.getAudiosStep1,
                method: "get",
            }).then(({data}) => {
                if (data && data.code === "0") {
                    let audioPairList = data.data
                    this.$storage.set('audioPairList', audioPairList)
                    console.log(this.$storage.getObj('audioPairList'))
                    this.$storage.set('stages',[0,0,0,0,0])
                    // step
                    this.$storage.set('stepActive',0)
                    // 第几次评测
                    this.$storage.set('stageOfStep',1)
                    let result=JSON.parse(JSON.stringify([]))
                    console.log(result)
                    for(let i=0;i<audioPairList.length;i++){
                        result.push({})
                        result.push({})
                    }
                    this.$storage.set('resultOfStep1',result)
                    this.$router.push({path:'/stepsRoot/audioCompare'})
                } else {
                    this.$message.error(data.msg);
                }
            });
        }
    },
};
</script>

<style>
.white-label-item .el-form-item__label{
    color:white;
}


.h1 {
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
.p{
    color: antiquewhite;
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

