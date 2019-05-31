<template>
  <div class="droplist">
		<MultiSelectInput
			ref="MultiSelectInput"
			:value="activeItems"
			:title="title"
			:placeholder="placeholder"
      :placeholder-disabled="placeholderDisabled"
			:classes="[{'border-radius_bottom-fix':menuVisible && menuItems.length}]"
      :draggable="draggable"
      :limit="limit"
      :icon-click-validator="iconClickValidator"
      :validator="validator"
			@input-click="!singleLineInput.disabled && showMenu()"
			@input="onInput"
		><div class="droplist__arrow-wrapper"><div class="droplist__arrow" :class="{droplist__arrow_up:menuVisible}"></div></div></MultiSelectInput>
		<div class="droplist__menu" v-if="filteredMenuItems.length && menuVisible">
			<component
				v-for="(item, i) in menuContentFilteredItems"
				:is="types[type.toLowerCase()]"
				:value="item"
				:class="[{'droplist__menu-item_selected':activeIndexes.some(el=>el===i)},{'droplist__menu-item_focused':focusedItemIndex === i}]"
				@click.stop.native="clickItem(i)"
			/>
		</div>
	</div>
</template>

<script>
import SimpleMenuItem from '@/components/Common/SimpleMenuItem'
import MultiSelectInput from '@/components/MultiSelectInput/MultiSelectInput'

const MESSAGE = {
	fillEmptyField: 'Введите хотя бы одно значение',
	valueExists: 'Значение уже выбрано'
}

export default {
	mounted() {
		document.addEventListener('click', this.onBodyClick)
		document.addEventListener('keydown', this.onKeyDown)
		this.multiSelectInput = this.$refs.MultiSelectInput
		this.singleLineInput = this.$refs.MultiSelectInput.$refs.SingleLineInput
	},
	beforeDestroy() {
		document.removeEventListener('click', this.onBodyClick)
	},
	components: {
		SimpleMenuItem,
		MultiSelectInput
	},
	props: {
		value: { type: null, default: _ => [] },
		required: { type: Boolean, default: true },
		menuItems: { type: Array, default: _ => [] },
		title: String,
		type: { type: String, default: 'simple' },
		keyProperty: { type: null, default: 'value' },
		draggable: { type: Boolean, default: false },
		placeholder: { type: String, default: 'Начните вводить текст' },
		placeholderDisabled: { type: String, default: 'Невозможно выбрать' },
		limit: Number,
		strict: { type: Boolean, default: false }
	},
	data() {
		return {
			menuVisible: false,
			types: {
				// user: UserCard,
				simple: SimpleMenuItem
			},
			activeItems: this.value,
			focusedItemIndex: void 0,
			currentMenuItems: this.menuItems,
			filteredMenuItems: this.menuItems
		}
	},
	computed: {
		activeIndexes() {
			return this.activeItems.map((el, i) => this.menuContentItemsMapped[this.getContent(el)])
		},
		activeFilteredIndexes() {
			return this.activeItems.map((el, i) => this.menuContentFilteredItemsMapped[this.getContent(el)])
		},
		activeIndexesMapped() {
			return this.activeIndexes.reduce((acc, el) => {
				acc[el] = true
				return acc
			}, {})
		},
		activeFilteredIndexesMapped() {
			return this.activeFilteredIndexes.reduce((acc, el) => {
				acc[el] = true
				return acc
			}, {})
		},
		menuContentItems() {
			return this.currentMenuItems.map(el => this.getContent(el))
		},
		menuContentFilteredItems() {
			return this.filteredMenuItems.map(el => this.getContent(el))
		},
		menuContentItemsMapped() {
			return this.currentMenuItems.reduce((acc, el, i) => {
				acc[el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el] = i
				return acc
			}, {})
		},
		menuContentFilteredItemsMapped() {
			return this.filteredMenuItems.reduce((acc, el, i) => {
				acc[el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el] = i
				return acc
			}, {})
		},
		inputDisabled() {
			return this.disabled || (this.limit && this.tagItems.length >= this.limit)
		}
	},
	methods: {
		async confirm() {
			if (this.required && !this.activeItems.length) {
				this.singleLineInput.setMessage(MESSAGE.fillEmptyField)
				return
			}
			await this.multiSelectInput.addTag()
			return this.singleLineInput.getMessage() ? void 0 : this.activeItems
		},
		clear() {
			this.activeItems = []
			this.multiSelectInput.clear()
		},
		reset() {
			this.activeItems = this.value
			this.multiSelectInput.reset()
		},
		showMenu() {
			this.singleLineInput.setMessage('')
			this.menuVisible = true
		},
		clickItem(i) {
			if (
				!this.activeFilteredIndexesMapped[i] &&
				(this.limit === void 0 ? true : this.activeItems.length < this.limit)
			) {
				this.multiSelectInput.addTag(this.menuContentFilteredItems[i])
			}
		},
		getContent(el) {
			return el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el
		},
		iconClickValidator(value) {
			if (value === void 0) return
			if (this.strict) {
				if (!this.menuContentItemsMapped.hasOwnProperty(value)) {
					return 'Значения нет в списке'
				}
			}
		},
		async validator(value) {
			this.filteredMenuItems = this.menuContentItems.filter(el => RegExp(value).test(el))
		},
		onBodyClick(e) {
			if (!this.$el.contains(e.target) || e.target.tagName !== 'INPUT') {
				this.menuVisible = false
				this.focusedItemIndex = void 0
			}
		},
		onKeyDown(e) {
			if (this.menuVisible) {
				if (e.key === 'ArrowDown') {
					if (this.focusedItemIndex === void 0 || this.focusedItemIndex === this.filteredMenuItems.length - 1) {
						if (this.activeFilteredIndexesMapped[0]) {
							let focusedItemIndex = 0
							for (let i = 0; i < this.filteredMenuItems.length - 1; i++) {
								const index =
									i + focusedItemIndex >= this.filteredMenuItems.length
										? this.filteredMenuItems.length - i + focusedItemIndex
										: i + focusedItemIndex
								console.log(index)
								if (!this.activeFilteredIndexesMapped[index]) {
									this.focusedItemIndex = index
									break
								}
							}
						} else {
							this.focusedItemIndex = 0
						}
					} else {
						let focusedItemIndex = this.focusedItemIndex
						for (let i = 0; i < this.filteredMenuItems.length - 1; i++) {
							const index =
								(i + focusedItemIndex >= this.filteredMenuItems.length
									? this.filteredMenuItems.length - i + focusedItemIndex
									: i + focusedItemIndex) - 1
							console.log(index)
							console.log(this.activeFilteredIndexesMapped)
							if (!this.activeFilteredIndexesMapped[index]) {
								this.focusedItemIndex = index
								break
							}
						}
					}
				}
				if (e.key === 'ArrowUp') {
					if (this.focusedItemIndex === void 0 || this.focusedItemIndex === 0) {
						if (this.activeFilteredIndexesMapped[this.filteredMenuItems.length - 1]) {
							for (let i = this.activeFilteredIndexes.length - 1; i > 0; i--) {
								if (!this.activeFilteredIndexesMapped[i - 1]) {
									this.focusedItemIndex = i - 1
									break
								}
							}
						} else {
							this.focusedItemIndex = this.filteredMenuItems.length - 1
						}
					} else {
						for (let i = this.focusedItemIndex - 1; i >= 0; i--) {
							if (!this.activeFilteredIndexesMapped[i]) {
								this.focusedItemIndex = i
								break
							}
						}
					}
				}
			}
			if (e.key === 'Enter') {
				if (this.focusedItemIndex !== void 0) {
					this.clickItem(this.focusedItemIndex)
					this.focusedItemIndex = void 0
				} else {
					this.multiSelectInput.addTag()
				}
				this.menuVisible = false
			}
		},
		onInput(items) {
			this.menuVisible = false
			this.activeItems = items
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
	width 100%
	max-height 400px
	min-width 40px
	background-color $white
	border $border-width_base solid $whisper
	border-top none
	border-radius 0 0 $border-radius_base $border-radius_base
	box-shadow $shadow_base
	box-sizing border-box
	overflow-y auto
	z-index 2

.droplist__menu-item_selected
	background-color $ghostwhite

.droplist__menu-item_focused
	background-color $lightgrey

.droplist__arrow-wrapper
	position absolute
	top 1px
	bottom 1px
	right 1px
	width 30px
	z-index 1
	background-color $white
	border-radius $border-radius_base
	transition all $transition-duration_base

.droplist__arrow
	position relative
	display inline-block
	top 6px
	right -6px
	border-top 6px solid $whisper
	border-left 6px solid transparent
	border-right 6px solid transparent
	transform-origin 50% 40%
	transition all $transition-duration_base

.droplist__arrow_up
	transform rotate(180deg)

.fade-enter-active, .fade-leave-active
	transition all $transition-duration_fast

.fade-enter, .fade-leave-to
	opacity 0
</style>