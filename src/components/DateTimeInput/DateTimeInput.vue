<template>
  <div>
		<input-label
			v-if="title"
			:with-asterisk="current.required"
			class="form-label_margin-bottom"
		>
      {{current.title}}
    </input-label>
    <div
			class="single-line-input__wrapper"
		>
      <date-picker
        v-model="current.value"
        lang="ru"
        :first-day-of-week="1"
        :format="format"
        :type="type"
        :clearable="false"
        :time-picker-options="timePickerOpts"
        :minute-step="showSeconds ? 0 : 1"
        range-separator="-"
        :editable="editable"
        :disabled="current.disabled"
        :range="isRange"
        :shortcuts="false"
        :not-before="minDate"
        :not-after="maxDate"
        :placeholder="format"
        :input-class="['single-line-input__input',{'single-line-input__input_marked':defaultErrorMessage}]"
        @change="$emit('change',$event)"
        @input="$emit('input',$event)"
      >
        <template v-slot:calendar-icon>
          <div class="s-icon s-icon-calendar"></div>
        </template>
      </date-picker>
      <transition name="fade">
				<div class="single-line-input__message" v-if="defaultErrorMessage">{{defaultErrorMessage}}</div>
			</transition>
    </div>
  </div>
</template>

<script>
import inputMixin from '@/components/Common/mixins/inputMixin'
import InputLabel from '@/components/Common/InputLabel'
import DatePicker from 'vue2-datepicker'
export default {
	components: { DatePicker, InputLabel },
	mixins: [inputMixin],
	props: {
		hasDatePicker: { type: Boolean, default: true },
		hasTimePicker: { type: Boolean, default: false },
		showSeconds: { type: Boolean, default: false },
		dateFormat: { type: String, default: 'DD.MM.YYYY' },
		timeFormat: { type: String, default: 'HH:mm' },
		timeStart: { type: String, default: '00:00' },
		timeEnd: { type: String, default: '23:59:59' },
		timeStep: String,
		editable: Boolean,
		isRange: { type: Boolean, default: false },
		minDate: Date,
		maxDate: Date
	},
	computed: {
		format() {
			const dateFormat = this.hasDatePicker ? this.dateFormat : ''
			const timeFormat = this.hasTimePicker ? `${this.timeFormat}${this.showSeconds ? ':ss' : ''}` : ''
			return dateFormat ? (timeFormat ? `${dateFormat} ${timeFormat}` : dateFormat) : timeFormat ? timeFormat : 'YYYY'
		},
		type() {
			if (this.hasDatePicker) {
				if (this.hasTimePicker) {
					return 'datetime'
				}
				return 'date'
			} else {
				if (this.hasTimePicker) {
					return 'time'
				}
				return 'year'
			}
		},
		timePickerOpts() {
			const opts = {}
			if (this.hasTimePicker) {
				opts.start = this.timeStart
				opts.end = this.timeEnd
				opts.step = this.timeStep
				if (this.showSeconds) {
				} else {
					opts.step = '00.01'
				}
				return opts
			} else {
				return null
			}
		}
	}
}
</script>

<style lang="stylus">
@import './../../assets/stylus/global.styl'

.single-line-input__wrapper
  position relative
  transition $transition-duration_base

.single-line-input__input
  display block
  padding 0 $padding_very-small
  border-width $border-width_base
  border-style solid
  border-color $whisper
  border-radius $border-radius_base
  background-color $white
  height 34px
  line-height 34px
  font-size $font-size_very-small
  width 100%
  box-sizing border-box
  outline none
  transition border-color $transition-duration_fast

  &::placeholder
    font-style italic
    color $grey

.single-line-input__input_marked
  border $border-width_base solid $red !important
  border-radius $border-radius_base

.single-line-input__message
  padding 0px $padding_very-small
  font-size $font-size_extra-small
  color $grey
  position absolute
  top -10px
  right 15px
  background-color $white
  white-space nowrap
  text-transform lowercase
  z-index 30

.mx-datepicker
  display block
  width auto

.mx-datepicker-popup
  border-radius $border-radius_base !important
  box-shadow $shadow_base

.mx-calendar
  color $black

.mx-panel-date td.last-month, .mx-panel-date td.next-month
  color $whisper

.mx-calendar-content .cell:hover
  background-color $ghostwhite
  border-radius $border-radius_base

.mx-calendar-content .cell.actived
  background-color $blue
  border-radius $border-radius_base

.mx-calendar-header > a:hover
  color $blue
</style>