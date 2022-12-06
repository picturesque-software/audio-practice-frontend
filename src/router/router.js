import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import AudioCompare from "@/views/AudioCompare";
import StepsRoot from "@/views/StepsRoot";
import FinishStep1 from "@/views/FinishStep1";
import AudioCompareWithoutSoundQuality from "@/views/AudioCompareWithoutSoundQuality";
import FinishStep2 from "@/views/FinishStep2";
import FinishStep3 from "@/views/FinishStep3";
import FinishStep4 from "@/views/FinishStep4";
import FinishStep5 from "@/views/FinishStep5";
import Register from "@/views/Register";
import Welcome from "@/views/Welcome";

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/stepsRoot',
            name: 'stepsRoot',
            component: StepsRoot,
            children: [
                {
                    path: 'audioCompare',
                    name: 'audioCompare',
                    component: AudioCompare
                },
                {
                    path: 'audioCompareWithoutSoundQuality',
                    name: 'audioCompareWithoutSoundQuality',
                    component: AudioCompareWithoutSoundQuality
                },
            ]
        },
        {
            path: '/finishStep1',
            name: 'finishStep1',
            component: FinishStep1
        },
        {
            path: '/finishStep2',
            name: 'finishStep2',
            component: FinishStep2
        },
        {
            path: '/finishStep3',
            name: 'finishStep3',
            component: FinishStep3
        },
        {
            path: '/finishStep4',
            name: 'finishStep4',
            component: FinishStep4
        },
        {
            path: '/finishStep5',
            name: 'finishStep5',
            component: FinishStep5
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/welcome',
            name: 'welcome',
            component: Welcome
        },
    ],
    scrollBehavior () {
        return { x: 0, y: 0 }
    }
})
