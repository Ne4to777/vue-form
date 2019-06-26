<template>
  <tag :closable="closable" @close="$emit('close')">
    <div>Имя: Ваня</div>
    <div>Должность: Эксперт</div>
  </tag>
</template>

<script>
import Tag from '@/components/Common/Tag'
export default {
	components: { Tag },
	props: {
		closable: Boolean
	}
}
</script>

<style lang="stylus" scoped>
</style>