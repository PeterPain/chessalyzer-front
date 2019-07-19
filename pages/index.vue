<template>
	<b-container class="basic-container bg-light">
		<h1 class="title">Analyze!</h1>
		<b-row>
			<b-col>
				<b-form-input v-model="sliderVal" id="bla" type="range" min="0" max="3000"></b-form-input>
				{{sliderVal}}
			</b-col>

			<div id="board" style="width: 500px"></div>
		</b-row>
		<b-button variant="primary" @click="sendRequest()">Analyze!</b-button>
	</b-container>
</template>

<script>
let board
export default {
	data() {
		return {
			sliderVal: 0,
			lastMoSquare: 'a1'
		}
	},
	mounted() {
		require('heatboard.js')
		// draw chessboard
		board = window.Chessboard('board', {
			position: 'start',
			draggable: true,
			onMouseoverSquare: this.generateHeatmap
		})
	},
	methods: {
		async sendRequest() {
			await this.$axios.$post('http://127.0.0.1:3001/analyze/runbatch', {
				path: './test/lichess_db_standard_rated_2013-12.pgn',
				trackers: ['TileTrackerBase']
			})
			const data = await this.$axios.$post(
				'http://127.0.0.1:3001/analyze/getheatmap',
				{
					name: 'TILES_OCC_ALL',
					square: this.lastMoSquare
				}
			)
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
		},
		async generateHeatmap(square) {
			this.lastMoSquare = square
			const data = await this.$axios.$post(
				'http://127.0.0.1:3001/analyze/getheatmap',
				{
					name: 'TILE_OCC_BY_PIECE',
					square
				}
			)
			this.drawHeatmap(data)
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
