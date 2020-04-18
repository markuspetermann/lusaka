<template>
  <header class="site-header">

			<h1 class="site-title">
				<a href="/" rel="home">{{ title }}</a>
			</h1>

			<hr class="title-line" />

	</header>
</template>

<script>

export default {
  name: "lusaka-header",

  created() {
    if(process.env.VUE_APP_TITLE) this.title = process.env.VUE_APP_TITLE;
  },

  data() {
    return {
      title: "lusaka"
    }
  },
}

</script>

<style scoped>

.site-header {
  height: 62px;
  padding: 20px 0px 0px 40px;
  width: calc(100% - 40px);
}

.site-title {
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: normal;
  font-size: 3.8em;
  font-variant: small-caps;
  letter-spacing: 0.045em;
  line-height: 1em;
  margin: 0;
  white-space: nowrap;
}

.site-title a {
  color: #000000;
  text-decoration: none;
}

.site-header .title-line {
  background-color: #000000;
  border: 0;
  clear: both;
  float: left;
  height: 1px;
  margin: 0 0 0 100px;
  width: 750px;
}

</style>
