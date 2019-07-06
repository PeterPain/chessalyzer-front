<template>
	<div class="d-flex" id="wrapper">
		<!-- Sidebar -->
		<div class="bg-light border-right" id="sidebar-wrapper">
			<div class="dark">
				<b-img src="~/static/logo.svg" fluid></b-img>
			</div>
			<b-list-group>
				<b-list-group-item href="#">Analyze</b-list-group-item>
				<b-list-group-item href="#" variant="primary">Else</b-list-group-item>
			</b-list-group>
		</div>
		<!-- /Sidebar -->

		<!-- Page Content -->
		<nuxt />
	</div>
</template>

<style>
.dark {
	background-color: rgb(37, 65, 97);
	padding: 15px;
}
</style>
