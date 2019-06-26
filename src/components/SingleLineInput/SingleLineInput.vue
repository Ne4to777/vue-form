<template>
  <div class="single-line-input">
		<input-label
			v-if="title"
			:with-asterisk="current.required"
			class="form-label_margin-bottom"
		>
			{{current.title}}
		</input-label>
		<div
			class="single-line-input__wrapper"
			@click="onInputClick"
			:class="classes"
		>
	  	<input
        type="text"
				ref="input"
				v-model="current.value"
				@keydown="keyDown"
        @keypress="keyPress"
        @keyup="keyUp"
        @textInput="textInput"
        @mouseup="mouseUp"
        @focusout="focusOut"
        @cut="cut"
        @copy="copy"
        @paste="paste"
				@keydown.enter="onEnter"
        class="single-line-input__input"
        :class="[{'single-line-input__input_marked':defaultErrorMessage}, classes]"
        :placeholder="placeholder === false? '': current.disabled ? placeholderDisabled : placeholder"
        :disabled="current.disabled"
			>
			<transition name="fade">
				<div class="single-line-input__message" v-if="defaultErrorMessage">{{defaultErrorMessage}}</div>
			</transition>
			<slot></slot>
			<transition name="fade">
				<div
					class="s-icon single-line-input__s-icon"
					:class="[iconClass,{'s-icon_hover':!!onIconClick}]"
					v-if="!!icon && !current.disabled && isIconVisible"
					@click.stop.prevent="onIconClick && onIconClick(arguments[0])"
				>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import inputMixin from '@/components/Common/mixins/inputMixin'
import InputLabel from '@/components/Common/InputLabel'
import maskMixin from './mask/maskMixin'

export default {
	components: {
		InputLabel
	},
	mixins: [maskMixin, inputMixin],
	props: {
		mask: String,
		icon: String,
		classes: null,
		validator: Function,
		isIconVisible: { type: Boolean, default: true }
	},
	computed: {
		iconClass() {
			return this.icon ? `s-icon-${this.icon}` : ''
		}
	},
	methods: {
		customValidator(value) {
			return new Promise(
				(resolve, reject) =>
					this.mask && /_/.test(value)
						? reject('Заполните полностью')
						: this.validator
							? this.validator(value)
									.then(resolve)
									.catch(reject)
							: resolve(value)
			)
		},
		onInputClick(e) {
			this.$emit('input-click', this.getValue())
		},
		onIconClick(e) {
			this.$emit('icon-click', this.getValue())
		},
		onEnter(e) {
			if (this.icon && this.onIconClick) {
				this.onIconClick()
			}
		}
	}
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

.fade-enter-active, .fade-leave-active
	transition opacity $transition-duration_fast

.fade-enter, .fade-leave-to
	opacity 0
</style>