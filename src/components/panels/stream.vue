<template>
	<panel-wrapper :content-class="['panel-stream', 'is-scrollable']">
		<template slot="name">Stream Status</template>
		<DangerousButton
			:class="[streaming ? 'is-active' : 'is-inactive']"
			:vibrate="true"
			@click="setStreaming({status: !streaming})"
		>
			Streaming: {{ streamingText }}
		</DangerousButton>
		<DangerousButton
			:class="[recording ? 'is-active' : 'is-inactive']"
			:vibrate="true"
			@click="setRecording({status: !recording})"
		>
			Recording: {{ recordingText }}
		</DangerousButton>
		<DangerousButton
		:class="[replaybufferRecording ? 'is-active' : 'is-inactive']"
		:vibrate="true"
		@click="setreplaybufferRecording({status: !replaybufferRecording})"
	>
		Replay: {{ replaybufferRecordingText }}
	</DangerousButton>
	<button
		class="is-inactive"
		:vibrate="true"
		@click="saveReplayBuffer()"
	>
		{{ replaySavingText }}
	</button>
	</panel-wrapper>
</template>

<script>
	import {mapActions, mapGetters, mapState} from 'vuex'

	import panelMixin from '../mixins/panel'
	import DangerousButton from '../dangerous-button'

	export default {
		components: {
			DangerousButton
		},
		mixins: [panelMixin],
		computed: {
			...mapState('obs', {
				recording: state => state.stream.recording,
				recTimecode: state => state.stream.recTimecode,
				streaming: state => state.stream.streaming,
				streamTimecode: state => state.stream.streamTimecode,
				replaybufferRecording: state => state.stream.replaybufferRecording,
				replaySaving: state => state.stream.replaySaving
			}),
			...mapGetters('obs', ['recordingText', 'streamingText', 'replaybufferRecordingText', 'replaySavingText'])
		},
		methods: {
			...mapActions('obs', {
				setRecording: 'stream/recording',
				setStreaming: 'stream/streaming',
				setreplaybufferRecording: 'stream/replaybufferRecording',
				saveReplayBuffer: 'stream/saveReplay'
			})
		}
	}
</script>
