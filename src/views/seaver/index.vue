<template>
  <div class="all">
    <card_08/>
    <card_06 />
    <card_09 />
  </div>
</template>

<script>
  import card_08 from '@/components/cards/card_08'
  import card_06 from '@/components/cards/card_06'
  import card_09 from '@/components/cards/card_09'

  export default {
    name: "index",
    components: {
      card_08,
      card_06,
      card_09,
    },
  }
</script>

<style scoped>

</style>
