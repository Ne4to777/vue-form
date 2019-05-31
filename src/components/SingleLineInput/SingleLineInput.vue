<template>
  <div class="single-line">
		<Label v-if="title" :with-asterisk="required" class="form-label_margin-bottom">{{title}}</Label>
		<div
			class="single-line__wrapper"
			@click="onInputClick"
			:class="[{'single-line__wrapper_select-fix':!selectable}, selectable ? '' : classes]"
		>
	  	<input
        type="text"
				:value="content"
				@input="onInput"
				@focus="onFocus"
				@blur="onBlur"
				@copy="onCopy"
				@cut="onCut"
				@paste="onPaste"
				@keyup.ctrl.z="onUndo"
				@keyup.ctrl.shift.z="onRedo"
        class="single-line__input"
        :class="[{'single-line__input_marked':message}, classes]"
        :placeholder="placeholder === false? '': disabled ? placeholderDisabled : placeholder"
        :disabled="disabled">
				<transition name="fade">
					<div class="single-line__message" v-if="message">{{message}}</div>
				</transition>
				<slot></slot>
				<transition name="fade">
					<div
						class="s-icon single-line__s-icon"
						:class="[iconClass,{'s-icon_hover':!!onIconClick}]"
						v-if="!!icon && !disabled && isIconVisible"
						@click.stop.prevent="onIconClick && onIconClick(arguments[0])"
						@mouseover="isIconHover=true"
						@mouseleave="isIconHover=false"
					>
				</div>
				</transition>
		</div>
	</div>
</template>

<script>
import Label from '@/components/Common/Label'
import chargeMask from './mask'

const MESSAGE = {
	fillEmptyField: 'Заполните поле',
	charExceeded: 'Превышение количества символов на'
}
const getTimeStamp = _ => new Date().getTime()
export default {
	props: {
		disabled: { type: Boolean, default: false },
		required: { type: Boolean, default: true },
		title: String,
		name: String,
		trimmed: Boolean,
		placeholder: { type: [String, Boolean], default: 'Заполняется свободно...' },
		placeholderDisabled: { type: [String, Boolean], default: 'Ввод недоступен' },
		max: Number,
		isValidateOnChange: { type: Boolean, default: true },
		isValidateOnBlur: { type: Boolean, default: true },
		isValidateOnIconClick: { type: Boolean, default: true },
		validator: { type: Function },
		mask: String,
		icon: String,
		classes: null,
		value: null,
		selectable: { type: Boolean, default: true },
		isIconVisible: { type: Boolean, default: true }
	},
	components: {
		Label
	},
	watch: {
		async value(x) {
			this.validated = false
			if (this.content !== x) {
				this.content = x
				this.prettify()
				if (this.isValidateOnChange) {
					this.lastInputTimeStamp = getTimeStamp()
					await this.validate()
				}
				this.$emit('input', this.content)
			}
		}
	},
	data() {
		return {
			content: this.prettify(this.value),
			message: '',
			isIconHover: false,
			lastInputTimeStamp: 0,
			validated: false,
			prettified: false
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
		setValue(value) {
			return (this.content = value)
		},
		prettify(value) {
			const content = value === void 0 ? this.content : value
			if (content !== void 0) {
				let updatedContent = content
				if (this.trimmed) {
					const prettifiedContent = content.replace(/^\s{1,}|\s{1,}$/g, '')
					if (content !== prettifiedContent) {
						updatedContent = prettifiedContent
						this.validated = false
					}
				}
				if (this.mask) {
					const prettifiedContent = chargeMask(this.mask)(content)
					if (content !== prettifiedContent) {
						updatedContent = prettifiedContent
						this.validated = false
					}
				}
				if (updatedContent !== this.content) this.content = updatedContent
			}
			this.prettified = true
			return this.content
		},
		async validate() {
			let message = ''
			if (this.validator) message = await this.validator(this.content)
			if (this.required && !this.content && !message) message = MESSAGE.fillEmptyField
			if (this.content && this.max < this.content.length && !message)
				message = `${MESSAGE.charExceeded} ${this.content.length - this.max}`
			if (this.lastInputTimeStamp <= new Date().getTime()) {
				this.setMessage(message)
				this.validated = true
			}
		},
		getMessage() {
			return this.message
		},
		setMessage(msg = '') {
			if (msg !== this.message) this.message = msg
		},
		clearMessage() {
			this.message = ''
		},
		async confirm() {
			if (!this.prettified) this.prettify()
			if (!this.validated) {
				this.lastInputTimeStamp = getTimeStamp()
				await this.validate()
			}
			return this.message ? void 0 : this.content
		},
		clear() {
			this.content = ''
			this.validated = false
			this.setMessage('')
		},
		reset() {
			this.content = this.value
			this.validated = false
			this.setMessage('')
		},
		async onInput(e) {
			const content = e.target.value
			if (this.content !== content) {
				this.prettified = false
				this.content = content
				if (this.isValidateOnChange) {
					this.lastInputTimeStamp = getTimeStamp()
					await this.validate()
				}
			}
			this.$emit('input', this.content)
		},
		onFocus(e) {
			if (!this.isValidateOnChange) this.setMessage('')
			this.$emit('focus', e.target.value)
		},
		async onBlur(e) {
			if (!this.prettified) this.prettify()
			if (!this.isIconHover) {
				if (this.isValidateOnBlur && !this.validated) {
					this.lastInputTimeStamp = getTimeStamp()
					await this.validate()
				}
				this.$emit('blur', e.target.value)
			}
		},
		onCopy(e) {
			this.$emit('copy', e.target.value)
		},
		onCut(e) {
			this.$emit('cut', e.target.value)
		},
		onPaste(e) {
			this.$emit('paste', e.target.value)
		},
		onUndo(e) {
			this.$emit('undo', e.target.value)
		},
		onRedo(e) {
			this.$emit('redo', e.target.value)
		},
		async onIconClick(e) {
			if (this.isValidateOnIconClick) {
				this.lastInputTimeStamp = getTimeStamp()
				await this.validate()
				!this.message && this.$emit('icon-click', this.content)
			} else {
				this.$emit('icon-click', this.content)
			}
		},
		onInputClick(e) {
			this.$emit('input-click', this.content)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.single-line
	min-width 40px
	transition $transition-duration_base

.single-line__wrapper
	position relative
	transition $transition-duration_base

.single-line__input
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

.single-line__input_marked
	border $border-width_base solid $red !important
	border-radius $border-radius_base

.single-line__message
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

.single-line__s-icon
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

.single-line__wrapper_select-fix
	position relative

.single-line__wrapper_select-fix::after
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