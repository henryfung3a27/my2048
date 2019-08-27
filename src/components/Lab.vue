<template>
  <div class="lab">
    <h1>Hello Worlde</h1>
    <p :class="{crossout: deleted}">Cross out!!!!</p>
    <componentA />
    <my-button />
    <br />
    <br />
    <button
      v-for="tab in tabs"
      v-bind:key="tab"
      v-bind:class="['btn', {active: currentTab === tab}]"
      v-on:click="currentTab = tab"
    >{{ tab }}</button>
    <component :is="currentTabComponent" class="tab"></component>
  </div>
</template>

<script>
import ComponentA from './ComponentA'
import MyButton from './MyButton'

export default {
  name: 'lab',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      deleted: true,
      currentTab: 'MyButton',
      tabs: ['MyButton', 'ComponentA']
    }
  },
  components: {
    ComponentA,
    MyButton
  },
  computed: {
    currentTabComponent: function () {
      return this.currentTab
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.btn.active {
  background: #55f;
}
.btn:hover {
  background: #5f5;
  cursor: pointer;
}
.tab {
  border: 1px solid #333;
  padding: 10px;
}
</style>
