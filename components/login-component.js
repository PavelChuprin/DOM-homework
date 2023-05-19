import { loginUser, registerUser } from "../api.js";

export function renderLoginComponent({ appEl, setToken, getFunc, setName }) {

	let isLoginMode = true;
	
	const renderForm = () => {
		const formLoginHtml = `
		<div class="container">
		
			<div class="add-form">
				<h3 class="comment-text">Форма ${isLoginMode ? 'входа' : 'регистрации'}</h3>
				${isLoginMode ? '' : '<input id="name-input" type="text" class="add-form-text" placeholder="Введите имя"/>'}
				<input id="login-input" type="text" class="add-form-text" placeholder="Введите логин"/>
				<input id="password-input" type="password" class="add-form-text" placeholder="Введите пароль"/>
				<div class="add-form-column">
					<button id="login-button" class="add-form-button">${isLoginMode ? 'Войти' : 'Зарегистрироваться'}</button>
					<button id="toggle-button" class="registration-form-button">${isLoginMode ? 'Зарегистрироваться' : 'К форме входа'}</button>
					</div>
			</div>

		</div>`

appEl.innerHTML = formLoginHtml;

document.getElementById('login-button').addEventListener("click", () => {
	if(isLoginMode) {
		const login = document.getElementById("login-input").value;
		const password = document.getElementById("password-input").value;
		if (!login) {
			alert("Введите логин");
			return;
		}
		if (!password) {
			alert("Введите пароль");
			return;
		}
		loginUser({
			login: login,
			password: password,
		}).then((user) => {
			setName(user.user.name);
			setToken(`Bearer ${user.user.token}`);
			getFunc(true)
		})
		.catch(error => {
			alert(error.message);
		})
	} else {
		const name = document.getElementById("name-input").value;
		const login = document.getElementById("login-input").value;
		const password = document.getElementById("password-input").value;
		if (!name) {
			alert("Введите имя");
			return;
		}
		if (!login) {
		alert("Введите логин");
			return;
		}
		if (!password) {
			alert("Введите пароль");
			return;
		}
		registerUser({
			login: login,
			password: password,
			name: name,
		}).then((user) => {
			setToken(`Bearer ${user.user.token}`);
			getFunc(true);
		})
		.catch(error => {
			alert(error.message);
		})
	}
});

document.getElementById("toggle-button").addEventListener("click", () => {
	isLoginMode = !isLoginMode;
	renderForm();
})
}
renderForm();
}