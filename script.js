const nameElement = document.querySelector(".add-form-name");
const commentElement = document.querySelector(".add-form-text");
const addButtonElement = document.querySelector(".add-form-button");
const listElement = document.querySelector(".comments");
const formElement = document.querySelector(".add-form");
const deleteButtonElement = document.querySelector(".remove-form-button");
const date = new Date();

// Создаем массив для хранения комментариев
const commentators = [
	{
		name: "Глеб Фокин",
		date: "12.02.22 12:18",
		comment: "Это будет первый комментарий на этой странице",
		likeCounter: 3,
		likeCondition: false, // состояние кнопки - лайк
		isEdit: false, // состояние edit/save
	},
	{
		name: "Варвара Н.",
		date: "13.02.22 19:22",
		comment: "Мне нравится как оформлена эта страница! ❤",
		likeCounter: 75,
		likeCondition: true,
		isEdit: false,
	},
];

// Создаем рендер-функцию
const renderCommentators = () => {
	const commentatorsHtml = commentators.map((commentator, index) => {
			return `<li class="comment" data-index="${index}">
			<div class="comment-header">
				<div>${commentator.name}</div>
				<div>${commentator.date}</div>
			</div>
			<div class="comment-body">
				${commentator.isEdit ? `<textarea id="input" class="comment-text textarea" type="texrarea">${commentator.comment}</textarea>` : `<div class="comment-text">${commentator.comment.replaceAll("QUOTE_BEGIN", "<div class='quote'>").replaceAll("QUOTE_END", "</div>")}</div>`}
			</div>
			<div class="comment-footer">
				${commentator.isEdit ? `<button data-index="${index}" class="save-form-button">Сохранить</button>` : `<button data-index="${index}" class="edit-form-button">Редактировать</button>`}
				<div class="likes">
					<span class="likes-counter">${commentator.likeCounter}</span>
					<button class="like-button ${commentator.likeCondition ? '-active-like' : ''}" data-index="${index}"></button>
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
			if (commentators[index].likeCondition) {
				commentators[index].likeCondition = false;
				commentators[index].likeCounter -= 1;
			} else {
				commentators[index].likeCondition = true;
				commentators[index].likeCounter += 1;
			}
			renderCommentators();
		})
	}
}

// Функция для ответа на сообщение пользователя
function replyMessage () {
	const eachElementList = document.querySelectorAll(".comment");
	for (const each of eachElementList) {
		const index = each.dataset.index;
		each.addEventListener('click', () => {
			commentElement.value = `QUOTE_BEGIN « ${commentators[index].comment} » (${commentators[index].name}) QUOTE_END \n `;
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
			commentators[index].comment = inputMessage.value;
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
	commentators.push({
		name: nameElement.value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'), 
		// безопасность (производим замену символов) - пользователь не может вводить теги в поле ввода, тем самым ломая вёрстку, или что ещё хуже...
		date: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}.${date.getMonth() < 10 ? "0" : ""}${date.getMonth() + 1}.${date.getFullYear() - 2000} ${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`,
		comment: commentElement.value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'),
		likeCounter: 0,
		likeCondition: false,
		isEdit: false,
	})
	renderCommentators();
	nameElement.value = ""; // очищаем поле формы после ввода
	commentElement.value = "";
}

// Расширенная валидация.Кнопка некликабельна, если имя или текст в форме незаполненные
formElement.addEventListener("input", () => {
	if (nameElement.value === "" || commentElement.value === "") { // проверяем пуста ли строка?
		addButtonElement.disabled = true; // если да, то делаем кнопку disabled(неполноценной)
	} else {
		addButtonElement.disabled = false; // иначе, кнопка кликабельна
	}
});

// Добавление элемента в список по нажатию Enter
formElement.addEventListener("keyup", (e) => {
	if (e.code === "Enter" && nameElement.value !== "" && commentElement.value !== "") {
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