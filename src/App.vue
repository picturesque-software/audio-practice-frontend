<template>
    <div id="app">
        <router-view v-if="isRouterAlive"/>
    </div>
</template>

<script>

export default {
    name: 'App',
    provide(){
      return{
          reload: this.reload
      }
    },
    data(){
        return{
            isRouterAlive: true
        }
    },
    methods:{
        reload(){
            this.isRouterAlive = false
            this.$nextTick(() => {
                this.isRouterAlive = true
            })
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 1em;
    -webkit-user-select: none;
    -webkit-touch-callout: none !important;
}
*{
    -webkit-touch-callout: none !important;
    -webkit-user-select: none;
}
input {
    -webkit-user-select:auto; /*webkit�����*/
}
textarea {
    -webkit-user-select:auto; /*webkit�����*/
}
</style>
