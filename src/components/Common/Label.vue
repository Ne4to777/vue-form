<template>
  <label class="label" :class="{label_asterix:withAsterisk}"><slot></slot></label>
</template>

<script>
export default {
	props: {
		withAsterisk: Boolean
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.label
  display inline-block
  font-weight $font-weight__bold

.label_asterix:after
  content '*'
  padding-left $padding__extra-small
  font-weight $font-weight__bold
  color $red
</style>