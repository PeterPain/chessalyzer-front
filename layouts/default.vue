<template>
	<b-container>
		<b-row>
			<!-- Sidebar -->
			<div class="bg-light">
				<div class="dark">
					<b-row>
						<b-col>
							<b-img src="~/static/logo.svg" fluid></b-img>
						</b-col>
						<b-col>
							<h5>Chessalyzer</h5>
						</b-col>
					</b-row>
				</div>
				<b-list-group>
					<b-list-group-item href="#">Analyze</b-list-group-item>
					<b-list-group-item href="#" variant="primary">Else</b-list-group-item>
				</b-list-group>
			</div>
			<!-- /Sidebar -->

			<!-- Page Content -->
			<b-col>
				<nuxt />
			</b-col>
		</b-row>
	</b-container>
</template>

<style>
.dark {
	width: 200px;
	background-color: rgb(37, 65, 97);

	color: white;
}

body {
	background-color: #27a0bb;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='.1' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
}
</style>
