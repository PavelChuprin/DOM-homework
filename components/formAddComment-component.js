import { funcButtonAddComment, commentators } from "../script.js";

export const renderFormInputComponent = (appEl, name) => {

const formAddCommentHtml = `
	<div class="container">
		<div class="add-form">
			<input value="${name}" type="text" class="add-form-name" disabled="disabled"/>
			<textarea type="textarea" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
			<div class="add-form-row">
			<button disabled="true" class="add-form-button">Написать</button>
			</div>
		</div>
	</div>`;

	appEl.innerHTML += formAddCommentHtml;

	const addButtonElement = document.querySelector(".add-form-button");
	const formElement = document.querySelector(".add-form");
	const nameElement = document.querySelector(".add-form-name");
	const commentElement = document.querySelector(".add-form-text");

		//Добавляем обработчик события на клик по кнопке "Добавить"
	addButtonElement.addEventListener("click", () => {
		addButtonElement.textContent = "Добавляется";
	nameElement.classList.remove("error"); //здесь стили (error) удаляются, если всё хорошо
	if (nameElement.value === "") {
		// если поле ввода пустое
		nameElement.classList.add("error"); // то добавляем новые стили (error) для поля ввода
		return;
	}
	commentElement.classList.remove("error");
	if (commentElement.value === "") {
		commentElement.classList.add("error");
		return;
	}
	funcButtonAddComment();
});

// Расширенная валидация.Кнопка некликабельна, если имя или текст в форме незаполненные
formElement.addEventListener("input", () => {
	if (nameElement.value.trim() === "" || commentElement.value.trim() === "") {
		// проверяем пуста ли строка?
		addButtonElement.disabled = true; // если да, то делаем кнопку disabled(неполноценной)
	} else {
		addButtonElement.disabled = false; // иначе, кнопка кликабельна
	}
});

// Добавление элемента в список по нажатию Enter
formElement.addEventListener("keyup", (e) => {
	if (e.code === "Enter" && nameElement.value.trim() !== "" && commentElement.value.trim() !== "") {
		funcButtonAddComment();
	}
});

// Функция для ответа на сообщение пользователя
function replyMessage() {
	const eachElementList = document.querySelectorAll(".comment");
	for (const each of eachElementList) {
		const index = each.dataset.index;
		each.addEventListener("click", () => {
		commentElement.scrollIntoView({ behavior: "smooth" }); // плавная прокрутка к полю ввода
		commentElement.value = `» ${commentators[index].text} (${commentators[index].author.name}) © \n `;
		});
	}
}
replyMessage();

};
