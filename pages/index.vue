<template>
	<b-container class="basic-container bg-light">
		<h1 class="title">Analyze!</h1>

		<b-row>
			<!-- FILTER SECTION START -->
			<b-card>
				<b-row>
					<b-col>
						Name
						<b-form-input v-model="analysisName" placeholder="Give your analysis a name"></b-form-input>
					</b-col>
					<b-col>
						Amount of games
						<b-form-input v-model="nGames" placeholder="How many games?"></b-form-input>
					</b-col>
				</b-row>
				<b-dropdown text="White Player">
					<b-dropdown-form>
						<b-form-input v-model="gameFilter.whitePlayer" placeholder="Name"></b-form-input>
					</b-dropdown-form>
				</b-dropdown>
				<b-dropdown text="Black Player">
					<b-dropdown-form>
						<b-form-input v-model="gameFilter.blackPlayer" placeholder="Name"></b-form-input>
					</b-dropdown-form>
				</b-dropdown>
				<b-dropdown text="White Elo">
					<b-dropdown-form>
						<b-row>
							<b-col>
								Min
								<b-form-input v-model="gameFilter.whiteElo[0]" placeholder="min"></b-form-input>
							</b-col>
							<b-col>
								Max
								<b-form-input v-model="gameFilter.whiteElo[1]" placeholder="max"></b-form-input>
							</b-col>
						</b-row>
						<vue-slider
							v-model="gameFilter.whiteElo"
							class="elo-slider"
							:min="0"
							:max="maxElo"
							:tooltip="'none'"
						></vue-slider>
					</b-dropdown-form>
				</b-dropdown>
				<b-dropdown text="Black Elo">
					<b-dropdown-form>
						<b-row>
							<b-col>
								Min
								<b-form-input v-model="gameFilter.blackElo[0]" placeholder="min"></b-form-input>
							</b-col>
							<b-col>
								Max
								<b-form-input v-model="gameFilter.blackElo[1]" placeholder="max"></b-form-input>
							</b-col>
						</b-row>
						<vue-slider
							v-model="gameFilter.blackElo"
							class="elo-slider"
							:min="0"
							:max="maxElo"
							:tooltip="'none'"
						></vue-slider>
					</b-dropdown-form>
				</b-dropdown>
				<b-dropdown text="Elo Difference">
					<b-dropdown-form>
						<b-row>
							<b-col>
								Min
								<b-form-input v-model="gameFilter.eloDiff[0]" placeholder="min"></b-form-input>
							</b-col>
							<b-col>
								Max
								<b-form-input v-model="gameFilter.eloDiff[1]" placeholder="max"></b-form-input>
							</b-col>
						</b-row>
						<vue-slider
							v-model="gameFilter.eloDiff"
							class="elo-slider"
							:min="0"
							:max="1500"
							:tooltip="'none'"
						></vue-slider>
					</b-dropdown-form>
				</b-dropdown>
				<b-dropdown text="Result">
					<b-dropdown-form>
						<b-form-checkbox-group v-model="gameFilter.result">
							<b-form-checkbox value="1-0">White win</b-form-checkbox>
							<b-form-checkbox value="1/2-1/2">Draw</b-form-checkbox>
							<b-form-checkbox value="0-1">Black win</b-form-checkbox>
						</b-form-checkbox-group>
					</b-dropdown-form>
				</b-dropdown>
				<b-button class="m-md-2" variant="primary" @click="analyze()">Analyze!</b-button>
				<b-spinner v-if="analysisLoading" label="Spinning"></b-spinner>
			</b-card>
			<!-- FILTER SECTION END -->
		</b-row>
		<b-row>
			<b-col cols="4">
				<!-- BANK DISPLAY START -->
				<bank-display
					v-for="(item, index) in dbData"
					:key="index"
					:nr="index"
					:data="item"
					:is-selected="selectedBank === index"
					@clicked="selectedBank = index"
				/>
				<!-- BANK DISPLAY END -->

				<!-- HEATMAP DISPLAY START -->
				<b-form-group label="Available Heatmaps">
					<b-form-radio
						v-for="(item, index) in heatmaps"
						:key="index"
						v-model="selectedHeatmap"
						:value="index"
					>{{ item.short_name }}</b-form-radio>
				</b-form-group>
				<!-- HEATMAP DISPLAY END -->
				<b-form-checkbox v-model="comparison">Comparison Heatmap</b-form-checkbox>
			</b-col>

			<!-- CHESSBOARD START -->
			<div id="board" style="width: 500px"></div>
			<!-- CHESSBOARD END -->
		</b-row>
	</b-container>
</template>

<script>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'
import BankDisplay from '@/components/BankDisplay'

const server = 'localhost' // 'raspi-4'
const port = 3001
let board

export default {
	components: {
		BankDisplay,
		VueSlider
	},
	data() {
		const maxElo = 3000
		return {
			maxElo,
			lastMoSquare: 'a1',
			dbData: [],
			heatmaps: [],
			selectedBank: 0,
			selectedHeatmap: 0,
			comparison: false,
			analysisName: 'Franz',
			nGames: 1000,
			analysisLoading: false,
			gameFilter: {
				whitePlayer: '',
				blackPlayer: '',
				whiteElo: [0, maxElo],
				blackElo: [0, maxElo],
				eloDiff: [0, 1500],
				result: ['1-0', '1/2-1/2', '0-1']
			}
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
			draggable: true,
			onMouseoverSquare: this.chessboardMouseOver
		})
		this.generateHeatmap(this.lastMoSquare)
	},

	methods: {
		// send analysis request to server
		async analyze() {
			this.analysisLoading = true
			await this.$axios.$post(`http://${server}:${port}/analyze/runbatch`, {
				// path: './test/lichess_db_standard_rated_2013-12.pgn',
				path: './test/YanSch_Gimker.pgn',
				// path: './test/lichess_db_standard_rated_2013-01_min.pgn',
				trackers: ['GameTrackerBase', 'PieceTrackerBase', 'TileTrackerBase'],
				name: this.analysisName,
				nGames: this.nGames,
				filter: this.gameFilter
			})
			await this.syncDb()
			this.selectedBank = this.dbData.length - 1
			console.log(this.selectedBank)
			this.generateHeatmap(this.lastMoSquare)
			this.analysisLoading = false
		},

		// send heatmap request to server
		async generateHeatmap(square) {
			if (this.dbData.length > 0) {
				const data = await this.$axios.$post(
					`http://${server}:${port}/analyze/generateheatmap`,
					{
						id: this.comparison
							? [this.selectedBank, this.selectedBank + 1]
							: [this.selectedBank],
						name: this.heatmaps[this.selectedHeatmap].short_name,
						square
					}
				)
				this.drawHeatmap(data)
			}
		},

		// get available analyses from server
		async syncDb() {
			this.dbData = await this.$axios.$get(
				`http://${server}:${port}/analyze/db`
			)
		},

		// get available heatmaps from server
		async getHeatmaps() {
			this.heatmaps = await this.$axios.$get(
				`http://${server}:${port}/analyze/heatmaps`
			)
		},

		// draw heatmap
		drawHeatmap(data) {
			if (this.comparison) {
				board.drawComparisonHeatmap(data[0], data[1], data[2], {
					animTime: 0.5,
					scaling: (val, max) => {
						return val / max
					},
					disableSquares: true
				})
			} else {
				board.drawHeatmap(data[0], data[1], data[2], {
					unit: this.heatmaps[this.selectedHeatmap].unit,
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
				this.dbData.length > 0 &&
				this.heatmaps[this.selectedHeatmap].scope !== 'global'
			) {
				this.generateHeatmap(square)
			}
		}
	}
}
</script>

<style>
@import url('@/assets/css/chessboard-0.3.0.css');

.basic-container {
	min-height: 100vh;
}

.elo-slider {
	width: 150px !important;
}
</style>
