import { getListComments } from "./listComments.js";
import { fetchGetApi, fetchPostApi } from "./api.js";
import { renderLoginComponent } from "./components/login-component.js";
import { renderFormInputComponent } from "./components/formAddComment-component.js";

const date = new Date();

// Создаем массив для хранения комментариев
export let commentators = [];

let token = "Bearer asb4c4boc86gasb4c4boc86g37w3cc3bo3b83k4g37k3bk3cg3c03ck4k";

// Ф-ция для API запроса с м-дом GET
const getFunc = (isRenderAddCommentForm = false) => {
	return fetchGetApi({ token }).then((responseData) => {
	commentators = responseData.comments;

	renderApp(isRenderAddCommentForm);
	return responseData.comments;

	});
};
getFunc();

// Функция рендера всего приложения
const renderApp = (isRenderAddCommentForm = false) => {
	
	const appEl = document.getElementById("app");

	const commentatorsHtml = commentators
	.map((user, index) => getListComments(user, index))
	.join("");
	
	const appHtml = `
	<div class="container">
		<ul class="comments" id="comments-all">
			${commentatorsHtml}
		</ul>
		<div class="authorization"><p class="authorization-text">Для добавления комментария,<button class="authorization-button">авторизуйтесь</button></p></div>
	</div>`;

	appEl.innerHTML = appHtml;

	if (isRenderAddCommentForm) {
		document.querySelector(".authorization").classList.add("display-none");
		renderFormInputComponent(appEl, name);
	}

	document.querySelector(".authorization-button").addEventListener("click", () => {
		renderLoginComponent({
			appEl,
			setToken: (newToken) => {
				token = newToken;
			},
			setName: (newName) => {
				name = newName; 
			},
			getFunc,
		});
	});

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
		 }
		 delay(2000).then(() => {
			if (commentators[index].isLiked) {
			  commentators[index].isLiked = false;
			  commentators[index].likes -= 1;
			} else {
			  commentators[index].isLiked = true;
			  commentators[index].likes += 1;
			}
			renderApp();
		 });
	  });
	}
}
funcLikes();

};

renderApp();


// Функция для добавления нового блока комментариев
export const funcButtonAddComment = () => {

  const nameElement = document.querySelector(".add-form-name");
  const commentElement = document.querySelector(".add-form-text");

  commentators.push({
    name: nameElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
    // безопасность (производим замену символов) -
    // пользователь не может вводить теги в поле ввода,
    //тем самым ломая вёрстку, или что ещё хуже...
    date: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}.
		${date.getMonth() < 10 ? "0" : ""}${date.getMonth() + 1}.
		${date.getFullYear() - 2000} 
		${date.getHours() < 10 ? "0" : ""}${date.getHours()}:
		${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`,
    text: commentElement.value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;"),
    likes: 0,
    isLiked: false,
    isEdit: false,
    forceError: false, // рандомная инициация ошибки 500
  });

  function postFunc() {
    fetchPostApi({
      name: nameElement.value,
      text: commentElement.value,
      token,
    })
      .then((response) => {
        if (response.status === 201) {
          nameElement.value = ""; // очищаем поле формы после ввода (и успешной отправки на сервер)
          commentElement.value = "";
        } else if (response.status === 400) {
          alert("Имя и комментарий должны быть не короче 3 символов");
        } else {
          throw new Error("Сервер упал"); // или return Promise.reject(new Error("Сервер упал"));

          // alert('Сервер сломался, попробуй позже');
          // комментируем, чтобы alert не всплывал и не мешал нам,
          // а отработала автоматическая отправка коммента на сервер при ошибке 500
        }
      })
      .then(() => {
        return getFunc(true);
      })
      .catch((error) => {
        if (error.message === "Сервер упал") {
          postFunc();
        } else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
      });
  }
  postFunc();
};


// // Редактирование текста написанного комментария
// function buttonEditMessage() {
//   const buttonEdit = document.querySelectorAll(".edit-form-button");
//   for (const edBtn of buttonEdit) {
//     const index = edBtn.dataset.index;
//     edBtn.addEventListener("click", (event) => {
//       event.stopPropagation(); // прерывание всплытия событий
//       commentators[index].isEdit = !commentators[index].isEdit;

//     });
//   }
// }

// // При попытке отредактировать комментарий в поле ввода textarea, также останавливаем всплытие событий
// function areaEditMessage() {
//   const areaEditMessageElement = document.querySelectorAll(".textarea");
//   for (const item of areaEditMessageElement) {
//     item.addEventListener("click", (event) => {
//       event.stopPropagation();
//     });
//   }
// }

// // Кнопка сохранения комментария
// function buttonSaveMessage() {
//   const buttonSave = document.querySelectorAll(".save-form-button");
//   for (const saveBtn of buttonSave) {
//     const inputMessage = document.getElementById("input");
//     const index = saveBtn.dataset.index;
//     saveBtn.addEventListener("click", (event) => {
//       event.stopPropagation(); // прерывание всплытия событий
//       commentators[index].isEdit = false;
//       commentators[index].text = inputMessage.value;

//     });
//   }
// }