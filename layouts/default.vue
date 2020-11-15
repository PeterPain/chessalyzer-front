<template>
	<b-container class="main d-flex flex-column">
		<div class="main-header">
			<b-row no-gutters align-v="center">
				<b-img src="~/static/logo.svg" width="50"></b-img>
				<b-col>
					<span class="chessalyzer-title">Chessalyzer</span>
				</b-col>
			</b-row>
		</div>

		<b-row class="flex-grow-1" no-gutters>
			<!-- Sidebar -->
			<b-col cols="2">
				<b-list-group class="side-entries">
					<b-list-group-item href="#">Analyze</b-list-group-item>
					<b-list-group-item href="#">Else</b-list-group-item>
				</b-list-group>
			</b-col>
			<!-- /Sidebar -->
			<!-- Page Content -->
			<b-col class="d-flex">
				<nuxt />
			</b-col>
		</b-row>
	</b-container>
</template>

<style>
.main {
	padding: 0;
	min-height: 100vh;
	background-color: white;
}

.main-header {
	background-color: rgb(37, 65, 97);
	padding: 5px 5px 5px 10px;
	color: white;
}

.side-entries {
	border-radius: 0;
}

.chessalyzer-title {
	padding-left: 10px;
	font-size: 20pt;
}

body {
	background-color: #000000;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='30' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23222' stroke-width='10' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
