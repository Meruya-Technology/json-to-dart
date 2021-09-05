<template>
  <img src="assets/icons/{{iconName}}.svg" :width="width" :height="height">
  <svg class="fill-current text-green-600"></svg>
</template>

<script>
export default {
    props: {
        iconName: { type: String, default: ''},
        width: { type: [Number, String], default: 18 },
        height: {type: [Number, String], default: 18 },
    }
}
</script>

<style>

</style>