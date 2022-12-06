const api = {
    // 提交音频问卷
    submitAudioForm:'/questionnaire/submit',

    // 登录相关
    login: '/user/login',
    register:'/user/register',
    getUserById:'/user/getById',

    // 获取各阶段音频信息
    getAudiosStep1:'/step/getAudioForStep1',
    getAudiosStep2:'/step/getAudioForStep2',
    getAudiosStep3:'/step/getAudioForStep2',
    getAudiosStep4:'/step/getAudioForStep2',
    getAudiosStep5:'/step/getAudioForStep2',

    // 提交相关
    submitStep1:'/step/submitStep1'
}

export default api
