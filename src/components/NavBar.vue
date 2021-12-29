<template>
  <div id="nav" class="nav">
    <div class="jbs">
      <a href="https://jasonbstanding.com"
        ><img
          src="https://www.jasonbstanding.com/blogparts/2018/02/red-fedora-152-14848.png"
        />
        jasonbstanding.com</a
      >
    </div>
    <nav>
      <router-link :to="{ name: 'ticket-list' }">Ticket List</router-link> |
      <router-link :to="{ name: 'ticket-stats' }">Stats</router-link>
    </nav>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
.jbs a {
  font-family: "Noto Sans", sans-serif;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 1.5em;
  color: purple;
  text-decoration: none;
}
.jbs img {
  height: 50px;
  vertical-align: middle;
}
.nav .nav-item {
  box-sizing: border-box;
  margin: 0 5px;
  color: rgba(0, 0, 0, 0.5);
  text-decoration: none;
}
.nav .nav-item.router-link-exact-active {
  color: #39b982;
  border-bottom: solid 2px #39b982;
}
</style>
