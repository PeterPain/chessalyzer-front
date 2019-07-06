<template>
	<div class="container">
		<div>
			<h1 class="title">chessalyzer-front</h1>
			<div id="board" style="width: 600px"></div>
		</div>
	</div>
</template>

<script>
export default {
	mounted() {
		require('heatboard.js')
		// draw chessboard
		window.Chessboard('board', {
			position: 'start',
			draggable: true
		})
	}
}
</script>

<style>
@import url('@/assets/css/chessboard-0.3.0.css');

.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
}
</style>
