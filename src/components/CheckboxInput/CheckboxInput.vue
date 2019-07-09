<template>
  <div class="checkbox-input">
    <label class="checkbox-input__label" :class="current.disabled? 'cursor_not-allowed': 'cursor_pointer'">
	  	<input
        type="checkbox"
				:checked="current.value"
        :disabled="current.disabled"
        class="checkbox-input__input"
        v-show="false"
        @input="onInput"
      >
      <span class="checkbox-input__fake-input">
        <transition name="fade">
          <div
            class="checkbox-input__checker"
            :class="current.disabled ? 'checkbox-input__checker_grey' : 'checkbox-input__checker_blue'"
            v-show="current.value">
          </div>
        </transition>
      </span>
		  <div class="checkbox-input__title" for="checkbox-input__input">{{title}}</div>
    </label>
	</div>
</template>

<script>
import mixin from '@/components/Common/mixins/inputMixin';
export default {
  mixins: [mixin],
  data() {
    return {
      empty: {
        value: false
      }
    };
  },
  methods: {
    onInput(e) {
      this.current.value = e.target.checked;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl';

.checkbox-input__label {
	overflow: hidden;
	display: block;
}

.checkbox-input__fake-input {
	width: 14px;
	height: 14px;
	border: 1px solid $lightgrey;
	border-radius: 4px;
	position: relative;
	float: left;
}

.checkbox-input__checker {
	display: block;
	position: absolute;
	top: 4px;
	right: 4px;
	bottom: 4px;
	left: 4px;
	border-radius: 2px;
}

.checkbox-input__checker_blue {
	background-color: $blue;
}

.checkbox-input__checker_grey {
	background-color: $grey;
}

.checkbox-input__title {
	margin-left: $margin_very-large;
	user-select: none;
}

.fade-enter-active, .fade-leave-active {
	transition: opacity $transition-duration_base;
}

.fade-enter, .fade-leave-to {
	opacity: 0;
}
</style>