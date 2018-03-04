export default {
    state: {
        current: null,
        list: []
    },
    actions: {
		async 'connection/ready'({dispatch}) {
			return dispatch('scenecollection/Reload')
		},

        async 'scenecollection/Reload'({commit, getters: {client}}) {
            console.log("Scene collection reload triggered");
            const currentSceneCollectionSelection = await client.send({'request-type': 'GetCurrentSceneCollection'})
            const sceneCollectionList = await client.send({'request-type': 'ListSceneCollections'})

            commit('scenecollection/GetCurrent', {'sc-name': currentSceneCollectionSelection['sc-name']})
            commit('scenecollection/GetList', sceneCollectionList['scene-collections'])
        },

        'scenecollection/current'({getters: {client}}, {name}) {
            return client.send({'request-type': 'SetCurrentSceneCollection', 'sc-name': name})
        },

        'event/SceneCollectionChanged'({dispatch}) {
            return dispatch('scenecollection/Reload')
        },

        'event/SceneCollectionListChanged'({dispatch}) {
            return dispatch('scenecollection/Reload')
        }
    },
    getters: {
        currentSceneCollectionSelection(state) {
            return state.current
        },
        sceneCollectionList(state) {
            return state.list
        }
    },
    mutations: {
        'scenecollection/GetCurrent'(state, {'sc-name': name}) {
            state.current = name
        },

        'scenecollection/GetList'(state, list) {
            state.list = list
        },

        'scenecollection/current'(state, {'sc-name': name}) {
			state.current = name
		},

        'scenecollection/Reset'(state) {
            state.current = null
            state.list = []
        }
    }
}