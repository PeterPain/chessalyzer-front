<template>
	<div @click="$emit('clicked')" class="bank_display">
		<b-row no-gutters>
			<div class="nr_display" :class="{ selected: isSelected }">{{ nr }}</div>
			<b-col>{{ data.cntGames + " games (" + data.cntMoves + " moves)"}}</b-col>
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
.nr_display {
	padding: 5px;
	width: 30px;
	background-color: gray;
	color: white;
}

.bank_display {
	border: 1px solid black;
	cursor: pointer;
}

.selected {
	background-color: darkcyan;
}
</style>
