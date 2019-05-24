<template>
  <div class="droplist">
		<Label v-if="title" :withAsterisk="required">{{title}}</Label>
		<div class="droplist__wrapper">
	  	<SingleLineInput
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
        class="droplist__input"
        :class="{'droplist__input_marked':message}"
        :placeholder="placeholder"
        :disabled="disabled"/>
		</div>
	</div>
</template>

<script>
import Label from '@/components/Common/Label'
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'

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
		Label,
		SingleLineInput
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
		async validate() {},
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

.fade-enter-active, .fade-leave-active
  transition opacity $transition-duration__fast

.fade-enter, .fade-leave-to
  opacity 0
</style>