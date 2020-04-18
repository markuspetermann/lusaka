<template>
  <div v-html="treehtml"></div>
</template>

<script>

export default {
  name: "menutree",

  props: {
    tree: Array,
    maxLevels: Number,
  },

  data() {
    return {
      treehtml: ""
    }
  },

  methods: {
    rec_create_tree(tree, level) {
      let html = "";
      if(level < this.maxLevels) {
        html += "<ul>";
        for (let i = 0; i < tree.length; i++) {
          let childhtml = "";
          let name = this.$filters.formatname(tree[i].name);
          if(tree[i].children.length) childhtml = this.rec_create_tree(tree[i].children, level + 1);
          html = html + "<li><a href=\"" + tree[i].path + "\">" + name + "</a>" + childhtml + "</li>";
        }
        html += "</ul>";
      }
      return html;
    }
  },

  watch: {
    "tree" (to) {
      this.treehtml = this.rec_create_tree(to, 0);
    }
  }
}
</script>

<style scoped>

</style>
