<template>
	<div>
		<SingleLineInput 
			ref="SingleLineInput"
			title="Привет"
			:required="true"
			name="someInput"
			initValue="hi"
			:disabled="false"
			v-model="singleInputValue"
			:validator="singleInputValidator"
			mask="date"
			icon="user"
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
		},
		singleInputValidator(value) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(value === 'hi' ? void 0 : 'not hi')
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

.single-line__s-icon
	position absolute
	width 14px
	height 14px
	line-height 14px
	padding $padding__extra-small
	top 50%
	right 10px
	margin -12px 0px 0px 0px
	z-index 4
</style>
