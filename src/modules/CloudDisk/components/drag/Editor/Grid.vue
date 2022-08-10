<template>
	<svg class="grid" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="smallGrid" width="51" height="72.3" patternUnits="userSpaceOnUse">
				<path d="M 51 0 L 0 0 0 72.3" fill="none" stroke="rgba(186, 186, 186, 0.4)" stroke-width="1"></path>
			</pattern>
			<pattern id="grid" :width="rectData.w" :height="rectData.h" patternUnits="userSpaceOnUse">
				<rect :width="rectData.w" :height="rectData.h" fill="url(#smallGrid)"></rect>
				<path :d="`M ${rectData.w}  0 L 0 0 0 ${rectData.h}`" fill="none" stroke="rgba(186, 186, 186, 1)" stroke-width="1"></path>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#grid)"></rect>
	</svg>
</template>
<script>
export default {
	props: {
		rectData: {
			type: Object,
			default: {
				name: '1*1格',
				w: '514.19',
				h: '727.38',
			},
		},
	},
};
</script>
<style lang="scss" scoped>
.grid {
	position: absolute;
	top: 0;
	left: 0;
}
</style>

