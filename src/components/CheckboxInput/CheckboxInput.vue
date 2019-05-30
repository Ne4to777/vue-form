<template>
  <div class="checkbox">
    <label class="checkbox__label" :class="disabled? 'cursor_not-allowed': 'cursor_pointer'">
	  	<input
        type="checkbox"
				:checked="checked"
        v-show="false"
        class="checkbox__input"
        :disabled="disabled"
        @input="onInput"
      >
          <span class="checkbox__fake-input">
            <transition name="fade">
              <div
                class="checkbox__checker"
                :class="disabled ? 'checkbox__checker_grey' : 'checkbox__checker_blue'"
                v-show="checked">
              </div>
            </transition>
          </span>
				<div class="checkbox__title" for="checkbox__input">{{title}}</div>
      </label>
	</div>
</template>

<script>
export default {
	props: {
		disabled: { type: Boolean, default: false },
		title: String,
		name: String,
		value: Boolean
	},
	data() {
		return {
			checked: this.value
		}
	},
	watch: {
		value(x) {
			this.checked = x
		}
	},
	methods: {
		getValue() {
			return this.checked
		},
		confirm() {
			return this.checked
		},
		clear() {
			this.checked = false
		},
		reset() {
			this.checked = this.value
		},
		onInput(e) {
			this.checked = e.target.checked
			this.$emit('input', e.target.checked)
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.cursor_not-allowed
  cursor not-allowed

.cursor_pointer
  cursor pointer

.checkbox__label
  overflow hidden
  display block

.checkbox__fake-input
  width 14px
  height 14px
  border 1px solid $lightgrey
  border-radius 4px
  position relative
  float left

.checkbox__checker
  display block
  position absolute
  top 4px
  right 4px
  bottom 4px
  left 4px
  border-radius 2px

.checkbox__checker_blue
  background-color $blue

.checkbox__checker_grey
  background-color $grey

.checkbox__title
  margin-left $margin_very-large
  user-select none

.fade-enter-active, .fade-leave-active
  transition opacity $transition-duration_base

.fade-enter, .fade-leave-to
  opacity 0
</style>