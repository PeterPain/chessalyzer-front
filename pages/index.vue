<template>
	<b-container class="basic-container bg-light">
		<h1 class="title">Analyze!</h1>
		<b-row>
			<b-col>
				<bank-display
					v-for="(item, index) in dbData"
					:key="index"
					:nr="index"
					:data="item"
					:isSelected="selectedBank === index"
					@clicked="selectedBank = index"
				/>
				<b-form-group label="Available Heatmaps">
					<b-form-radio
						v-for="(item, index) in heatmaps"
						:key="index"
						v-model="selectedHeatmap"
						:value="index"
					>{{ item }}</b-form-radio>
				</b-form-group>
			</b-col>

			<div id="board" style="width: 500px"></div>
		</b-row>
		<b-button variant="primary" @click="analyze()">Analyze!</b-button>
	</b-container>
</template>

<script>
import BankDisplay from '@/components/BankDisplay'

const server = 'localhost' // 'raspi-4'
const port = 3001
let board
export default {
	components: {
		'bank-display': BankDisplay
	},
	data() {
		return {
			lastMoSquare: 'a1',
			dbData: [],
			heatmaps: [],
			selectedBank: 0,
			selectedHeatmap: 0
		}
	},
	created() {
		this.syncDb()
		this.getHeatmaps()
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
				// path: './test/YanSch_Gimker.pgn',
				// path: '../pgn/lichess_db_standard_rated_2013-01_min.pgn',
				trackers: ['GameTrackerBase', 'PieceTrackerBase', 'TileTrackerBase']
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
					`http://${server}:${port}/analyze/generateheatmap`,
					{
						id: this.selectedBank,
						name: this.heatmaps[this.selectedHeatmap],
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
		},
		async getHeatmaps() {
			this.heatmaps = await this.$axios.$get(
				`http://${server}:${port}/analyze/heatmaps`
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
