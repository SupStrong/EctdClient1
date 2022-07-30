<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'app',
	created() {
		this.$disableDrag();
	},
};
</script>

<style>
@import './assets/common/css/public.scss';
</style>
