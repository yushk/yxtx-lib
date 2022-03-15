<template>
    <div class="loading">
        <div class="g-container">
            <div class="g-box" v-for="i in 20" :key="'aa'+i"></div>
        </div>
        <div class="g-container g-steps">
            <div class="g-box"  v-for="i in 20" :key="'bb'+i"></div>
        </div>
        <div class="g-container g-animation">
            <div class="g-box"  v-for="i in 20" :key="'cc'+i"></div>
        </div>

    </div>
</template>
<script>
export default {
  name: 'Load'
};
</script>
