<template>
  <div class="single-line">
		<Label v-if="title" :withAsterisk="required">{{title}}</Label>
		<div class="single-line__wrapper">
	  	<input
        type="text"
        v-model="text"
        class="single-line__input"
        :class="{'single-line__input_marked':message}"
        :placeholder="placeholder"
        :disabled="disabled">
			<div class="single-line__message" v-if="message">{{message}}</div>
		</div>
	</div>
</template>

<script>
import Label from '@/components/Label'
// 				if (data.isValidateOnInput) this.isValidateOnInput = true;
// 				if (data.isValidateOnBlur === false) this.isValidateOnBlur = false;
// 				if (data.isValidateOnPaste) this.isValidateOnPaste = true;
// 				if (data.value !== void 0 && data.value !== null) this.value = data.value.toString();
// 				if (typeOf(data.onBlur) === 'function') this.onBlur = data.onBlur;
// 				if (typeOf(data.onFocus) === 'function') this.onFocus = data.onFocus;
// 				if (data.maxLength) this.maxLength = data.maxLength;
// 				if (data.buttonIcon) {}
// 				if (data.buttonHandler) {}
// 				if (data.mask) this.mask = data.mask;
// 				if (typeOf(data.validator) === 'function') this.validator = data.validator;

export default {
	props: {
		disabled: {
			type: Boolean,
			default: false
		},
		required: {
			type: Boolean,
			default: true
		},
		title: String,
		name: String,
		placeholder: {
			type: String,
			default: 'Заполняется свободно...'
		},
		isValidateOnInput: {
			type: Boolean,
			default: false
		},
		isValidateOnBlur: {
			type: Boolean,
			default: true
		},
		max: Number,
		value: String
	},
	components: {
		Label
	},
	data() {
		return {
			text: this.value || '',
			message: '',
			marked: false
		}
	},
	watch: {
		text() {
			if (this.max) {
				this.text = this.text.substr(0, this.max)
			}
			this.validate()
		}
	},
	methods: {
		getValue() {
			return this.text
		},
		validate() {
			if (this.required) {
				if (this.text) {
					this.message = ''
					return true
				} else {
					this.message = 'Заполните поле'
					return false
				}
			} else {
				this.message = ''
				return true
			}
		},
		confirm() {
			return this.validate() ? this.getValue() : void 0
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../assets/stylus/global.styl'

.single-line__wrapper
  position relative

.single-line__input
  padding 0 $padding__very-small
  border $border-width__base solid $whisper
  border-radius $border-radius__base
  background-color $white
  height 34px
  line-height 34px
  font-size $font-size__very-small
  width 100%
  box-sizing border-box
  outline none

  &::placeholder
    font-style italic
    color $grey

.single-line__input_marked
  border $border-width__base solid $red !important
  border-radius $border-radius__base

.single-line__message
  padding 0px $padding__very-small
  font-size $font-size__extra-small
  color $grey
  position absolute
  top -10px
  right 15px
  background-color $white
  white-space nowrap
  text-transform lowercase
  z-index 30
</style>