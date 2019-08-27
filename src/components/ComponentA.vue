<template>
  <div class="component-a">
    <p>{{ msg }}</p>
  </div>
</template>

<script>
export default {
  name: 'component-a',
  data () {
    return {
      msg: 'Hello from Component A!'
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
</style>
