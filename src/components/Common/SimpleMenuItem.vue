<template>
  <div class="menu-item">{{value}}</div>
</template>

<script>
export default {
	props: {
		value: null
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.menu-item
	padding 8px $padding_very-small
	cursor pointer
	overflow hidden

	&:hover
		background-color $whisper
</style>