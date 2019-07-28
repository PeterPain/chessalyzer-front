<template>
	<div @click="$emit('clicked')" class="bank-display">
		<b-row no-gutters>
			<div class="nr-display" :class="{ selected: isSelected }" align="center">{{ nr }}</div>
			<b-col class="info-display align-self-center">
				<b>{{ data.name + ": "}}</b>
				{{ data.cntGames + " games (" + data.cntMoves + " moves)"}}
				<div v-if="isSelected" class="filter-section">
					Filter
					<ul>
						<li>White Player: {{ data.filter.whitePlayer }}</li>
						<li>Black Player: {{ data.filter.blackPlayer }}</li>
						<li>White Elo range: {{ data.filter.whiteElo[0] }} to {{ data.filter.whiteElo[1] }}</li>
						<li>Black Elo range: {{ data.filter.blackElo[0] }} to {{ data.filter.blackElo[1] }}</li>
						<li>Elo difference range: {{ data.filter.eloDiff[0] }} to {{ data.filter.eloDiff[1] }}</li>
						<li>Result: {{ data.filter.result }}</li>
					</ul>
				</div>
			</b-col>
		</b-row>
	</div>
</template>

<script>
export default {
	name: 'BankDisplay',
	props: {
		nr: { type: Number },
		data: { type: Object },
		isSelected: { type: Boolean }
	}
}
</script>

<style scoped>
.nr-display {
	padding: 5px;
	width: 34px;
	background-color: gray;
	color: white;
}

.info-display {
	padding-left: 5px;
}
.bank-display:hover {
	background-color: lightgray;
}

.bank-display {
	border: 1px solid black;
	cursor: pointer;
	font-size: 11pt;
}

.selected {
	background-color: darkcyan;
	font-weight: bold;
}

.filter-section {
	font-size: 9pt;
}

.filter-section ul {
	list-style: none;
	padding-left: 15px;
}
</style>
