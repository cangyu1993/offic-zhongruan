<template>
  <div class="all">
    <card_02 />
    <card_03 />
    <card_07 />
  </div>
</template>

<script>

  import card_02 from '@/components/cards/card_02'
  import card_03 from '@/components/cards/card_03'
  import card_07 from '@/components/cards/card_07'
  export default {
    name: "index",
    components: {
      card_02,
      card_03,
      card_07,
    },
  }
</script>

<style scoped>

</style>
