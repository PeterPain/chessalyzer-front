<template>
	<div @click="$emit('clicked')" class="bank-display">
		<b-row no-gutters>
			<div class="nr-display" :class="{ selected: isSelected }" align="center">{{ nr }}</div>
			<b-col class="info-display align-self-center">
				<b>{{ data.name + ": "}}</b>
				{{ data.cntGames + " games (" + data.cntMoves + " moves)"}}
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

.bank-display {
	border: 1px solid black;
	cursor: pointer;
}

.selected {
	background-color: darkcyan;
	font-weight: bold;
}
</style>
