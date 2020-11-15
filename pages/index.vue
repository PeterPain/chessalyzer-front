<template>
	<b-container class="bg-light">
		<!-- FILTER SECTION START -->
		<add-analysis-modal @start="analyze($event)" />
		<div>
			<b-row>
				<b-col cols="4">
					<!-- BANK DISPLAY START -->
					<bank-display
						v-for="(item, index) in banks.list"
						:key="index"
						:nr="index"
						:data="item"
						:is-selected="banks.selected === index"
						@clicked="banks.selected = index"
						@delete="deleteDbEntry($event)"
					/>
					<!-- BANK DISPLAY END -->

					<!-- HEATMAP DISPLAY START -->
					<b-form-group label="Available Heatmaps">
						<b-form-radio
							v-for="(item, index) in heatmaps.list"
							:key="index"
							v-model="heatmaps.selected"
							:value="index"
						>
							{{ item.short_name }}
						</b-form-radio>
					</b-form-group>
					<!-- HEATMAP DISPLAY END -->
					<b-form-checkbox v-model="comparison">
						Comparison Heatmap
					</b-form-checkbox>
				</b-col>

				<!-- CHESSBOARD START -->
				<div id="board" style="width: 550px;"></div>
				<!-- CHESSBOARD END -->
			</b-row>
		</div>
	</b-container>
</template>

<script>
import BankDisplay from '@/components/BankDisplay'
import AddAnalysisModal from '@/components/AddAnalysisModal'

const server = 'localhost' // 'raspi-4'
const port = 3001
let board

export default {
	components: {
		BankDisplay,
		AddAnalysisModal
	},
	data() {
		return {
			lastMoSquare: 'a1',
			banks: {
				list: [],
				selected: 0
			},
			heatmaps: {
				list: [],
				selected: 0
			},
			comparison: false
		}
	},
	computed: {
		selectedBank() {
			return this.banks.selected
		},
		selectedHeatmap() {
			return this.heatmaps.selected
		}
	},
	watch: {
		selectedHeatmap() {
			this.generateHeatmap(this.lastMoSquare)
		},
		selectedBank() {
			this.generateHeatmap(this.lastMoSquare)
		},
		comparison() {
			this.generateHeatmap(this.lastMoSquare)
		}
	},
	created() {
		;(async () => {
			await this.syncDb()
			await this.getHeatmaps()
		})()
	},
	mounted() {
		require('@/assets/chessboard.js')
		// draw chessboard
		board = window.Chessboard('board', {
			position: 'start',
			draggable: false,
			onMouseoverSquare: this.chessboardMouseOver
		})
		this.generateHeatmap(this.lastMoSquare)
	},

	methods: {
		// send analysis request to server
		async analyze(data) {
			await this.$axios.$post(
				`http://${server}:${port}/analyze/runbatch`,
				{
					path: data.path,
					trackers: [
						'GameTrackerBase',
						'PieceTrackerBase',
						'TileTrackerBase'
					],
					name: data.analysisName,
					nGames: data.nGames,
					filter: data.gameFilter
				}
			)
			await this.syncDb()
			this.banks.selected = this.banks.list.length - 1
			this.generateHeatmap(this.lastMoSquare)
		},

		// send heatmap request to server
		async generateHeatmap(square) {
			if (this.banks.list.length > 0) {
				const data = await this.$axios.$post(
					`http://${server}:${port}/analyze/generateheatmap`,
					{
						id: this.comparison
							? [this.banks.selected, this.banks.selected + 1]
							: [this.banks.selected],
						name: this.heatmaps.list[this.heatmaps.selected]
							.short_name,
						square
					}
				)
				this.drawHeatmap(data)
			}
		},

		// get available analyses from server
		async syncDb() {
			this.banks.list = await this.$axios.$get(
				`http://${server}:${port}/analyze/db`
			)
		},
		async deleteDbEntry(nr) {
			await this.$axios.$delete(`http://${server}:${port}/analyze/${nr}`)
			await this.syncDb()
			if (this.banks.selected > this.banks.list.length - 1) {
				this.banks.selected = this.banks.list.length - 1
			}
		},
		// get available heatmaps from server
		async getHeatmaps() {
			this.heatmaps.list = await this.$axios.$get(
				`http://${server}:${port}/analyze/heatmaps`
			)
		},

		// draw heatmap
		drawHeatmap(data) {
			if (this.comparison) {
				board.drawComparisonHeatmap(data.map, data.min, data.max, {
					animTime: 0.5,
					scaling: (val, max) => {
						return val / max
					},
					disableSquares: true
				})
			} else {
				board.drawHeatmap(data.map, data.min, data.max, {
					unit: this.heatmaps.list[this.heatmaps.selected].unit,
					animTime: 0.5,
					scaling: (val, max) => {
						return val / max
					},
					disableSquares: true,
					color: [3, 173, 252]
				})
			}
		},

		// mouseover function for chessboard
		chessboardMouseOver(square) {
			this.lastMoSquare = square
			if (
				this.banks.list.length > 0 &&
				this.heatmaps.list[this.heatmaps.selected].scope !== 'global'
			) {
				this.generateHeatmap(square)
			}
		}
	}
}
</script>

<style>
@import url('@/assets/css/chessboard-0.3.0.css');
</style>
