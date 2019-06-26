<template>
  <div class="single-line-input">
		<div
			class="single-line-input__wrapper"
		>
	  	<input
        type="text"
        ref="input"
        v-model="current.value"
        class="single-line-input__input"
        :class="[{'single-line-input__input_marked':errorMessage}]"
        :disabled="disabled"
        :placeholder="placeholder"
        @keydown="keyDown"
        @keypress="keyPress"
        @keyup="keyUp"
        @textInput="textInput"
        @mouseup="mouseUp"
        @focusout="focusOut"
        @cut="cut"
        @copy="copy"
        @paste="paste"
      >
			<transition name="fade">
				<div class="single-line-input__message" v-if="errorMessage">{{errorMessage}}</div>
			</transition>
			<slot></slot>
		</div>
	</div>
</template>

<script>
import inputMixin from '@/components/Common/mixins/inputMixin'
import { getTimeStamp } from '@/assets/utility'
import InputLabel from '@/components/Common/InputLabel'
import maskMixin from './mask/maskMixin'

const MESSAGE = {
	fillEmptyField: 'Заполните поле',
	charExceeded: 'Превышение количества символов на'
}

export default {
	components: {
		InputLabel
	},
	mixins: [maskMixin, inputMixin],
	props: {
		value: {
			type: String
		},
		disabled: {
			type: Boolean,
			default: false
		},
		placeholder: {
			type: String,
			default: 'Заполняется свободно...'
		}
	},
	data() {
		return {}
	},
	methods: {}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.single-line-input
  min-width 40px
  transition $transition-duration_base

.single-line-input__wrapper
  position relative
  transition $transition-duration_base

.single-line-input__input
  padding 0 $padding_very-small
  border-width $border-width_base
  border-style solid
  border-color $whisper
  border-radius $border-radius_base
  background-color $white
  height 34px
  line-height 34px
  font-size $font-size_very-small
  width 100%
  box-sizing border-box
  outline none
  transition border-color $transition-duration_fast

  &::placeholder
    font-style italic
    color $grey

.single-line-input__input_marked
  border $border-width_base solid $red !important
  border-radius $border-radius_base

.single-line-input__message
  padding 0px $padding_very-small
  font-size $font-size_extra-small
  color $grey
  position absolute
  top -10px
  right 15px
  background-color $white
  white-space nowrap
  text-transform lowercase
  z-index 30

.single-line-input__s-icon
  position absolute
  width 14px
  height 14px
  line-height 14px
  padding 9px 12px 9px 12px
  top 13px
  right 1px
  margin -12px 0px 0px 0px
  border-radius $border-radius_base
  user-select none
  z-index 1

.single-line-input__wrapper_select-fix
  position relative

.single-line-input__wrapper_select-fix::after
  content ''
  display block
  position absolute
  top 0
  left 0
  width 100%
  height 100%

.fade-enter-active, .fade-leave-active
  transition opacity $transition-duration_fast

.fade-enter, .fade-leave-to
  opacity 0
</style>