<template>
  <div class="reader">
    <div v-for="md in mds" :key="md.name">
      <span class="reader-info">{{ md.time | moment("DD.MM.YYYY") }}&ensp;–&ensp;<a :href='"/" + md.path'>{{ md.path }}</a></span>
      <hr class="reader-line" />
      <vue-markdown class="reader-content" :source="md.data" @rendered="updatePrism" :linkify=false></vue-markdown>
    </div>
  </div>
</template>

<script>

import Prism from "prismjs";
import VueMarkdown from "vue-markdown-v2";

export default {
  name: "lusaka-mdreader",

  components: { VueMarkdown },

  created() {
    this.updateTitle();
    this.getMD(this.$route.params.pathMatch);
  },

  data() {
    return {
      mds: []
    }
  },

  methods: {
    getMD(id) {
      this.$http.get("/md/" + id)
        .then((res) => {
          if(res.data.mds) {
            this.mds = res.data.mds;
            if(this.mds.length == 1) {
              this.updateTitle(this.mds[0].name);
            } else {
              this.updateTitle();
            }
          }
      });
    },
    updatePrism() {
      this.$nextTick( () => Prism.highlightAll() );
    },
    updateTitle(name) {
      if(process.env.VUE_APP_TITLE)
        document.title = (name ? this.$filters.formatname(name) + " | " : "") + process.env.VUE_APP_TITLE;
    }
  },

  watch: {
    "$route" (to) {
      this.getMD(to.params.pathMatch);
    }
  }

}
</script>

<style scoped>

@import "../libs/prism.css";

.reader {
  font-family: Georgia, "Times New Roman", Times, serif;
  line-height: 1.5;
  max-width: 1246px;
	min-width: 680px;
  overflow: hidden;
  padding: 40px 80px 0 40px;
}

.reader-info {
  color: #AAA;
  font-size: 0.7em;
}

a, a:visited {
  color: #4169E1;
  text-decoration: none;
}

a:active, a:focus, a:hover {
  color: #191970;
  text-decoration: none;
}

.reader-line {
  background-color: #AAA;
  border: 0;
  height: 1px;
  margin: 5px 0 0 0;
}

.reader-content {
  padding: 0 0 25px 0;
}

</style>
