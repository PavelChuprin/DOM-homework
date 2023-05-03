//В приложении есть модуль с рендер функцией, 
// innerHtml можно использовать только в этом модуле, в других нельзя

// Создаем рендер-функцию
export const renderCommentators = (commentators, listElement, getListComments) => {
	const commentatorsHtml = commentators.map((commentator, index) => 
	getListComments(commentator, index))
	.join('');
	listElement.innerHTML = commentatorsHtml;
}

// export default renderCommentators;