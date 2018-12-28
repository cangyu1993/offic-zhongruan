<template>
  <div id="wrapper">
    <div class="phone view_1" id="phone_1">
      <iframe src="http://192.168.1.179:8081"  scrolling="yes" frameborder='0'  id="frame_1"></iframe>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        view: 3
      }
    },
    methods: {
      getDom() {
        let phone = document.getElementById("phone_1")
        phone.style.width = 375 + 'px'
        phone.style.height= 667 + 'px'
        phone.style.scale = 0.4
        let iframe = document.getElementById("frame_1")
        iframe.style.width = 375 + 'px'
        iframe.style.height= 667 + 'px'


        this.updateView(this.view)
      },
      updateView(view) {
        let phone = document.getElementById("phone_1")
        if (view) {
          phone.className = "phone view_" + view;
        }
      },

    },
    mounted() {
      this.getDom()
    }
  }
</script>

<style scoped lang="scss">
  @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,600,300);

  body {
    font-family: 'Open Sans', sans-serif;
    background-color: #FFFAF6;
  }

  /*Basic Phone styling*/
  .phone {
    border: 40px solid #ddd;
    border-width: 55px 7px;
    border-radius: 40px;
    margin: 50px auto;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease;
  }
  .phone.view_3 {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    box-shadow: 0px 3px 0 #BBB, 0px 4px 0 #BBB, 0px 5px 0 #BBB, 0px 7px 0 #BBB, 0px 10px 20px #666;
  }
</style>
