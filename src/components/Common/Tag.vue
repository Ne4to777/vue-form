<template>
  <span class="tag">
    <span class="tag__value" :class="{'tag_close-padding':closable}">
      <slot></slot>
    </span>
    <span v-if="closable" @click="$emit('close')" class="tag__close"></span>
  </span>
</template>

<script>
export default {
	props: {
		closable: { type: Boolean, default: false }
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.tag
  padding 4px $padding_very-small 4px $padding_very-small
  display inline-block
  border-width $border-width_base
  border-style solid
  border-color $whisper
  border-radius $border-radius_small
  background-color $ghostwhite
  position relative
  box-sizing border-box
  line-height normal
  white-space nowrap
  color $black
  font-size $font-size_extra-small
  user-select none

.tag__value:empty:after
  content 'Пусто'
  font-style italic
  color $grey

.tag_close-padding
  padding-right 15px

.tag__close
  width 16px
  height 16px
  top 3px
  right 3px
  position absolute
  transition 0.4s
  cursor pointer

.tag__close:hover, .tag__close:active
  transform rotate(90deg)

.tag__close:before, .tag__close:after
  content ''
  display block
  position absolute
  background-color #989B9D

.tag__close:before
  width 2px
  margin 0px 0px 0px -1px
  top 2px
  bottom 2px
  left 50%
  transform rotate(45deg)

.tag__close:after
  height 2px
  margin -1px 0px 0px 0px
  top 50%
  left 2px
  right 2px
  transform rotate(45deg)
</style>