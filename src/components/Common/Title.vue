<template>
  <div class="title"><slot></slot></div>
</template>

<script>
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.title
	margin-bottom $margin_base
	padding-bottom $padding_base
	font-size $font-size_large
	font-weight $font-weight_base
	border-bottom $border-width_base solid $whisper
	user-select none
	line-height normal
</style>