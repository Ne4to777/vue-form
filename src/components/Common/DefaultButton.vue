<template>
  <div 
    class="button" 
    :class="[{button_disabled:disabled, button_borderless:borderless},className]"
    @click="disabled ? $emit('click-disabled') :$emit('click')"
    @mouseover="disabled ? $emit('mouseover-disabled') : $emit('mouseover')"
    @mouseout="disabled ? $emit('mouseout-disabled') : $emit('mouseout')"
    @dblclick="disabled ? $emit('dblclick-disabled') : $emit('dblclick')"
   >{{value}}</div>
</template>

<script>
export default {
	props: {
		color: {
			type: String,
			default: 'blue'
		},
		filled: {
			type: Boolean,
			default: true
		},
		disabled: {
			type: Boolean,
			default: false
		},
		borderless: {
			type: Boolean,
			default: false
		},
		value: {
			type: String,
			default: 'Ок'
		}
	},
	data() {
		return {
			className: `button_${this.filled ? 'solid' : 'thin'}-${this.color}`
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.button
  padding 0 $padding_base
  border-radius $border-radius_base
  height 34px
  line-height 34px
  display inline-block
  text-align center
  white-space nowrap
  cursor pointer
  transition $transition-duration_base
  border $border-width_base solid transparent
  box-sizing border-box
  user-select none

  &:hover
    opacity $opacity_strong

.button_disabled
  opacity $opacity_weak
  cursor not-allowed

  &:hover
    opacity $opacity_weak

.button_borderless
  border-color transparent !important

.button_solid-blue
  background-color $blue
  color $white

.button_solid-grey
  background-color $whisper
  color $grey

.button_solid-green
  background-color $green
  color $white

.button_solid-lightgreen
  background-color $lightgreen
  color $white

.button_solid-red
  background-color $red
  color $white

.button_thin-blue
  background-color transparent
  border-color $blue
  color $blue

.button_thin-grey
  background-color transparent
  border-color $grey
  color $grey

.button_thin-green
  background-color transparent
  border-color $green
  color $green

.button_thin-lightgreen
  background-color transparent
  border-color $lightgreen
  color $lightgreen

.button_thin-red
  background-color transparent
  border-color $red
  color $red
</style>