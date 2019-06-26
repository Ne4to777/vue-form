<template>
  <div class="coordinates-input">
    <single-line-input
      ref="Latitude"
      class="coordinates-input__input coordinates-input__latitude"
    />
    <single-line-input
      ref="Longitude"
      class="coordinates-input__input coordinates-input__longitude"
    />
  </div>
</template>

<script>
import SingleLineInput from '@/components/SingleLineInput/SingleLineInput'
export default {
	components: { SingleLineInput },
	methods: {
		confirm() {
			return Promise.all([this.$refs.Latitude.confirm(), this.$refs.Longitude.confirm()])
		}
	}
}
</script>
<style lang="stylus" scoped>
// .coordinates-input__input
// display inline-block
// box-sizing border-box

// .coordinates-input__latitude
// width 50%

// .coordinates-input__longitude
// border-left 50px solid rgba(0, 0, 0, 0)
// width 50%
.coordinates-input
  // display flex
  // justify-content space-between

.coordinates-input__input
  // flex-basis 50%

.coordinates-input__longitude
  // margin-left 20px
</style>