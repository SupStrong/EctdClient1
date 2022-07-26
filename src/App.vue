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

		// 		this.$api.user.login({
		// 			username:123,
		// 			password:123
		// 		},()=>{
		// 			alert()
		// 		},()=>{

		// 		})

		// this.$api.user.login({
		// 			username:123,
		// 			password:123
		// 		}).then(()=>{

		// 		}).catch(()=>{

		// 		})
	},
};
</script>

<style>
@import './assets/common/css/public.scss';
</style>
