<template>
  <div class="tagged">
		<Label v-if="title" :withAsterisk="required">{{title}}</Label>
    <Tagged :initValue="tagItems" @close="onClose" />
	  <SingleLineInput ref="SingleLineInput" :required="false" icon="plus" @iconClick="onAdd" :validator="validate"/>
	</div>
</template>

<script>
import Label from '@/components/Common/Label'
import Tagged from '@/components/Common/Tagged'
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'

export default {
	props: {
		disabled: { type: Boolean, default: false },
		required: { type: Boolean, default: true },
		title: String,
		name: String,
		placeholder: { type: String, default: 'Заполняется свободно...' },
		max: Number,
		initValue: {
			validator(value) {
				const o = {}
				if (value instanceof Array) {
					for (const item of value) {
						o[item] = true
					}
				} else {
					o[value] = true
				}
				return o
			}
		},
		isValidateOnChange: { type: Boolean, default: true },
		isValidateOnBlur: { type: Boolean, default: true },
		validator: { type: Function },
		mask: String
	},
	components: {
		Label,
		Tagged,
		SingleLineInput
	},
	data() {
		return {
			tagItems: this.initValue instanceof Array ? this.initValue : [this.initValue]
		}
	},
	computed: {
		tagItemsMapped() {
			const o = {}
			for (const item of this.tagItems) {
				o[item] = true
			}
			return o
		}
	},
	methods: {
		getValue() {},
		async validate() {},
		async confirm() {},
		clear() {},
		reset() {},
		async onAdd(e) {
			const input = this.$refs.SingleLineInput
			const value = await input.confirm()
			if (value) {
				this.tagItems.push(value)
				input.clear()
				this.$emit('add')
			}
		},
		async onClose(index) {
			this.tagItems.splice(index, 1)
			await this.$refs.SingleLineInput.validate()
			this.$emit('close')
		},
		async validate(value) {
			if (this.tagItemsMapped[value]) return 'Значение уже выбрано'
			return this.validator ? await this.validator(value) : void 0
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