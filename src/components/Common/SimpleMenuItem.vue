<template>
  <div
		class="menu-item"
		:class="{
			'menu-item_active':active,
			'menu-item_focused':focused
		}"
		@click="onClick"
	>{{content}}</div>
</template>

<script>
export default {
	props: {
		value: null,
		active: Boolean,
		focused: Boolean,
		keyProperty: { type: null, default: 'value' },
		contentProperty: String
	},
	computed: {
		content() {
			if (typeof this.value === 'object') {
				return this.value[this.contentProperty]
			} else {
				return this.value
			}
		}
	},
	methods: {
		getValue() {
			return this.content
		},
		onClick() {
			this.$emit('click', this.value, this.content)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.menu-item
	padding 8px $padding_very-small
	cursor pointer
	overflow hidden

	&:hover
		background-color $whisper

.menu-item_active
	background-color $ghostwhite

.menu-item_focused
	background-color $lightgrey
</style>