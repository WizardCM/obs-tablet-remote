<template>
	<panel-wrapper :content-class="['is-scrollable', 'panel-scenes', 'per-row-' + perRow]">
		<template slot="name">Scene collection</template>
		<button
			class="scene"
			v-for="scene in scenes"
			:key="scene['sc-name']"
			:class="[scene['sc-name'] === currentSceneCollection ? 'is-active' : 'is-inactive']"
			@click="switchScenes(scene['sc-name'])"
		>
			{{ scene['sc-name'] }}
		</button>

		<div slot="settings">
			<label>
				Scene collection per row
				<div class="input-group">
					<input
						type="range"
						min="1"
						max="10"
						v-model.number="perRow"
					>
					<span style="width: 2.5em" v-text="perRow"></span>
				</div>
			</label>
		</div>
	</panel-wrapper>
</template>

<script>
	import {mapState, mapActions} from 'vuex'

	import {timeoutPromise} from '../../util'

	import panelMixin from '../mixins/panel'

	export default {
		mixins: [panelMixin],
		computed: {
			perRow: {
				get() {
					if (this.settings.perRow) {
						return this.settings.perRow
					}
					return 4
				},
				set(value) {
					this.setSetting('perRow', value)
				}
			},
			...mapState('obs', {
				currentSceneCollection: state => state.scenecollection.current,
				scenes: state => state.scenecollection.list
			})
		},
		methods: {
			async switchScenes(name) {
				await this.setScene({name})
			},
			...mapActions('obs', {
				setScene: 'scenecollection/current'
			})
		}
	}
</script>
