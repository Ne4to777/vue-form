<template>
  <div class="checkbox">
    <label class="checkbox__label">
	  	<input
        type="checkbox"
				v-model.lazy="checked"
        @input="onClick"
        v-show="false"
        class="checkbox__input"
        :disabled="disabled"
        value="none"
        autocomplete="off">
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
		initValue: { type: Boolean, default: false }
	},
	data() {
		return {
			checked: this.initValue
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
			this.checked = this.initValue
		},
		onClick(e) {
			return e.target.checked
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.checkbox__label
  cursor pointer
  overflow hidden
  display block

.checkbox__fake-input
  width 14px
  height 14px
  border 1px solid #DEDEDE
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
  margin-left $margin__very-large
  user-select none

.fade-enter-active, .fade-leave-active
  transition opacity $transition-duration__base

.fade-enter, .fade-leave-to
  opacity 0
</style>