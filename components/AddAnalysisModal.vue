<template>
	<div>
		<b-button @click="showModal" variant="primary">Show Modal</b-button>
		<b-modal
			v-model="show"
			title="Start new Analysis"
			header-bg-variant="dark"
			header-text-variant="light"
			body-bg-variant="light"
			body-text-variant="dark"
			footer-bg-variant="dark"
			footer-text-variant="light"
		>
			<b-container fluid>
				<b-row>
					<b-col>
						Analysis Name
						<b-form-input
							v-model="analysisName"
							placeholder="Give your analysis a name"
						></b-form-input>
					</b-col>
					<b-col>
						Amount of games
						<b-form-input
							v-model="nGames"
							placeholder="How many games?"
						></b-form-input>
					</b-col>
				</b-row>
				<b-dropdown
					size="sm"
					:text="'File: ' + pgnFiles.list[pgnFiles.selected]"
				>
					<b-dd-item
						v-for="(item, index) in pgnFiles.list"
						:key="index"
						@click="pgnFiles.selected = index"
					>
						{{ pgnFiles.list[index] }}
					</b-dd-item>
				</b-dropdown>
				<b-dropdown size="sm" text="White Player">
					<b-dropdown-form>
						<b-form-input
							v-model="gameFilter.whitePlayer"
							placeholder="Name"
						></b-form-input>
					</b-dropdown-form>
				</b-dropdown>
				<b-dropdown size="sm" text="Black Player">
					<b-dropdown-form>
						<b-form-input
							v-model="gameFilter.blackPlayer"
							placeholder="Name"
						></b-form-input>
					</b-dropdown-form>
				</b-dropdown>
				<b-dropdown size="sm" text="White Elo">
					<b-dropdown-form>
						<b-row>
							<b-col>
								Min
								<b-form-input
									v-model="gameFilter.whiteElo[0]"
									placeholder="min"
								></b-form-input>
							</b-col>
							<b-col>
								Max
								<b-form-input
									v-model="gameFilter.whiteElo[1]"
									placeholder="max"
								></b-form-input>
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
				<b-dropdown size="sm" text="Black Elo">
					<b-dropdown-form>
						<b-row>
							<b-col>
								Min
								<b-form-input
									v-model="gameFilter.blackElo[0]"
									placeholder="min"
								></b-form-input>
							</b-col>
							<b-col>
								Max
								<b-form-input
									v-model="gameFilter.blackElo[1]"
									placeholder="max"
								></b-form-input>
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
				<b-dropdown size="sm" text="Elo Difference">
					<b-dropdown-form>
						<b-row>
							<b-col>
								Min
								<b-form-input
									v-model="gameFilter.eloDiff[0]"
									placeholder="min"
								></b-form-input>
							</b-col>
							<b-col>
								Max
								<b-form-input
									v-model="gameFilter.eloDiff[1]"
									placeholder="max"
								></b-form-input>
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
				<b-dropdown size="sm" text="Result">
					<b-dropdown-form>
						<b-form-checkbox-group v-model="gameFilter.result">
							<b-form-checkbox value="1-0">
								White win
							</b-form-checkbox>
							<b-form-checkbox value="1/2-1/2">
								Draw
							</b-form-checkbox>
							<b-form-checkbox value="0-1">
								Black win
							</b-form-checkbox>
						</b-form-checkbox-group>
					</b-dropdown-form>
				</b-dropdown>
				<b-button
					class="m-md-2"
					variant="primary"
					@click="
						$emit('start', {
							path: pgnFiles.list[pgnFiles.selected],
							analysisName,
							nGames,
							gameFilter
						})
					"
				>
					Analyze!
				</b-button>
				<b-spinner v-if="analysisLoading" label="Spinning"></b-spinner>

				<!-- FILTER SECTION END -->
			</b-container>
		</b-modal>
	</div>
</template>

<script>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'

const server = 'localhost' // 'raspi-4'
const port = 3001
export default {
	components: {
		VueSlider
	},
	data() {
		const maxElo = 3000
		return {
			maxElo,
			show: false,
			pgnFiles: {
				list: [],
				selected: 0
			},
			path: '',
			analysisName: 'My Analysis',
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
	methods: {
		async showModal() {
			this.pgnFiles.list = await this.$axios.$get(
				`http://${server}:${port}/analyze/files`
			)
			this.show = true
		}
	}
}
</script>

<style>
.elo-slider {
	width: 150px !important;
}
</style>
