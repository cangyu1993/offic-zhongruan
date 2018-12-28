<template>
  <div class="all">
    <swper />
    <card_00/>
    <card_01/>
    <card_04/>
    <card_05/>
  </div>
</template>

<script>
  import swper from '@/components/swper'
  import card_00 from '@/components/cards/card_00'
  import card_01 from '@/components/cards/card_01'
  import card_04 from '@/components/cards/card_04'
  import card_05 from '@/components/cards/card_05'


  export default {
    name: "index",
    components: {swper, card_00, card_01, card_04, card_05},
    data() {
      return {
        imgList: []
      }
    },
    methods: {
      getSwper(){
        return new Promise((resolve,reject)=>{
          this.$axios.get('/info?pid=k_2').then(res=>{
            this.imgList = res.data.data.txt.splice(0, 4)
            resolve(res)
          }).catch(err=>{
            console.log(err)
            this.$message.error('请求失败')
            reject(err)
          })
        })
      },
      getAllPromise(){
        return new Promise((resolve,reject)=>{
          Promise.all([this.getSwper()]).then(()=>{
            resolve()
          }).catch(()=>{
            reject()
          })
        })
      },
    },
    created() {
      // this.getAllPromise()
    }
  }
</script>

<style scoped lang="scss">
  .all {
  }
</style>
