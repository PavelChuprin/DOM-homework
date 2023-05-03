export const getListComments = (commentator, index) => {
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
}