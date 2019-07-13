<template>
	<div class="basic-container bg-light">
		<h1 class="title">chessalyzer-front</h1>
		<div id="board" style="width: 600px"></div>
		<b-button variant="primary" @click="sendRequest()">Analyze!</b-button>
	</div>
</template>

<script>
let board
export default {
	mounted() {
		require('heatboard.js')
		// draw chessboard
		board = window.Chessboard('board', {
			position: 'start',
			draggable: true
		})
	},
	methods: {
		async sendRequest() {
			const data = await this.$axios.$get('http://127.0.0.1:3001')
			this.drawHeatmap(data)
		},
		drawHeatmap(data) {
			const autoscale = true
			board.drawHeatmap(
				data[0],
				autoscale ? data[1] : 0,
				autoscale ? data[2] : 100,
				[255, 128, 0],
				'',
				1000
			)
		}
	}
}
</script>

<style>
@import url('@/assets/css/chessboard-0.3.0.css');

.basic-container {
	min-height: 100vh;
}
</style>
