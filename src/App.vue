<template>
	<div class="indented">
		<!-- <tag :closable="true">yvavya</tag>
		<user-card :closable="true">yvavya</user-card>
		<checkbox-input
			ref="CheckboxInput"
			:title="checkboxTitle"
			v-model="checked"
			:disabled="false"
		/> -->
		<!-- <default-button @click="onCheckboxButtonClick"/> -->
		<!-- <single-line-input 
			ref="SingleLineInput"
			title="Hi"
			v-model="singleInputValue"
			placeholder="Date"
			mask="11.11.11"
			icon="magnifier"
		/> -->
		<!-- <date-time-input 
			ref="SingleLineInput"
			title="Hi"
			v-model="dateTimeValue"
			:hasDatePicker="false"
			:hasTimePicker="true"
			:showSeconds="false"
			:editable="true"
			:is-range="false"
			:required="true"
		/> -->
		<coordinates-input 
			ref="SingleLineInput"
			title="Hi"
			v-model="dateTimeValue"
			:hasDatePicker="false"
			:hasTimePicker="true"
			:showSeconds="false"
			:editable="true"
			:is-range="false"
			:required="true"
		/>
		<default-button @click="onSingleLineClick"/>
		<!-- <multi-select-input 
			ref="MultiSelectInput"
			name="MultiSelectInput"
			title="Hello"
			v-model="multiSelectInputValue"
			:init-value="multiSelectInputValue"
			:required="required"
			:validator="singleInputValidator"
			key-property="key"
			content-property="value"
		/> -->

		<!-- <search-input
			ref="SearchInput"
			type="simple"
			title="search"
			:menuItems="searchMenuItems"
			:strict="true"
			:max="4"
			key-property="key"
			:search-property="['val1','val2']"
			content-property="val1"
		/> -->

		<!-- <search-multi-input
			ref="SearchMultiInput"
			type="simple"
			title="searchMulti"
			v-model="searchInputValue"
			:init-value="[2]"
			:menuItems="searchMenuItems"
			:strict="true"
			:max="4"
			key-property="key"
			:search-property="['val1','val2']"
			content-property="val1"
		/> -->

		<!-- <default-button @click="onButtonClick"/> -->
		<!-- <div>
			<span v-for="color in buttonColors">
				<span v-for="fill in fills">
					<span v-for="disabled in disables">
						<span v-for="borderless in [true,false]">
							<default-button 
								@click="onButtonClick(arguments[0])" 
								:filled="fill"
								:color="color"
								:disabled="disabled"
								:borderless="borderless"
								value="Это какая-то дикая дичь"
							/>
						</span>
					</span>
				</span>
			</span>
		</div> -->
	</div>
</template>

<script>
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'
import DateTimeInput from '@/components/DateTimeInput/DateTimeInput'
import CoordinatesInput from '@/components/CoordinatesInput/CoordinatesInput'
import HtmlInput from '@/components/HtmlInput/HtmlInput'
import DescriptionInput from '@/components/DescriptionInput/DescriptionInput'
import QuestionInput from '@/components/QuestionInput/QuestionInput'
import CheckboxInput from '@/components/CheckboxInput/CheckboxInput'
import DroplistInput from '@/components/DroplistInput/DroplistInput'
import DroplistMultiInput from '@/components/DroplistMultiInput/DroplistMultiInput'
import MultiSelectInput from '@/components/MultiSelectInput/MultiSelectInput'
import SearchInput from '@/components/SearchInput/SearchInput'
import SearchMultiInput from '@/components/SearchMultiInput/SearchMultiInput'
import ModelInputParent from '@/components/ModelInputParent/ModelInputParent'
import Title from '@/components/Common/Title'
import Tag from '@/components/Common/Tag'
import InputLabel from '@/components/Common/InputLabel'
import DefaultButton from '@/components/Common/DefaultButton'
import UserCard from '@/components/Common/UserCard'

const idle = _ => new Promise(resolve => setTimeout(_ => resolve(), 500))

export default {
	name: 'aura-form',
	components: {
		Title,
		Tag,
		UserCard,
		InputLabel,
		DefaultButton,
		SingleLineInput,
		DateTimeInput,
		CoordinatesInput,
		DescriptionInput,
		QuestionInput,
		CheckboxInput,
		DroplistInput,
		DroplistMultiInput,
		MultiSelectInput,
		SearchInput,
		SearchMultiInput,
		HtmlInput,
		ModelInputParent
	},
	data() {
		return {
			buttonColors: ['blue', 'grey', 'green', 'lightgreen', 'red'],
			colors: ['blue', 'grey', 'green', 'lightgreen', { value: 'red', closable: false }],
			fills: [true, false],
			disables: [true, false],
			singleInputValue: '+1 (345) 534-53-45',
			searchInputValue: [1, 2],
			checked: false,
			checkboxTitle: 'hi',
			chekboxDisabled: true,
			menuItems: [{ value: 'one' }, { value: 'two' }, { value: 'three' }],
			searchMenuItems: [
				{ val1: 'one', val2: 'hi1', key: 1 },
				{ val1: 'two', val2: 'hi2', key: 2 },
				{ val1: 'three', val2: 'hi3', key: 3 }
			],
			required: true,
			multiSelectInputValue: ['blue', 'grey', 'green', 'lightgreen', { value: 'red', closable: false }],
			dateTimeValue: new Date()
		}
	},
	methods: {
		log(...args) {
			console.log(...args)
		},
		async onCheckboxButtonClick() {
			const input = this.$refs.CheckboxInput
			console.clear()
			input.clear()
			console.log(await input.confirm()) // false
			await idle()
			await (this.checked = true)
			// input.setValue(true)
			console.log(await input.confirm()) // true
			await idle()
			input.clear()
			console.log(await input.confirm()) // false
			await idle()
			input.reset()
			console.log(await input.confirm()) // false
		},
		onSingleLineClick() {
			const input = this.$refs.SingleLineInput
			input
				.confirm()
				.then(console.log)
				.catch(console.error)
		},
		async onButtonClick() {
			const input = this.$refs.CheckboxInput
			console.log(await input.confirm())
			setTimeout(() => {
				input.clear()
				setTimeout(() => {
					input.reset()
				}, 1000)
			}, 1000)
		},
		singleInputValidator(value) {
			return new Promise((resolve, reject) =>
				setTimeout(() => (/_/.test(value) ? reject('Дозаполните') : resolve(value)), 500)
			)
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
	margin 10px 100px

.indented>*
	margin 20px 0

.s-icon
	background-color $white
	color $grey

.s-icon_hover:active, .s-icon_hover:hover
	color $blue
	cursor pointer
</style>
