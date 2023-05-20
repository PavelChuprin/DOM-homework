import { format } from "date-fns";

export const getListComments = (user, index) => {
	const createDate = format(new Date(user.date), "yyyy-MM-dd hh.mm.ss");
	return `
	<li class="comment" data-index="${index}">
<div class="comment-header">
	<div >${user.author.name}</div>
	<div>${createDate}</div>
</div>
<div class="comment-body">
	<div class="comment-text">${user.text.replaceAll("»", "<div class='quote'>").replaceAll("©", "</div>")}</div>
</div>
<div class="comment-footer">
	<div class="likes">
		<span class="likes-counter">${user.likes}</span>
		<button class="like-button ${user.isLiked ? '-active-like' : ''}" data-index="${index}"></button>
	</div>
</div>
</li>`
}