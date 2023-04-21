const nameElement = document.querySelector(".add-form-name");
const commentElement = document.querySelector(".add-form-text");
const addButtonElement = document.querySelector(".add-form-button");
const listElement = document.querySelector(".comments");
const formElement = document.querySelector(".add-form");
const deleteButtonElement = document.querySelector(".remove-form-button");
const loaderAnimation = document.querySelector('.loader');
const date = new Date();

// Создаем массив для хранения комментариев
let commentators = [];

// Ф-ция для API запроса с м-дом GET
function getFunc() {
	fetch('https://webdev-hw-api.vercel.app/api/v1/pavel-chuprin/comments', {
		method: "GET",
	})
	.then((response) => {
		return response.json();
	})
	.then((responseData) => {
		commentators = responseData.comments;
		loaderAnimation.classList.add("display-none");
		formElement.classList.remove("display-none");
		renderCommentators();
	})
}
getFunc();

// Создаем рендер-функцию
const renderCommentators = () => {
	const commentatorsHtml = commentators.map((commentator, index) => {
			return `<li class="comment" data-index="${index}">
			<div class="comment-header">
				<div>${commentator.author.name}</div>
				<div>${commentator.date}</div>
			</div>
			<div class="comment-body">
				${commentator.isEdit ? `<textarea id="input" class="comment-text textarea" type="texrarea">${commentator.text}</textarea>` : `<div class="comment-text">${commentator.text.replaceAll("»", "<div class='quote'>").replaceAll("©", "</div>")}</div>`}
			</div>
			<div class="comment-footer">
				${commentator.isEdit ? `<button data-index="${index}" class="save-form-button">Сохранить</button>` : `<button data-index="${index}" class="edit-form-button">Редактировать</button>`}
				<div class="likes">
					<span class="likes-counter">${commentator.likes}</span>
					<button class="like-button ${commentator.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
				</div>
			</div>
			</li>`
	})
	.join('');
	listElement.innerHTML = commentatorsHtml;
	funcLikes();
	editMessage();
	saveMessage();
	replyMessage();
	areaEditMessage();
}
renderCommentators();

// Кнопка лайков
function funcLikes() {
	const buttonLikes = document.querySelectorAll(".like-button");
	for (const btnLike of buttonLikes) {
		const index = btnLike.dataset.index;
		btnLike.addEventListener("click", (event) => {
			event.stopPropagation(); // при клике на кнопку лайков мы прерываем дальнейшее всплытие событий
			// это же не забываем сделать для кнопки "Редактировать / Сохранить" ниже, т.к. они тоже находятся в элементе li
			// и по правильному сценарию не должны запускать последующие всплытия событий
			btnLike.classList.add("-loading-like");

// Функция для имитации запросов в API с задержкой Timeout()
	function delay(interval) {
		return new Promise((resolve) => {
			setTimeout(() => {
			resolve();
			}, interval);
		});
	};
		delay(2000).then(() => {
			if (commentators[index].isLiked) {
				commentators[index].isLiked = false;
				commentators[index].likes -= 1;
			} else {
				commentators[index].isLiked = true;
				commentators[index].likes += 1;
			}
			renderCommentators();
		});
		})
	}
}

// Функция для ответа на сообщение пользователя
function replyMessage () {
	const eachElementList = document.querySelectorAll(".comment");
	for (const each of eachElementList) {
		const index = each.dataset.index;
		each.addEventListener('click', () => {
			commentElement.scrollIntoView({behavior: "smooth"}); // плавная прокрутка к полю ввода
			commentElement.value = `» ${commentators[index].text} (${commentators[index].author.name}) © \n `;
			renderCommentators();
		})
	}
}

// Редактирование текста написанного комментария
function editMessage() {
	const buttonEdit = document.querySelectorAll(".edit-form-button");
	for (const edBtn of buttonEdit) {
		const index = edBtn.dataset.index;
		edBtn.addEventListener("click", (event) =>{
			event.stopPropagation(); // прерывание всплытия событий
			commentators[index].isEdit = !commentators[index].isEdit;
			renderCommentators();
		})
	}
}

// При попытке отредактировать комментарий в поле ввода textarea, также останавливаем всплытие событий
function areaEditMessage () { 
	const areaEditMessageElement = document.querySelectorAll(".textarea");
	for (const item of areaEditMessageElement) {
		item.addEventListener('click', (event) => {
			event.stopPropagation();
		})
	}
}

// Кнопка сохранения комментария
function saveMessage() {
	const buttonSave = document.querySelectorAll(".save-form-button");
	for (const saveBtn of buttonSave) {
		const inputMessage = document.getElementById("input");
		const index = saveBtn.dataset.index;
		saveBtn.addEventListener("click", (event) => {
			event.stopPropagation();  // прерывание всплытия событий
			commentators[index].isEdit = false;
			commentators[index].text = inputMessage.value;
			renderCommentators();
		})
	}
}

//Добавляем обработчик события на клик по кнопке "Добавить"
addButtonElement.addEventListener("click", () => {
	nameElement.classList.remove("error"); //здесь стили (error) удаляются, если всё хорошо
	if (nameElement.value === "") { // если поле ввода пустое
		nameElement.classList.add("error"); // то добавляем новые стили (error) для поля ввода
		return;
	}
	commentElement.classList.remove("error");
	if (commentElement.value === "") {
		commentElement.classList.add("error");
		return;
	}
	funcButton();
});

// Функция для добавления нового блока комментариев
function funcButton() {
	loaderAnimation.classList.remove("display-none");
	formElement.classList.add("display-none");
		fetch('https://webdev-hw-api.vercel.app/api/v1/pavel-chuprin/comments', {
			method: "POST",
			body: JSON.stringify({
				name: nameElement.value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'), 
				// безопасность (производим замену символов) - пользователь не может вводить теги в поле ввода, тем самым ломая вёрстку, или что ещё хуже...
				date: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}.${date.getMonth() < 10 ? "0" : ""}${date.getMonth() + 1}.${date.getFullYear() - 2000} 
				${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`,
				text: commentElement.value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'),
				likes: 0,
				isLiked: false,
				isEdit: false,
			})
		})
		.then(() => {
			getFunc();
		});

	nameElement.value = ""; // очищаем поле формы после ввода
	commentElement.value = "";
}

// Расширенная валидация.Кнопка некликабельна, если имя или текст в форме незаполненные
formElement.addEventListener("input", () => {
	if (nameElement.value.trim() === "" || commentElement.value.trim() === "") { // проверяем пуста ли строка?
		addButtonElement.disabled = true; // если да, то делаем кнопку disabled(неполноценной)
	} else {
		addButtonElement.disabled = false; // иначе, кнопка кликабельна
	}
});

// Добавление элемента в список по нажатию Enter
formElement.addEventListener("keyup", (e) => {
	if (e.code === "Enter" && nameElement.value.trim() !== "" && commentElement.value.trim() !== "") {
		funcButton();
	}
});

// Удаление последнего элемента
deleteButtonElement.addEventListener("click", () => {
	const lastComment = listElement.innerHTML.lastIndexOf('<li class="comment">');
	listElement.innerHTML = listElement.innerHTML.slice(0, lastComment);
	commentators.pop();
	renderCommentators();
});
// Удаление последнего элемента 2 способ
// deleteButtonElement.addEventListener("click", () => {
// 	const commentsAll = document.getElementById('comments-all');
// 	commentsAll.lastChild.remove();
// 	commentators.pop();
// 	renderCommentators();
// });