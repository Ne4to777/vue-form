<template>
  <div class="question"><slot></slot></div>
</template>

<script>
export default {
	props: {
		name: String
	},
	methods: {
		getValue() {
			return this.$el.innerHTML
		},
		confirm() {
			return this.$el.innerHTML
		}
	}
}
</script>

<style lang="stylus">
@import './../../assets/stylus/global.styl'
</style>