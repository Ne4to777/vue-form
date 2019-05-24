<template>
	<div>
		<SingleLineInput 
			ref="SingleLineInput"
			title="Привет"
			:required="true"
			name="someInput"
			initValue="hiaa"
			:disabled="false"
			v-model="singleInputValue"
			:validator="singleInputValidator"
			icon="user"
			mask="date"
			:isValidateOnChange="false"
			@iconClick="onIconClick"
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
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'
import Button from '@/components/Common/Button'
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
			disables: [true, false],
			singleInputValue: ''
		}
	},
	methods: {
		async onButtonClick() {
			console.log(await this.$refs.SingleLineInput.confirm())
			setTimeout(() => {
				this.$refs.SingleLineInput.reset()
			}, 1000)
		},
		singleInputValidator(value) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(value.length > 5 ? 'too long' : void 0)
				}, 100)
			})
		},
		onIconClick() {
			console.log('click')
		}
	}
}
</script>

<style lang="stylus">
@import './assets/stylus/fonts.styl'
@import './assets/stylus/global.styl'
@import './assets/stylus/icons.styl'

body
	font-family Roboto
	font-weight $font-weight__base
	font-size $font-size__very-small
	margin 0

.s-icon
	background-color $white
	color $grey

.s-icon_hover:active, .s-icon_hover:hover
	color $blue
	cursor pointer
</style>
