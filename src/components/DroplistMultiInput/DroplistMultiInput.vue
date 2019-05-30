<template>
  <div class="droplist">
		<MultiSelectInput
			ref="MultiSelectInput"
			:value="activeItems"
			:title="title"
			:disabled="true"
			:placeholder="placeholder"
      :placeholder-disabled="placeholderDisabled"
			:classes="[{cursor_pointer:true},{'border-radius_bottom-fix':menuVisible && menuItems.length}]"
      :is-icon-visible="false"
      :draggable="draggable"
			@input-click="toggleMenu"
			@input="onInput"
		><div class="droplist__arrow-wrapper"><div class="droplist__arrow" :class="{droplist__arrow_up:menuVisible}"></div></div></MultiSelectInput>
		<div class="droplist__menu" v-if="menuItems.length && menuVisible">
			<component
				v-for="(item, i) in menuContentItems"
				ref="MenuItem"
				:is="types[type.toLowerCase()]"
				:value="item"
				:class="{'droplist__menu-item':activeIndexes.some(el=>el===i)}"
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
	mounted: function() {
		document.addEventListener('click', this.onBodyClick)
	},
	beforeDestroy: function() {
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
		placeholderDisabled: { type: String, default: 'Выберите элементы' }
	},
	data() {
		return {
			menuVisible: false,
			types: {
				// user: UserCard,
				simple: SimpleMenuItem
			},
			activeIndexes: this.value
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
		input() {
			return this.$refs.MultiSelectInput
		},
		inputDisabled() {
			return this.disabled || (this.limit && this.tagItems.length >= this.limit)
		}
	},
	methods: {
		confirm() {
			return this.activeItems
		},
		clear() {
			this.activeIndexes = []
			this.input.clear()
		},
		reset() {
			this.activeIndexes = this.value
			this.input.reset()
		},
		toggleMenu() {
			this.menuVisible = !this.menuVisible
		},
		clickItem(i) {
			this.menuVisible = false
			if (!this.activeIndexesMapped[i]) {
				this.input.addTag(this.menuContentItems[i])
			}
		},
		onBodyClick() {
			this.menuVisible = false
		},
		getContent(el) {
			return el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el
		},
		onInput(items) {
			this.items = items
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
  background-color $white
  border $border-width_base solid $whisper
  border-top none
  border-radius 0 0 $border-radius_base $border-radius_base
  box-shadow $shadow_base
  box-sizing border-box
  overflow-y auto
  z-index 2

.droplist__menu-item
  background-color $ghostwhite

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