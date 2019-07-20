<template>
	<b-container class="basic-container bg-light">
		<h1 class="title">Analyze!</h1>
		<b-row>
			<b-col>
				<b-form-input id="bla" v-model="sliderVal" type="range" min="0" max="3000"></b-form-input>
				{{sliderVal}}
				<b-form-group label="Available Analyses">
					<b-form-radio
						v-for="(item, index) in dbData"
						:key="index"
						v-model="selectedData"
						:value="index"
					>{{ index + ": " + item.cntMoves + " moves." }}</b-form-radio>
				</b-form-group>
			</b-col>

			<div id="board" style="width: 500px"></div>
		</b-row>
		<b-button variant="primary" @click="analyze()">Analyze!</b-button>
	</b-container>
</template>

<script>
const server = 'localhost' // 'raspi-4'
const port = 3001
let board
export default {
	data() {
		return {
			sliderVal: 0,
			lastMoSquare: 'a1',
			dbData: [],
			selectedData: 0
		}
	},
	created() {
		this.syncDb()
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
		async analyze() {
			await this.$axios.$post(`http://${server}:${port}/analyze/runbatch`, {
				path: './test/lichess_db_standard_rated_2013-12.pgn',
				// path: '../pgn/lichess_db_standard_rated_2013-01_min.pgn',
				trackers: ['TileTrackerBase']
			})
			this.syncDb()
			this.generateHeatmap(this.lastMoSquare)
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
			if (this.dbData.length > 0) {
				const data = await this.$axios.$post(
					`http://${server}:${port}/analyze/getheatmap`,
					{
						id: this.selectedData,
						name: 'TILE_OCC_BY_PIECE',
						square
					}
				)
				this.drawHeatmap(data)
			}
		},
		async syncDb() {
			this.dbData = await this.$axios.$get(
				`http://${server}:${port}/analyze/db`
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
