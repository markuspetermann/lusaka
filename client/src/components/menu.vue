<template>
  <nav class="main-navigation">
    <menutree :tree="tree" :max-levels="3" class="main-navigation-menu"></menutree>
    <hr class="main-navigation-line" />
  </nav>
</template>

<script>

import menutree from "./menutree.vue";

export default {
  name: "lusaka-menu",

  components: {
    menutree
  },

  created() {
    this.getTree();
  },

  data() {
    return {
      tree: []
    }
  },

  methods: {
    getTree() {
      this.$http.get("/tree")
        .then((res) => {
          if(res.data.tree) this.tree = res.data.tree;
      });
    }
  }

}
</script>

<style>

.main-navigation {
  float: left;
  overflow: hidden;
  width: 194px;
}

.main-navigation-menu {
  float: left;
  font-family: Georgia, "Times New Roman", Times, serif;
  width: 193px;
}

.main-navigation-menu ul {
  float: left;
  list-style: none;
  margin: 0;
  padding: 74px 0 0 15px;
  width: 178px;
}

.main-navigation-menu ul ul {
  padding: 0 0 0 25px;
}

.main-navigation-menu ul a, .main-navigation-link a {
  color: #000;
  display: block;
  font-size: 1.5em;
  font-variant: small-caps;
  letter-spacing: 0.045em;
  line-height: 1.575em;
  text-decoration: none;
}

.main-navigation-menu ul ul a {
  color: #000;
  display: block;
  font-size: 1.1em;
  font-variant: small-caps;
  letter-spacing: 0.045em;
  line-height: 1.575em;
  text-decoration: none;
}

.main-navigation-link {
  float: left;
  margin: 0;
  padding: 25px 0 0 15px;
  width: 178px;
}

.main-navigation-line {
  background-color: #000;
  border: 0;
  height: 400px;
  margin: 20px 0 0 0;
  overflow: hidden;
  width: 1px;
}

</style>
