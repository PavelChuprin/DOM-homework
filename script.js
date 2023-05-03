import { renderCommentators } from "./renderCommentators.js";
import { getListComments } from "./listComments.js";
import { fetchGetApi, fetchPostApi } from "./api.js";

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
	fetchGetApi()
	.then((responseData) => {
		commentators = responseData.comments;
		loaderAnimation.classList.add("display-none");
		formElement.classList.remove("display-none");
		renderCommentators(commentators, listElement, getListComments);
		funcLikes();
		editMessage();
		saveMessage();
		replyMessage();
		areaEditMessage();
	})
}
getFunc();

renderCommentators(commentators, listElement, getListComments);

// Кнопка лайков
function funcLikes() {
	const buttonLikes = document.querySelectorAll(".like-button");
	for (const btnLike of buttonLikes) {
		const index = btnLike.dataset.index;
		btnLike.addEventListener("click", (event) => {
			event.stopPropagation(); 
			// при клике на кнопку лайков мы прерываем дальнейшее всплытие событий
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
			renderCommentators(commentators, listElement, getListComments);
			funcLikes();
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
			// renderCommentators(commentators, listElement, getListComments);
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
			renderCommentators(commentators, listElement, getListComments);
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
			renderCommentators(commentators, listElement, getListComments);
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
	
	commentators.push({
		name: nameElement.value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;'), 
		// безопасность (производим замену символов) - 
		// пользователь не может вводить теги в поле ввода, 
		//тем самым ломая вёрстку, или что ещё хуже...
		date: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}.
		${date.getMonth() < 10 ? "0" : ""}${date.getMonth() + 1}.
		${date.getFullYear() - 2000} 
		${date.getHours() < 10 ? "0" : ""}${date.getHours()}:
		${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`,
		text: commentElement.value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;'),
		likes: 0,
		isLiked: false,
		isEdit: false,
		forceError: true, // рандомная инициация ошибки 500
	})

	function postFunc() {
		fetchPostApi(nameElement.value, commentElement.value)
		.then((response) => {
			if (response.status === 201) {
				nameElement.value = ""; // очищаем поле формы после ввода (и успешной отправки на сервер)
				commentElement.value = "";
			}
			else if (response.status === 400) {
				alert('Имя и комментарий должны быть не короче 3 символов');
			} else {
				throw new Error("Сервер упал"); // или return Promise.reject(new Error("Сервер упал"));
				
				// alert('Сервер сломался, попробуй позже');
				// комментируем, чтобы alert не всплывал и не мешал нам,
				// а отработала автоматическая отправка коммента на сервер при ошибке 500
			}
		})
		.then(() => {
			return getFunc();
		})
		.catch((error) => {
			if (error.message === "Сервер упал") {
				postFunc();
			} else {
				alert('Кажется, у вас сломался интернет, попробуйте позже');
				loaderAnimation.classList.add("display-none");
				formElement.classList.remove("display-none");
			}
		})
	}
	postFunc();
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
	// renderCommentators(commentators, listElement, getListComments);
});
// Удаление последнего элемента 2 способ
// deleteButtonElement.addEventListener("click", () => {
// 	const commentsAll = document.getElementById('comments-all');
// 	commentsAll.lastChild.remove();
// 	commentators.pop();
// 	renderCommentators(commentators, listElement, getListComments);
// });