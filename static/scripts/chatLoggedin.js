function loadChatClient(session = null) {
	// extract user id
	let matrixUserId = '';
	if (session) {
		matrixUserId = session.userId;
	} else {
		matrixUserId = window.localStorage.getItem('mx_user_id');
	}

	// extract room id
	let roomId = '';
	const matches = RegExp('/courses/([^/]+).*').exec(window.location.pathname);
	if (matches && matches.length >= 2) {
		roomId = matches[1];
	}
	let matrixRoomId = '';
	if (matrixUserId && roomId) {
		const servername = matrixUserId.substr(matrixUserId.indexOf(':') + 1);
		matrixRoomId = `#course_${roomId}:${servername}`;
	}

	// create chat tag
	const riotBox = document.createElement('section');
	riotBox.id = 'matrixchat';
	riotBox.dataset.vectorIndexeddbWorkerScript = '/indexeddb-worker.js';
	riotBox.dataset.vectorConfig = '/riot_config.json';
	riotBox.dataset.vectorDefaultToggled = 'true';
	riotBox.dataset.matrixLang = 'de';
	riotBox.dataset.matrixRoomId = matrixRoomId;

	if (session) {
		riotBox.dataset.matrixHomeserverUrl = session.homeserverUrl;
		riotBox.dataset.matrixUserId = session.userId;
		riotBox.dataset.matrixAccessToken = session.accessToken;
	}
	document.body.appendChild(riotBox);

	// load javascript
	const bundle = window.matrixBundle;
	if (!bundle) {
		throw new Error('window.matrixBundle has to be defined.');
	}
	const riotScript = document.createElement('script');
	riotScript.src = bundle;
	riotScript.type = 'text/javascript';
	document.head.appendChild(riotScript);
}

function requestSession() {
	return $.getJSON('/messenger/token');
}

function ready() {
	if (window.innerWidth < 768) { // breakpoint: md
		return; // screen to small to use embedded messenger
	}

	// Find Matrix Session
	// > in localstorage?
	if (window.localStorage
		&& window.localStorage.getItem('mx_hs_url')
		&& window.localStorage.getItem('mx_access_token')
		&& window.localStorage.getItem('mx_user_id')
	) {
		// session available, the chat will access it itself
		loadChatClient();
	} else {
		// > get new Session from Server and pass it to the chat
		requestSession()
			.then(loadChatClient)
			.catch((error) => {
				/* eslint-disable-next-line no-console */
				console.error('Failed to request Messenger Session.', error);
			});
	}
}

$(document).ready(ready);
