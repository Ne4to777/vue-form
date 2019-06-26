<template>
	<div class="menu" v-if="value.length">
		<component
			v-for="item in items"
			:is="types[itemType.toLowerCase()]"
			:value="item"
			:active="activeMapped[item[keyProperty]] !== void 0"
			:focused="item[keyProperty] === focusedKey"
			:key-property="keyProperty"
			:content-property="contentProperty"
      @click="onItemClick"
		/>
	</div>
</template>

<script>
import SimpleMenuItem from '@/components/Common/SimpleMenuItem'
export default {
	components: {
		SimpleMenuItem
	},
	props: {
		value: null,
		active: { type: Array, default: _ => [] },
		focusedKey: null,
		itemType: { type: String, default: 'simple' },
		keyProperty: { type: null, default: 'value' },
		contentProperty: String
	},
	watch: {
		value: {
			handler(x) {
				this.items = x
			},
			deep: true
		}
	},
	data() {
		return {
			items: this.value,
			types: {
				// user: UserCard,
				simple: SimpleMenuItem
			}
		}
	},
	computed: {
		activeMapped() {
			return this.active.reduce((acc, el, i) => {
				acc[el] = el
				return acc
			}, {})
		}
	},
	methods: {
		onItemClick(value, content) {
			this.$emit('click', value, content)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.menu
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

.menu-item_selected
	background-color $ghostwhite

.menu-item_focused
	background-color $lightgrey
</style>