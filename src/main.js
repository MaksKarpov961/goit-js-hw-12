import iziToast from 'izitoast'; // Імпорт бібліотеки для сповіщень
import 'izitoast/dist/css/iziToast.min.css'; // Імпорт стилів для iziToast

import SimpleLightbox from "simplelightbox"; // Імпорт бібліотеки для лайтбоксу
import "simplelightbox/dist/simple-lightbox.min.css"; // Імпорт стилів

// Отримуємо форму через клас
const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

// Ініціалізація SimpleLightbox
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Додаємо обробник події submit до форми
form.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  // Зупиняємо стандартну поведінку форми (перезавантаження сторінки)
  event.preventDefault();

  // Створюємо об'єкт FormData для зчитування даних форми
  const formData = new FormData(event.target);

  // Отримуємо значення поля input з ім'ям "search"
  const { search } = Object.fromEntries(formData.entries());

  // Обрізаємо пробіли навколо введеного значення
  const searchValue = search.trim();

  // Викликаємо функцію для отримання даних з API, передаючи пошуковий запит
  getGalleryData(searchValue);
}

const options = {
  method: 'GET', // Метод запиту
};

const API_KEY = '45713433-433c1b648e48abad27090f3cc'; // Ключ для доступу до API Pixabay
const API_URL = 'https://pixabay.com/api/?'; // Базовий URL для запитів

function getGalleryData(queryValue) {
  if (!queryValue) {
    iziToast.error({
      title: 'Error',
      message: 'Пошуковий запит порожній.',
    });
    return;
  }

  // Створюємо параметри запиту
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: queryValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  // Виконуємо запит до API
  fetch(`${API_URL}${searchParams}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then((data) => {
      gallery.innerHTML = ''; // Очищуємо галерею перед додаванням нових елементів

      if (data.hits.length === 0) {
        iziToast.info({
          title: 'Info',
          message: 'Зображення не знайдені за вашим запитом.',
        });
        return;
      }

      // Викликаємо функцію markup для створення розмітки
      const galleryMarkup = markup(data);

      // Додаємо створену розмітку в галерею
      gallery.insertAdjacentHTML('beforeend', galleryMarkup);

      // Оновлюємо SimpleLightbox після додавання нових елементів
      lightbox.refresh();
    })
    .catch((error) => {
      console.error('Помилка:', error);
      iziToast.error({
        title: 'Error',
        message: `Помилка: ${error.message}`,
      });
    });
}

function markup(data) {
  // Створюємо HTML-розмітку на основі даних
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
            <li class="gallery-item">
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
    .join(''); // Перетворюємо масив у рядок HTML

  return markup; // Повертаємо створену розмітку
}
