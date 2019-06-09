<template>
  <div id="app">
    <div id="nav">
      <router-link to="/game">Game</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav {
  padding: 30px;
  text-align: center;
  color: #2c3e50;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<style>
@import url(https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css);

.button-warning {
  background-color: rgb(223, 117, 20)
}
.button-error {
    background: rgb(202, 60, 60);
}
.button-secondary {
    background: rgb(66, 184, 221);
}
.button-success {
    background: rgb(28, 184, 65);
}
</style>