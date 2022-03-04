<template>
  <div id="app" :class="{ 'is-component': isComponent }">
    <main-header ></main-header>
    <div class="main-cnt">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    lang() {
      return this.$route.path.split('/')[1] || 'zh-CN';
    },
    isComponent() {
      return /^component-/.test(this.$route.name || '');
    }
  }
};
</script>
