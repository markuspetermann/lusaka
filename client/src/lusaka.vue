<template>
  <div id="app">

    <lusakaHeader />
    <lusakaMenu />
    <lusakaMdreader />
    
  </div>
</template>

<script>

import "normalize.css";

import lusakaHeader from "./components/header.vue";
import lusakaMenu from "./components/menu.vue";
import lusakaMdreader from "./components/mdreader.vue";

export default {
  name: "lusaka",

  components: {
    lusakaHeader,
    lusakaMenu,
    lusakaMdreader
  }
}
</script>
