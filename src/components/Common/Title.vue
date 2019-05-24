<template>
  <div class="title"><slot></slot></div>
</template>

<script>
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.title
	margin-bottom $margin__base
	padding-bottom $padding__base
	font-size $font-size__large
	font-weight $font-weight__base
	border-bottom $border-width__base solid $whisper
	user-select none
	line-height normal
</style>