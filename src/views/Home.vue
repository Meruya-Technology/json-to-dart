<template>
  <div>
    <MainComponent msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MainComponent from '@/components/MainComponent.vue'

export default {
  name: 'Home',
  components: {
    MainComponent
  }
}
</script>
