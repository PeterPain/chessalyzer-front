<template>
	<b-container class="basic-container bg-light">
		<h1 class="title">Analyze!</h1>

		<b-row>
			<b-card>
				<b-row>
					<b-col>
						<b-form-input v-model="analysisName" placeholder="Give your analysis a name"></b-form-input>
					</b-col>
					<b-col>
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
							class="elo-slider"
							v-model="gameFilter.whiteElo"
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
							class="elo-slider"
							v-model="gameFilter.blackElo"
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
							class="elo-slider"
							v-model="gameFilter.eloDiff"
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
			</b-card>
		</b-row>
		<b-row>
			<b-col>
				<bank-display
					v-for="(item, index) in dbData"
					:key="index"
					:nr="index"
					:data="item"
					:is-selected="selectedBank === index"
					@clicked="selectedBank = index"
				/>
				<b-form-group label="Available Heatmaps">
					<b-form-radio
						v-for="(item, index) in heatmaps"
						:key="index"
						v-model="selectedHeatmap"
						:value="index"
					>{{ item.short_name }}</b-form-radio>
				</b-form-group>
			</b-col>

			<div id="board" style="width: 500px"></div>
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
			analysisName: '',
			nGames: '',
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
		async analyze() {
			await this.$axios.$post(`http://${server}:${port}/analyze/runbatch`, {
				path: './test/lichess_db_standard_rated_2013-12.pgn',
				// path: './test/YanSch_Gimker.pgn',
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
		},
		drawHeatmap(data) {
			const autoscale = true
			board.drawHeatmap(
				data[0],
				autoscale ? data[1] : 0,
				autoscale ? data[2] : 100,
				{
					unit: this.heatmaps[this.selectedHeatmap].unit,
					animTime: 0.5,
					scaling: (val, max) => {
						return val / max
					},
					disableSquares: true,
					color: [3, 173, 252]
				}
			)
		},

		chessboardMouseOver(square) {
			this.lastMoSquare = square
			if (
				this.dbData.length > 0 &&
				this.heatmaps[this.selectedHeatmap].scope !== 'global'
			) {
				this.generateHeatmap(square)
			}
		},
		async generateHeatmap(square) {
			if (this.dbData.length > 0) {
				const data = await this.$axios.$post(
					`http://${server}:${port}/analyze/generateheatmap`,
					{
						id: this.selectedBank,
						name: this.heatmaps[this.selectedHeatmap].short_name,
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

.elo-slider {
	width: 150px !important;
}
</style>
