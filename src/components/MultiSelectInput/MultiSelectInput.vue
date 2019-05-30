<template>
  <div class="multiselect-input">
		<Label
			v-if="title"
			class="form-label_margin-bottom"
			:with-asterisk="required"
		>{{title}}</Label>
		<div class="multiselect-input__tags" v-show="tagItems.length" key="tags">
			<draggable v-model="tagItems" v-bind="dragOpts">
 				<component
					v-for="(item, i) in tagItems"
					:key="i"
					:is="types[type.toLowerCase()]"
					class="multiselect-input__tag"
					:value="item"
					:class="{'cursor_pointer':draggable}"
					:closable="true"
					@remove="removeTag(i)"
				/>
			</draggable>
  	</div>
	  <SingleLineInput
			ref="SingleLineInput"
			:classes="classes"
			v-bind="inputOpts"
			:placeholder="placeholder"
			:placeholder-disabled="placeholderDisabled"
			@icon-click="addTag"
			@input-click="$emit('input-click')"
		><slot></slot></SingleLineInput>
	</div>
</template>

<script>
import draggable from 'vuedraggable'
import Label from '@/components/Common/Label'
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
		value: { type: null, dafult: [] },
		type: { type: String, default: 'simple' },
		draggable: { type: Boolean, default: false },
		keyProperty: { type: null, default: 'value' },
		classes: null,
		isIconVisible: { type: Boolean, default: true }
	},
	components: {
		draggable,
		Label,
		Tag,
		UserCard,
		SingleLineInput
	},
	mounted() {
		this.singleLineInput = this.$refs.SingleLineInput
	},
	data() {
		return {
			tagItems: this.value,
			types: {
				user: UserCard,
				simple: Tag
			},
			drag: false
		}
	},
	watch: {
		value(x, y) {
			if (x.length !== y.length) {
				this.tagItems = x
			} else {
				for (let i = 0; i < x.length; i++) {
					if (x[i] !== y[i]) {
						this.tagItems = x
						return
					}
				}
			}
		}
	},
	computed: {
		tagItemsMapped() {
			const o = {}
			for (const item of this.tagItems) {
				if (typeof item === 'object') {
					o[item[this.keyProperty]] = true
				} else {
					o[item] = true
				}
			}
			return o
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
		async confirm() {
			await this.addTag()
			if (this.required && !this.tagItems.length) this.singleLineInput.setMessage(MESSAGE.fillEmptyField)
			return this.tagItems.length ? this.tagItems : void 0
		},
		clear() {
			this.tagItems = []
			this.singleLineInput.clear()
		},
		reset() {
			this.tagItems = this.value
			this.singleLineInput.reset()
		},
		async addTag(tag) {
			if (this.tagItemsMapped[tag]) return
			const singleLineInput = this.singleLineInput
			if (!this.limit || this.tagItems.length < this.limit) {
				const value = tag === void 0 ? await singleLineInput.confirm() : tag
				if (value) {
					this.tagItems = this.tagItems.concat(value)
					singleLineInput.clear()
					this.$emit('input', this.tagItems)
				}
			}
		},
		async removeTag(index) {
			this.tagItems = this.tagItems.slice(0, index).concat(this.tagItems.slice(index + 1))
			this.$emit('input', this.tagItems)
		},
		async inputValidator(value) {
			if (this.tagItemsMapped[value]) return MESSAGE.valueExists
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
	// max-width 200px
	margin-left - $margin_very-small
	transition all 1s

.multiselect-input__tag
	margin 0px 0px 8px $margin_very-small

.fade-enter-active, .fade-leave-active
	transition opacity $transition-duration_fast

.fade-enter, .fade-leave-to
	opacity 0
</style>