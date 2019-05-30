<template>
	<div>
		<SingleLineInput 
			ref="SingleLineInput"
			name="someInput"
			title="Hello"
			:isValidateOnChange="true"
			:isValidateOnBlur="true"
			:value="singleInputValue"
			mask="date"
			validator:="singleInputValidator"
			:max="6"
			icon="plus"
			@iconClick="onIconClick"
		/>
		<DroplistInput
			ref="DroplistInput"
			:menuItems="colors"
			:limit="6"
			type="simple"
			title="droplist"
			:draggable="true"
			class="indented"
		/>
		<DroplistMultiInput
			ref="DroplistMultiInput"
			:value="[3]"
			:menuItems="colors"
			:limit="6"
			type="simple"
			title="droplist"
			:draggable="false"
			class="indented"
			:editable="true"
		/>
		<SearchInput
			ref="SearchInput"
			:value="[3]"
			:menuItems="colors"
			:limit="6"
			type="simple"
			title="droplist"
			:draggable="false"
			class="indented"
			:editable="true"
		/>

		<Button @click.native="onButtonClick"/>
<!-- 		<span v-for="color in colors">
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
		</span> -->

	</div>
</template>

<script>
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'
import HtmlInput from '@/components/HtmlInput/HtmlInput'
import DescriptionInput from '@/components/DescriptionInput/DescriptionInput'
import QuestionInput from '@/components/QuestionInput/QuestionInput'
import CheckboxInput from '@/components/CheckboxInput/CheckboxInput'
import DroplistInput from '@/components/DroplistInput/DroplistInput'
import DroplistMultiInput from '@/components/DroplistMultiInput/DroplistMultiInput'
import MultiSelectInput from '@/components/MultiSelectInput/MultiSelectInput'
import SearchInput from '@/components/SearchInput/SearchInput'
import ModelInputParent from '@/components/ModelInputParent/ModelInputParent'
import Title from '@/components/Common/Title'
import Button from '@/components/Common/Button'
import UserCard from '@/components/Common/UserCard'
export default {
	name: 'aura-form',
	components: {
		Title,
		Button,
		SingleLineInput,
		DescriptionInput,
		QuestionInput,
		CheckboxInput,
		DroplistInput,
		DroplistMultiInput,
		MultiSelectInput,
		SearchInput,
		HtmlInput,
		ModelInputParent
	},
	data() {
		return {
			colors: ['blue', 'grey', 'green', 'lightgreen', { value: 'red', closable: false }],
			fills: [true, false],
			disables: [true, false],
			singleInputValue: 'yvaa',
			checked: true,
			chekboxDisabled: true
		}
	},
	methods: {
		async onButtonClick() {
			const input = this.$refs.DroplistMultiInput
			console.log(await input.confirm())
			// setTimeout(() => {
			// 	input.clear()
			// 	setTimeout(() => {
			// 		input.reset()
			// 	}, 1000)
			// }, 1000)
		},
		singleInputValidator(value) {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve(value && value.length > 5 ? 'too long' : void 0)
				}, 100)
			})
		},
		onIconClick() {
			console.log('click')
		},
		onCheckboxInput(e) {
			this.checked = e
			console.log(e)
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
	font-weight $font-weight_base
	font-size $font-size_very-small
	margin 0

.indented
	margin 100px

.s-icon
	background-color $white
	color $grey

.s-icon_hover:active, .s-icon_hover:hover
	color $blue
	cursor pointer
</style>
