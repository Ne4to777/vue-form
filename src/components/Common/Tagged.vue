<template>
  <div class="tagged">
    <transition-group name="tags" tag="div">
      <div v-for="(item, i) in items" :key="item" class="tagged-item tagged__tagged-item">
          <span :key="item+1">{{item}}</span>
          <span :key="item+2" @click="$emit('close',i)" class="tagged__close"></span>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
	props: ['initValue'],
	data() {
		return {
			items: this.initValue instanceof Array ? this.initValue : [this.initValue]
		}
	}
}
</script>

<style lang="stylus" scoped>
@import './../../assets/stylus/global.styl'

.tagged
  position relative
  max-width 200px
  margin-left - $margin__very-small
  transition all 1s

.tagged__tagged-item
  margin 0px 0px 8px $margin__very-small

.tagged-item
  padding 4px 25px 4px $padding__very-small
  display inline-block
  border $border-width__base solid $whisper
  background-color $ghostwhite
  position relative
  box-sizing border-box
  line-height normal
  white-space nowrap
  border-radius $border-radius__small
  color $black
  font-size $font-size__extra-small
  cursor pointer
  user-select none

.tagged__close
  width 16px
  height 16px
  top 3px
  right 3px
  position absolute
  transition 0.4s
  cursor pointer

.tagged__close:hover, .tagged__close:active
  transform rotate(90deg)

.tagged__close:before, .tagged__close:after
  content ''
  display block
  position absolute
  background-color #989B9D

.tagged__close:before
  width 2px
  margin 0px 0px 0px -1px
  top 2px
  bottom 2px
  left 50%
  transform rotate(45deg)

.tagged__close:after
  height 2px
  margin -1px 0px 0px 0px
  top 50%
  left 2px
  right 2px
  transform rotate(45deg)

.tags-enter-active, .tags-leave-active
  transition all $transition-duration__base

.tags-enter, .tags-leave-to
  opacity 0
</style>