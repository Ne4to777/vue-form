<template>
  <div class="single-line">
		<Label v-if="title" :withAsterisk="required">{{title}}</Label>
		<div class="single-line__wrapper">
	  	<input
        type="text"
				v-model="content"
				@input="onInput"
				@focus="onFocus"
				@blur="onBlur"
				@copy="onCopy"
				@cut="onCut"
				@paste="onPaste"
				@keyup.ctrl.z="onUndo"
				@keyup.ctrl.shift.z="onRedo"
        class="single-line__input"
        :class="{'single-line__input_marked':message}"
        :placeholder="placeholder"
        :disabled="disabled">
				<transition name="fade">
					<div class="single-line__message" v-if="message">{{message}}</div>
				</transition>
				<div
					class="s-icon single-line__s-icon"
					:class="[iconClass,{'s-icon_hover':!!onIconClick}]"
					v-if="!!icon"
					@click.prevent="onIconClick && onIconClick(arguments[0])">
				</div>
		</div>
	</div>
</template>

<script>
import Label from '@/components/Common/Label'
import chargeMask from './mask'

export default {
	props: {
		disabled: { type: Boolean, default: false },
		required: { type: Boolean, default: true },
		title: String,
		name: String,
		placeholder: { type: String, default: 'Заполняется свободно...' },
		max: Number,
		initValue: { type: String, default: '' },
		isValidateOnChange: { type: Boolean, default: true },
		isValidateOnBlur: { type: Boolean, default: true },
		validator: { type: Function, default: _ => _ },
		mask: String,
		icon: String
	},
	components: {
		Label
	},
	data() {
		return {
			content: this.initValue,
			message: '',
			validatedOnce: false
		}
	},
	computed: {
		iconClass() {
			return `s-icon-${this.icon}`
		}
	},
	methods: {
		getValue() {
			return this.content
		},
		async validate() {
			if (this.mask) {
				if (this.required || this.content) this.content = chargeMask(this.mask)(this.content)
				if (this.validator) this.message = await this.validator(this.content)
			}
			if (!this.isValidateOnChange && this.validator) this.message = await this.validator(this.content)
			if (this.required && !this.content) this.message = 'Заполните поле'
		},
		async confirm() {
			if (!this.validatedOnce) await this.validate()
			return this.message ? void 0 : this.content
		},
		clear() {
			this.content = ''
			this.message = ''
		},
		reset() {
			this.content = this.initValue
			this.message = ''
		},
		async onInput(e) {
			if (this.isValidateOnChange) {
				if (this.validator) this.message = await this.validator(this.content)
				if (this.required && !this.content) this.message = 'Заполните поле'
			}
			this.validatedOnce = true
			this.$emit('input', this.content)
		},
		onFocus(e) {
			if (!this.isValidateOnChange) this.message = ''
			this.$emit('focus', this.content)
		},
		async onBlur(e) {
			if (this.isValidateOnBlur) await this.validate()
			this.validatedOnce = true
			this.$emit('blur', this.content)
		},
		onCopy(e) {
			this.$emit('copy', this.content)
		},
		onCut(e) {
			this.$emit('cut', this.content)
		},
		onPaste(e) {
			this.$emit('paste', this.content)
		},
		onUndo(e) {
			this.$emit('undo', this.content)
		},
		onRedo(e) {
			this.$emit('redo', this.content)
		},
		onIconClick(e) {
			this.$emit('iconClick', this.content)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.single-line
	transition $transition-duration__base

.single-line__wrapper
	position relative
	transition $transition-duration__base

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
	transition border-color $transition-duration__fast

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

.single-line__s-icon
	position absolute
	width 14px
	height 14px
	line-height 14px
	padding 9px 12px 9px 12px
	top 13px
	right 1px
	margin -12px 0px 0px 0px
	border-radius $border-radius__base
	user-select none
	z-index 4

.fade-enter-active, .fade-leave-active
	transition opacity $transition-duration__fast

.fade-enter, .fade-leave-to
	opacity 0
</style>