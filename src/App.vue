<template>
	<div>
		<SingleLineInput 
			ref="SingleLineInput" 
			title="Привет" 
			:required="true"
			name="someInput"
			value="hi"
			:disabled="false"
			:max="4"
		/>
		<Button @click.native="onButtonClick"/>
		<span v-for="color in colors">
			<span v-for="fill in fills">
				<span v-for="disabled in disables">
					<Button 
						@click.native="!disabled && onButtonClick(arguments[0])" 
						:filled="fill" :color="color" 
						:disabled="disabled" 
						:borderless="true" 
						title="Это какая-то дикая дичь"
					/>
				</span>
			</span>
		</span>

	</div>
</template>

<script>
import SingleLineInput from '@/components/SingleLineInput'
import Button from '@/components/Button'
export default {
	name: 'aura-form',
	components: {
		SingleLineInput,
		Button
	},
	data() {
		return {
			colors: ['blue', 'grey', 'green', 'lightgreen', 'red'],
			fills: [true, false],
			disables: [true, false]
		}
	},
	methods: {
		async onButtonClick() {
			console.log(await this.$refs.SingleLineInput.confirm())
			console.log(this.$refs.SingleLineInput.name)
		}
	}
}
</script>

<style lang="stylus">
@import './assets/stylus/fonts.styl'
@import './assets/stylus/global.styl'

body
	font-family Roboto
	font-weight $font-weight__base
	font-size $font-size__very-small
	margin 0
</style>
