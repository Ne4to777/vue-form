<template>
  <div class="single-line">
		<Label v-if="title" :withAsterisk="required">{{title}}</Label>
		<div class="single-line__wrapper">
	  	<input
        type="text"
        v-model="content"
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
				<div
					class="s-icon single-line__s-icon"
					:class="[iconClass,{'s-icon_hover':!!onIconClick}]"
					v-if="!!icon"
					@click="onIconClick && onIconClick(arguments[0])">
				</div>
				<transition name="fade">
					<div class="single-line__message" v-if="message">{{message}}</div>
				</transition>
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
			content: this.mask ? chargeMask(this.mask)(this.initValue) : this.initValue,
			message: ''
		}
	},
	watch: {
		content() {
			this.validated = false
			if (this.max) {
				this.content = this.content.substr(0, this.max)
			}
			if (this.isValidateOnChange || this.isValidateOnBlur) this.validate()
			this.$emit('input', this.content)
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
			if (this.required) {
				if (this.content) {
					this.message = await this.validator(this.content)
					return !this.message
				} else {
					this.message = 'Заполните поле'
					return false
				}
			} else {
				this.message = ''
				return true
			}
			this.validated = true
		},
		async confirm() {
			return (await this.validate()) ? this.getValue() : void 0
		},
		onFocus(e) {
			this.$emit('focus', this.content)
		},
		onBlur(e) {
			if (this.mask) {
				this.content = chargeMask(this.mask)(this.content)
			}
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

.fade-enter-active, .fade-leave-active
	transition opacity $transition-duration__fast

.fade-enter, .fade-leave-to
	opacity 0
</style>