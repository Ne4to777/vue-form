<template>
  <div>
    <ModelInputChild v-model="content"/>
    parent: {{content}}
  </div>
</template>

<script>
import ModelInputChild from '@/components/ModelInputChild/ModelInputChild'
export default {
	components: { ModelInputChild },
	data() {
		return {
			content: ''
		}
	}
}
</script>

<style lang="stylus" scoped>
</style>