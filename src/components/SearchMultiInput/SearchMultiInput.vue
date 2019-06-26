<template>
  <div class="droplist">
		<multi-select-input
			ref="MultiSelectInput"
			:title="title"
			v-model="items"
			:init-value="items"
			:required="required"
			:placeholder="placeholder"
      :placeholder-disabled="placeholderDisabled"
			:classes="[{'border-radius_bottom-fix':menuVisible && menuItems.length}]"
      :validator="validator"
			:trimmed="trimmed"
			:max="max"
			:isValidateOnChange="isValidateOnChange"
			:isValidateOnBlur="false"
			:isValidateOnIconClick="isValidateOnBlur"
			:mask="mask"
			:icon="icon"
			:selectable="selectable"
			:isIconVisible="isIconVisible"
      :key-property="keyProperty"
      :content-property="contentProperty"
			@input-click="menuVisible = true"
			@input="onInput"
			@blur="onBlur"
			@keydown.native="onKeyDown"
		/>
		<droplist-menu
			ref="DroplistMenu"
			v-show="menuVisible"
			class="droplist__menu"
			:value="menuItemsFiltered"
			:key-property="keyProperty"
			:content-property="contentProperty"
			:focusedKey="focusedKey"
      :active="value"
			@click="onMenuItemClick"
			@mouseover.native="menuHover = true"
			@mouseleave.native="menuHover = false"
		/>
	</div>
</template>

<script>
import { getTimeStamp } from '@/assets/utility'
import DroplistMenu from '@/components/Common/DroplistMenu'
import MultiSelectInput from '@/components/MultiSelectInput/MultiSelectInput'

const MESSAGE = {
	fillEmptyField: 'Введите значение',
	valueExists: 'Значение уже выбрано',
	valueNotExists: 'Выберите значение'
}

export default {
	mounted() {
		this.multiSelectInput = this.$refs.MultiSelectInput
		this.droplistMenu = this.$refs.DroplistMenu
	},
	components: {
		DroplistMenu,
		MultiSelectInput
	},
	props: {
		value: null,
		initValue: null,
		required: { type: Boolean, default: true },
		menuItems: { type: Array, default: _ => [] },
		title: String,
		type: { type: String, default: 'simple' },
		placeholder: { type: String, default: 'Начните вводить текст' },
		placeholderDisabled: { type: String, default: 'Невозможно выбрать' },
		strict: { type: Boolean, default: false },
		trimmed: Boolean,
		max: Number,
		isValidateOnChange: { type: Boolean, default: true },
		isValidateOnBlur: { type: Boolean, default: true },
		isValidateOnIconClick: { type: Boolean, default: true },
		validator: { type: Function },
		mask: String,
		icon: String,
		classes: null,
		selectable: { type: Boolean, default: true },
		isIconVisible: { type: Boolean, default: true },
		keyProperty: { type: null, default: 'value' },
		contentProperty: [Array, String],
		searchProperty: { type: [Array, String], default: 'value' }
	},
	data() {
		return {
			active: this.initValue,
			items: this.menuItems.filter(el => {
				for (const item of this.initValue) {
					if (el[this.keyProperty] === item) return true
				}
				return false
			}),
			menuVisible: false,
			dataInitValue: [].concat(this.initValue),
			dataInitMenuItems: [].concat(this.menuItems),
			menuItemsFiltered: [].concat(this.menuItems),
			focusedKey: void 0,
			focusedIndex: void 0,
			menuHover: false,
			validated: false,
			lastValidateTimeStamp: 0
		}
	},
	computed: {
		menuItemsFilteredMapped() {
			return this.menuItemsFiltered.reduce((acc, el, i) => {
				acc[el[this.keyProperty]] = i
				return acc
			}, {})
		}
	},
	methods: {
		getValue() {
			const value = this.multiSelectInput.getValue()
			if (value && this.menuItemsFiltered.length) {
				const children = this.droplistMenu.$children
				if (this.menuItemsFiltered.length === 1) {
					return children[0].getValue() === value ? this.menuItemsFiltered[0] : value
				} else {
					const filtered = children.reduce((acc, el, i) => {
						el.getValue() === value && acc.push(i)
						return acc
					}, [])
					return filtered.length ? this.menuItemsFiltered[filtered[0]] : value
				}
			}
		},
		async validate() {
			const value = await this.multiSelectInput.getValue()
			let message = this.multiSelectInput.message
			if (!this.menuItemsFiltered.length) {
				if (this.required) message = MESSAGE.valueNotExists
			} else {
				const children = this.droplistMenu.$children
				if (this.menuItemsFiltered.length === 1) {
					if (children[0].getValue() !== value && this.strict) message = MESSAGE.valueNotExists
				} else {
					const filtered = children.reduce((acc, el) => {
						el.getValue() === value && acc++
						return acc
					}, 0)
					if (!filtered && this.strict) message = MESSAGE.valueNotExists
				}
			}
			if (this.lastValidateTimeStamp <= getTimeStamp()) {
				this.multiSelectInput.setMessage(message)
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
			this.multiSelectInput.clear()
			this.active = []
			this.items = []
			this.menuItemsFiltered = this.dataInitMenuItems
		},
		reset() {
			this.multiSelectInput.reset()
			this.active = this.initValue
			this.menuItemsFiltered = this.dataInitMenuItems
		},
		getFilteredItems(value) {
			return value
				? this.menuItems.filter((el, i) => {
						if (this.searchProperty instanceof Array) {
							for (const prop of this.searchProperty) {
								const elProp = el[prop]
								if (elProp.length < value.length) {
									if (value.indexOf(elProp) !== -1) return true
								} else {
									if (elProp.indexOf(value) !== -1) return true
								}
							}
						} else {
							const elProp = el[this.searchProperty]
							if (elProp.length < value.length) {
								if (value.indexOf(elProp) !== -1) return true
							} else {
								if (elProp.indexOf(value) !== -1) return true
							}
						}
				  })
				: this.menuItems
		},
		onInput(value) {
			console.log(value)
			this.validated = false
			this.menuItemsFiltered = this.getFilteredItems(value)
		},
		onMenuItemClick(value, content) {
			this.multiSelectInput.clearMessage()
			this.items = this.items.concat(value)
			this.active = this.active.concat(value[this.keyProperty])
			this.menuHover = false
			this.menuVisible = false
		},
		onKeyDown(e) {
			if (this.menuVisible) {
				if (e.key === 'ArrowDown') {
					if (this.focusedIndex === void 0) {
						this.focusedIndex = 0
					} else if (this.focusedIndex >= this.menuItemsFiltered.length - 1) {
						this.focusedIndex = 0
					} else {
						this.focusedIndex += 1
					}
					this.focusedKey = this.menuItemsFiltered[this.focusedIndex][this.keyProperty]
				}
				if (e.key === 'ArrowUp') {
					if (this.focusedIndex === void 0) {
						this.focusedIndex = this.menuItemsFiltered.length - 1
					} else if (this.focusedIndex <= 0) {
						this.focusedIndex = this.menuItemsFiltered.length - 1
					} else {
						this.focusedIndex -= 1
					}
					this.focusedKey = this.menuItemsFiltered[this.focusedIndex][this.keyProperty]
				}
			}
			if (e.key === 'Enter' && this.focusedIndex !== void 0) {
				this.onMenuItemClick(
					this.menuItemsFiltered[this.focusedIndex],
					this.droplistMenu.$children[this.focusedIndex].getValue()
				)
				this.focusedKey = void 0
				this.focusedIndex = void 0
			}
		},
		onBlur() {
			if (!this.menuHover) {
				this.menuVisible = false
			}
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.droplist
	position relative

.droplist__menu
	position absolute
	z-index 2

.fade-enter, .fade-leave-to
	opacity 0
</style>