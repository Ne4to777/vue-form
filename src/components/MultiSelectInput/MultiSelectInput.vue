<template>
  <div class="multiselect-input">
		<input-label
			v-if="title"
			class="form-label_margin-bottom"
			:with-asterisk="required"
		>{{title}}</input-label>
		<div class="multiselect-input__tags" v-show="tagItems.length" key="tags">
			<draggable v-model="tagItems" v-bind="dragOpts">
 				<component
					v-for="(item, i) in tagItems"
					:key="i"
					:is="types[type.toLowerCase()]"
					class="multiselect-input__tag"
					:value="item"
					:class="{'cursor_pointer':draggable}"
					:key-property="keyProperty"
					:content-property="contentProperty"
					:closable="true"
					@remove="removeTag"
				/>
			</draggable>
  	</div>
	  <single-line-input
			ref="SingleLineInput"
			:classes="classes"
			v-bind="inputOpts"
			:placeholder="placeholder"
			:placeholder-disabled="placeholderDisabled"
			:is-icon-visible="isIconVisible"
			@icon-click="addTag"
			@input-click="$emit('input-click')"
		><slot></slot></single-line-input>
	</div>
</template>

<script>
import { getTimeStamp } from '@/assets/utility'
import draggable from 'vuedraggable'
import InputLabel from '@/components/Common/InputLabel'
import Tag from '@/components/Common/Tag'
import UserCard from '@/components/Common/UserCard'
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'

const MESSAGE = {
	fillEmptyField: 'Введите хотя бы одно значение',
	valueExists: 'Значение уже выбрано'
}

export default {
	props: {
		name: String,
		title: String,
		disabled: { type: Boolean, default: false },
		required: { type: Boolean, default: true },
		placeholder: [String, Boolean],
		placeholderDisabled: String,
		max: Number,
		isValidateOnChange: { type: Boolean, default: true },
		isValidateOnBlur: { type: Boolean, default: true },
		validator: { type: Function },
		mask: String,
		limit: Number,
		value: { type: null, dafult: _ => [] },
		initValue: null,
		type: { type: String, default: 'simple' },
		draggable: { type: Boolean, default: false },
		keyProperty: { type: null, default: 'value' },
		contentProperty: String,
		classes: null,
		isIconVisible: { type: Boolean, default: true },
		iconClickValidator: Function
	},
	components: {
		draggable,
		InputLabel,
		Tag,
		UserCard,
		SingleLineInput
	},
	mounted() {
		this.singleLineInput = this.$refs.SingleLineInput
	},
	data() {
		return {
			tagItems: this.initValue,
			dataInitValue: [].concat(this.initValue),
			types: {
				user: UserCard,
				simple: Tag
			},
			drag: false,
			validated: false,
			lastValidateTimeStamp: 0
		}
	},
	watch: {
		value(x) {
			this.tagItems = x
		},
		tagItems: {
			handler(x) {
				this.validated = false
				this.$emit('input', x)
			},
			deep: true
		}
	},
	computed: {
		tagItemsMapped() {
			return this.tagItems.reduce((acc, el, i) => {
				acc[this.getKeyValue(el)] = i
				return acc
			}, {})
		},
		inputDisabled() {
			return this.disabled || (this.limit && this.tagItems.length >= this.limit)
		},
		dragOpts() {
			return {
				ghostClass: 'ghost',
				tag: 'span',
				animation: 200,
				disabled: !this.draggable
			}
		},
		inputOpts() {
			return {
				required: false,
				icon: 'plus',
				validator: this.inputValidator,
				max: this.max,
				placeholder: this.placeholder,
				disabled: this.inputDisabled,
				isIconVisible: this.isIconVisible
			}
		}
	},
	methods: {
		getValue() {
			return this.tagItems
		},
		setValue(x) {
			this.tagItems = x
		},
		async validate() {
			let message = ''
			await this.addTag()
			if (this.required && !this.tagItems.length) {
				message = MESSAGE.fillEmptyField
			}
			if (this.lastValidateTimeStamp <= getTimeStamp()) {
				this.singleLineInput.setMessage(message)
				if (!message) this.validated = true
			}
		},
		async confirm() {
			if (!this.validated) {
				this.lastValidateTimeStamp = getTimeStamp()
				await this.validate()
			}
			return this.validated ? this.getValue() : void 0
		},
		clear() {
			this.tagItems = []
			this.singleLineInput.clear()
		},
		reset() {
			this.tagItems = this.dataInitValue
			this.singleLineInput.clear()
		},
		clearMessage() {
			this.singleLineInput.clearMessage()
		},
		setMessage(msg) {
			this.singleLineInput.setMessage(msg)
		},
		getKeyValue(el) {
			return el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el
		},
		async addTag(tag) {
			let value = tag
			if (this.tagItemsMapped[tag] !== void 0) return
			const singleLineInput = this.singleLineInput
			if (!this.limit || this.tagItems.length < this.limit) {
				if (tag === void 0) {
					value = await singleLineInput.confirm()
				} else {
					if (this.iconClickValidator) {
						const message = await this.iconClickValidator(tag)
						if (message) {
							singleLineInput.setMessage(message)
							value = void 0
						}
					}
				}
				if (value) {
					this.tagItems = this.tagItems.concat(value)
					singleLineInput.clear()
					this.$emit('add', value)
				}
			}
		},
		async removeTag(tag) {
			const index = this.tagItemsMapped[tag]
			const itemToRemove = this.tagItems[index]
			if (
				this.getKeyValue(itemToRemove) === this.singleLineInput.getValue() &&
				this.singleLineInput.getMessage() === MESSAGE.valueExists
			) {
				this.singleLineInput.clearMessage()
			}
			this.tagItems = this.tagItems.slice(0, index).concat(this.tagItems.slice(index + 1))
			this.$emit('remove', itemToRemove)
		},
		async inputValidator(value) {
			if (this.tagItemsMapped[value] !== void 0) return MESSAGE.valueExists
			return this.validator ? await this.validator(value) : void 0
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.ghost
	opacity 0.6

.multiselect-input__tags
	position relative
	margin-left - $margin_very-small
	transition all 1s

.multiselect-input__tag
	margin 0px 0px 8px $margin_very-small

.fade-enter-active, .fade-leave-active
	transition opacity $transition-duration_fast

.fade-enter, .fade-leave-to
	opacity 0
</style>