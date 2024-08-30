// Функція для додавання лоадера на інтерфейс
export function addLoader(gallery) {
  // Створюємо HTML для лоадера
  const loaderHTML = '<span class="loader"></span>';
  
  // Вставляємо лоадер перед галереєю
  gallery.insertAdjacentHTML('beforebegin', loaderHTML);
}

// Функція для видалення лоадера з інтерфейсу
export function removeLoader() {
  // Знаходимо елемент лоадера
  const loader = document.querySelector('.loader');
  
  // Якщо лоадер знайдено, видаляємо його з DOM
  if (loader) {
    loader.remove();
  }
}

// Функція для створення розмітки галереї
export function markup(data) {
  // Створюємо HTML-розмітку для кожного зображення
  return data.hits
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
            <li class="gallery-item hvr-grow">
              <a class="gallery-link" href="${largeImageURL}">
                <img
                  class="gallery-image"
                  src="${webformatURL}"
                  alt="${tags}"
                  loading="lazy"
              /></a>
              <ul class="img-content-wrapper">
                <li class="img-content-descr">Likes<span>${likes}</span></li>
                <li class="img-content-descr">Views<span>${views}</span></li>
                <li class="img-content-descr">Comments<span>${comments}</span></li>
                <li class="img-content-descr">Downloads<span>${downloads}</span></li>
              </ul>
            </li>
      `
    )
    .join(''); // Перетворюємо масив у строку HTML
}
