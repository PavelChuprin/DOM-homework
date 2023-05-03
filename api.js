// В приложении есть модуль api.js с запросами в api, 
// функция fetch вызывается только в этом модуле;

export function fetchGetApi () {
	return fetch('https://webdev-hw-api.vercel.app/api/v1/pavel-chuprin/comments', {
		method: "GET",
	})
	.then((response) => {
		return response.json();
	})
}

export function fetchPostApi(nameElement, commentElement) {
	return fetch('https://webdev-hw-api.vercel.app/api/v1/pavel-chuprin/comments', {
		method: "POST",
		body: JSON.stringify({
			name: nameElement, 
			text: commentElement,
		})
	})
}