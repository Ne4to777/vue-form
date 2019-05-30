<template>
  <div>
    <input type="text" :value="value" @input="$emit('input', $event.target.value)">
    child: {{value}}
  </div>
</template>

<script>
export default {
	props: ['value']
}
</script>

<style lang="stylus" scoped>
</style>