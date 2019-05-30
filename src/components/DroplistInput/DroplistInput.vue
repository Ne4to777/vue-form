<template>
  <div class="droplist">
	  <SingleLineInput
			ref="SingleLineInput"
			:title="title"
			:disabled="true"
			:placeholder="placeholder"
			:placeholder-disabled="placeholderDisabled"
			:classes="[{cursor_pointer:true},{'border-radius_bottom-fix':menuVisible && menuItems.length}]"
			icon-classes="droplist__arrow"
			:value="inputValue"
			:selectable="false"
			:is-icon-visible="true"
			customIcon=""
			@input-click="toggleMenu"
			@input="onInput"
		><div class="droplist__arrow-wrapper"><div class="droplist__arrow" :class="{droplist__arrow_up:menuVisible}"></div></div></SingleLineInput>
		<div class="droplist__menu" v-if="menuItems.length && menuVisible">
			<component
				v-for="(item, i) in menuContentItems"
				ref="MenuItem"
				:is="types[type.toLowerCase()]"
				:value="item"
				:class="{'droplist__menu-item':activeIndex === i}"
				@click.stop.native="clickItem(i)"
			/>
		</div>
	</div>
</template>

<script>
import SimpleMenuItem from '@/components/Common/SimpleMenuItem'
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'

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
		SingleLineInput
	},
	props: {
		value: null,
		required: { type: Boolean, default: true },
		menuItems: { type: Array, default: _ => [] },
		title: String,
		type: { type: String, default: 'simple' },
		keyProperty: { type: null, default: 'value' },
		placeholder: { type: String, default: 'Выберите один из элементов' },
		placeholderDisabled: { type: String, default: 'Выберите один из элементов' }
	},
	data() {
		return {
			menuVisible: false,
			types: {
				// user: UserCard,
				simple: SimpleMenuItem
			},
			activeIndex: this.value
		}
	},
	computed: {
		activeItem() {
			return this.activeIndex === void 0 ? void 0 : this.menuItems[this.activeIndex]
		},
		inputValue() {
			const item = this.activeItem
			if (item === void 0) return ''
			return item.hasOwnProperty(this.keyProperty) ? item[this.keyProperty] : item
		},
		menuContentItems() {
			return this.menuItems.map(el => (el.hasOwnProperty(this.keyProperty) ? el[this.keyProperty] : el))
		},
		input() {
			return this.$refs.SingleLineInput
		}
	},
	methods: {
		confirm() {
			return this.activeItem
		},
		clear() {
			this.activeIndex = void 0
			this.input.clear()
		},
		reset() {
			this.activeIndex = this.value
			this.input.reset()
		},
		toggleMenu() {
			this.menuVisible = !this.menuVisible
		},
		clickItem(i) {
			this.menuVisible = false
			if (this.activeIndex !== i) {
				this.activeIndex = i
				this.$emit('input', this.activeItem)
			}
		},
		onBodyClick() {
			this.menuVisible = false
		},
		onInput(value) {
			// this.inputValue = value
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