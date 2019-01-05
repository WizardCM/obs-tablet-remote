import actions from './actions'
import mutations from './mutations'

export default {
	state: {
		streaming: false,
		recording: false,
		replaybufferRecording: false, //placeholder variable name, currently no replay buffer status is returned via websocket
		replaySaving: 'Save Replay',
		bytesPerSec: 0,
		kbitsPerSec: 0,
		strain: 0,
		totalStreamTime: 0,
		streamTimecode: 0,
		recTimecode: 0,
		numTotalFrames: 0,
		numDroppedFrames: 0,
		fps: 0
	},
	actions,
	getters: {
		recordingText(state) {
			if (state.recording === true) {
				return state.recTimecode
			}
			if (state.recording === false) {
				return 'Offline'
			}
			return state.recording
		},
		streamingText(state) {
			if (state.streaming === true) {
				return state.streamTimecode
			}
			if (state.streaming === false) {
				return 'Offline'
			}
			return state.streaming
		},
		/* 
		* This can get out of sync because getstreamstatus doesn't return anything for the replay buffer
		* If the replay buffer is to be used, it must be started / stopped AFTER connecting to OBS via the remote in order to
		* keep the button status in sync with the remote interface
		*/
		replaybufferRecordingText(state) {
			if (state.replaybufferRecording === true) {
				return 'Recording'
			}
			if (state.replaybufferRecording === false) {
				return 'Offline'
			}
			if (state.replaybufferRecording === undefined) {
				return 'Status Unknown'
			}
			return state.replaybufferRecording
		},
		replaySavingText(state) {
			/*nothing much happens here
			* Possibly in the future if the api/websocket outputs the status of the replay buffer
			* in the StreamStatus event, this button will respond to that, for now it's more or less
			* hard coded to certain values that "sort of always work". Regardless of whether the remote
			* thinks the replay buffer is active or not, this button will always try to save the replay buffer
			* to disk and display an error message if the replay buffer is inactive.
			*/
			return state.replaySaving
		}
	},
	mutations
}
