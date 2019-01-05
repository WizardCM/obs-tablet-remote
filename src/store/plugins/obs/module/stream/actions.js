function connectionClosed({commit}) {
	commit('stream/reset')
}

function connectionReady({dispatch}) {
	return dispatch('stream/reload')
}

function eventStreamStatus({commit}, data) {
	commit('stream/status', data)
}

function eventRecordingStarting({commit}) {
	commit('stream/set/recording', 'starting')
}

function eventRecordingStarted({commit}) {
	commit('stream/set/recording', true)
}

function eventRecordingStopping({commit}) {
	commit('stream/set/recording', 'stopping')
}

function eventRecordingStopped({commit}) {
	commit('stream/set/recording', false)
}

function eventStreamStarting({commit}) {
	commit('stream/set/streaming', 'starting')
}

function eventStreamStarted({commit}) {
	commit('stream/set/streaming', true)
}

function eventStreamStopping({commit}) {
	commit('stream/set/streaming', 'stopping')
}

function eventStreamStopped({commit}) {
	commit('stream/set/streaming', false)
}

function eventReplayStarting({commit}) {
	commit('stream/set/replaybufferRecording', 'starting')
}
function eventReplayStarted({commit}) {
	commit('stream/set/replaybufferRecording', true)
}
function eventReplayStopping({commit}) {
	commit('stream/set/replaybufferRecording', 'stopping')
}
function eventReplayStopped({commit}) {
	commit('stream/set/replaybufferRecording', false)
}

async function setreplaybufferRecording({commit, getters: {client}}, {status}) {
	const req = 'StartStopReplayBuffer'
	
	await client.send({'request-type': req})
}

async function saveReplayBuffer({commit, getters: {client}}) {
	const {
		status,
		error
	} = await client.send({'request-type': 'SaveReplayBuffer'})
	if (status != 'ok') {
		commit('stream/set/replaySaving', 'Error: '+ error)

		this.resetReplayText = setTimeout(function() {
			commit('stream/set/replaySaving', 'Save Replay')
		}, 4000);
	}
	else if (status === 'ok') {
		commit('stream/set/replaySaving', 'Saving...')
		
		this.resetReplayText = setTimeout(function() {
			commit('stream/set/replaySaving', 'Save Replay')
		}, 3000);
	}
}

async function setStreaming({commit, getters: {client}}, {status}) {
	const enable = status
	const req = status ? 'StartStreaming' : 'StopStreaming'
	
	await client.send({'request-type': 'SetHeartbeat', enable}) //(en|dis)able the heartbeat
	await client.send({'request-type': req})
}

async function setRecording({commit, getters: {client}}, {status}) {
	const enable = status
	const req = status ? 'StartRecording' : 'StopRecording'
	
	await client.send({'request-type': 'SetHeartbeat', enable}) //(en|dis)able the heartbeat
	await client.send({'request-type': req})
}

async function streamReload({commit, getters: {client}}) {
	const {
		streaming,
		recording,
		replaybufferRecording, //placeholder variable name, currently no replay buffer status is returned via websocket
		'stream-timecode': streamTimecode,
		'rec-timecode': recTimecode
	} = await client.send({'request-type': 'GetStreamingStatus'})

	commit('stream/set/streaming', streaming)
	commit('stream/set/recording', recording)
	commit('stream/set/streamTimecode', streamTimecode)
	commit('stream/set/recTimecode', recTimecode)
	commit('stream/set/replaybufferRecording', replaybufferRecording) //placeholder variable name, currently no replay buffer status is returned via websocket
}

export default {
	'connection/closed': connectionClosed,
	'connection/ready': connectionReady,
	'event/RecordingStarted': eventRecordingStarted,
	'event/RecordingStarting': eventRecordingStarting,
	'event/RecordingStopped': eventRecordingStopped,
	'event/RecordingStopping': eventRecordingStopping,
	'event/StreamStarted': eventStreamStarted,
	'event/StreamStarting': eventStreamStarting,
	'event/StreamStopped': eventStreamStopped,
	'event/StreamStopping': eventStreamStopping,
	'event/StreamStatus': eventStreamStatus,
	'event/ReplayStarting' : eventReplayStarting,
	'event/ReplayStarted' : eventReplayStarted,
	'event/ReplayStopping' : eventReplayStopping,
	'event/ReplayStopped' : eventReplayStopped,
	'stream/streaming': setStreaming,
	'stream/recording': setRecording,
	'stream/replaybufferRecording': setreplaybufferRecording,
	'stream/saveReplay': saveReplayBuffer,
	'stream/reload': streamReload,

	'event/Heartbeat': eventStreamStatus // get stream status with heartbeat
}
