<template>
  <div class="droplist">
		<multi-select-input
			ref="MultiSelectInput"
			:value="activeItems"
			:title="title"
			:disabled="true"
			:placeholder="placeholderComputed"
      :placeholder-disabled="placeholderComputed"
			:classes="[{cursor_pointer:true},{'border-radius_bottom-fix':menuVisible && menuItems.length}]"
      :is-icon-visible="false"
      :draggable="draggable"
			@input-click="toggleMenu"
			@input="onInput"
		>
			<div class="droplist__arrow-wrapper">
				<div class="droplist__arrow" :class="{droplist__arrow_up:menuVisible}"></div>
			</div>
		</multi-select-input>
		<div class="droplist__menu" v-if="menuItems.length && menuVisible">
			<component
				v-for="(item, i) in menuContentItems"
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
	valueExists: 'Значение уже выбрано',
	disabled: 'Невозможно выбрать'
}

export default {
	mounted() {
		document.addEventListener('click', this.onBodyClick)
		document.addEventListener('keydown', this.onKeyDown)
		this.multiLineInput = this.$refs.MultiSelectInput
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
		placeholder: { type: String, default: 'Выберите элементы' },
		limit: Number
	},
	data() {
		return {
			menuVisible: false,
			types: {
				// user: UserCard,
				simple: SimpleMenuItem
			},
			activeIndexes: this.value,
			focusedItemIndex: void 0
		}
	},
	computed: {
		activeItems() {
			return this.activeIndexes.map((el, i) => this.menuItems[el])
		},
		activeIndexesMapped() {
			return this.activeIndexes.reduce((acc, el) => {
				acc[el] = true
				return acc
			}, {})
		},
		menuContentItems() {
			return this.menuItems.map(el => this.getContent(el))
		},
		menuContentItemsMapped() {
			return this.menuItems.reduce((acc, el, i) => {
				acc[el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el] = i
				return acc
			}, {})
		},
		placeholderComputed() {
			return this.limit && this.limit <= this.activeIndexes.length ? MESSAGE.disabled : this.placeholder
		}
	},
	methods: {
		confirm() {
			if (this.required && !this.activeItems.length) {
				this.multiLineInput.$refs.SingleLineInput.setMessage(MESSAGE.fillEmptyField)
				return
			}
			return this.activeItems
		},
		clear() {
			this.activeIndexes = []
			this.multiLineInput.clear()
		},
		reset() {
			this.activeIndexes = this.value
			this.multiLineInput.reset()
		},
		toggleMenu() {
			this.multiLineInput.$refs.SingleLineInput.setMessage('')
			if (this.limit) {
				if (this.limit > this.activeIndexes.length) {
					this.menuVisible = !this.menuVisible
				}
			} else {
				this.menuVisible = !this.menuVisible
			}
		},
		clickItem(i) {
			this.menuVisible = false
			if (!this.activeIndexesMapped[i] && (this.limit === void 0 ? true : this.activeItems.length < this.limit)) {
				this.multiLineInput.addTag(this.menuContentItems[i])
			}
		},
		onBodyClick(e) {
			if (!this.$el.contains(e.target) || e.target.tagName !== 'INPUT') {
				this.menuVisible = false
				this.focusedItemIndex = void 0
			}
		},
		getContent(el) {
			return el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el
		},
		onKeyDown(e) {
			if (this.menuVisible) {
				if (e.key === 'ArrowDown') {
					if (this.focusedItemIndex === void 0 || this.focusedItemIndex === this.menuItems.length - 1) {
						this.focusedItemIndex = 0
					} else {
						this.focusedItemIndex += 1
					}
				}
				if (e.key === 'ArrowUp') {
					if (this.focusedItemIndex === void 0 || this.focusedItemIndex === 0) {
						this.focusedItemIndex = this.menuItems.length - 1
					} else {
						this.focusedItemIndex -= 1
					}
				}
			}
			if (e.key === 'Enter' && this.focusedItemIndex !== void 0) {
				this.clickItem(this.focusedItemIndex)
				// this.activeIndex = this.focusedItemIndex
				this.focusedItemIndex = void 0
				this.menuVisible = false
			}
		},
		onInput(items) {
			this.menuVisible = false
			if (items.length >= this.activeIndexes.length) {
				items.map(el => {
					const content = this.getContent(el)
					if (this.menuContentItemsMapped.hasOwnProperty(content)) {
						const index = this.menuContentItemsMapped[content]
						if (!this.activeIndexesMapped[index]) {
							this.activeIndexes = this.activeIndexes.concat(index)
						}
					}
				})
			} else {
				this.activeIndexes = this.activeIndexes.reduce((acc, el) => {
					const content = this.menuContentItems[el]
					const isExists = items.some(el => this.getContent(el) === content)
					if (isExists) {
						acc = acc.concat(el)
					}
					return acc
				}, [])
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