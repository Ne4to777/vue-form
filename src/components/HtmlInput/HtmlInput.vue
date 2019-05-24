<template>
  <div class="html"><slot></slot></div>
</template>

<script>
export default {
	props: {
		name: String
	},
	data() {
		return {
			content: ''
		}
	},
	mounted() {
		this.content = this.$el.innerHTML
	},
	methods: {
		getValue() {
			return this.$el.innerHTML
		},
		confirm() {
			return this.$el.innerHTML
		},
		clear() {
			this.$el.innerHTML = ''
		},
		reset() {
			this.$el.innerHTML = this.content
		}
	}
}
</script>

<style lang="stylus">
@import './../../assets/stylus/global.styl'
</style>