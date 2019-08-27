<template>
  <div class="my-button">
    <p>I am from MyButton component!</p>
    <button class="btn" type="button" @click='increment'>{{ button_msg + count }}</button>
    <button class="btn" type="button" @click='reset'>Reset count</button>
  </div>
</template>

<script>
export default {
  name: 'my-button',
  data () {
    return {
      count: 0,
      button_msg: 'Click me '
    }
  },
  methods: {
    increment () {
      this.count += 1
    },
    reset () {
      this.count = 0
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.crossout {
  text-decoration: line-through;
  background-color: #eee;
}
.btn {
  background-color: #e34;
  font-size: 2em;
  padding: 20px 30px;
}
</style>
