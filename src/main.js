import iziToast from 'izitoast'; // Імпорт бібліотеки для сповіщень
import 'izitoast/dist/css/iziToast.min.css'; // Імпорт стилів для iziToast

import SimpleLightbox from "simplelightbox"; // Імпорт бібліотеки для лайтбоксу
import "simplelightbox/dist/simple-lightbox.min.css"; // Імпорт стилів

// Отримуємо форму
const form = document.querySelector('.search-form');

// Отримуємо галерею
const gallery = document.querySelector('.gallery');

// Ініціалізація SimpleLightbox
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// Додаємо обробник події submit до форми
form.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  // Зупиняємо стандартну поведінку форми
  event.preventDefault();

  // Створюємо об'єкт FormData для зчитування даних форми
  const formData = new FormData(event.target);

  // Отримуємо значення поля input
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

// Функція для отримання даних з API
function getGalleryData(queryValue) {
  if (!queryValue) {
    // Перевірка: якщо поле пошуку порожнє, виводимо помилку і припиняємо виконання
    iziToast.error({
      title: 'Error',
      message: 'The search query is empty.',
      position: 'topRight',
    });
    return;
  }

  // Додаємо лоадер перед елементом галереї
  addLoader();

  // Створюємо параметри запиту
  const searchParams = new URLSearchParams({
    key: API_KEY,
    q: queryValue, // Пошуковий запит
    image_type: 'photo', // Тип зображення
    orientation: 'horizontal', // Орієнтація зображення
    safesearch: true, // Включаємо безпечний пошук
  });

  // Виконуємо запит до API
  fetch(`${API_URL}${searchParams}`, options)
    .then((response) => {
      if (!response.ok) {
        // Якщо відповідь не успішна, кидаємо помилку з кодом статусу
        throw new Error(response.status);
      }
      return response.json(); // Перетворюємо відповідь в JSON-формат
    })
    .then((data) => {
      gallery.innerHTML = ''; // Очищуємо галерею перед додаванням нових елементів

      if (data.hits.length === 0) {
        // Якщо немає зображень за запитом, виводимо сповіщення
        iziToast.info({
          position: 'topRight',
          title: 'Info',
          message: 'Sorry, there are no images matching your search query. Please try again!',
        });
        return;
      }

      // Викликаємо функцію для створення розмітки галереї
      const galleryMarkup = markup(data);

      // Додаємо створену розмітку в галерею
      gallery.insertAdjacentHTML('beforeend', galleryMarkup);

      // Оновлюємо SimpleLightbox після додавання нових елементів
      lightbox.refresh();
    })
    .catch((error) => {
      // Виводимо помилку у разі невдалого запиту
      console.error('Помилка:', error);
      iziToast.error({
        title: 'Error',
        message: `Error: ${error.message}`,
        position: 'topRight',
      });
    })
    .finally(() => {
      // Видаляємо лоадер після завершення запиту
      removeLoader();
    });
}

// Функція для додавання лоадера
function addLoader() {
  // Створюємо розмітку лоадера
  const loaderHTML = '<span class="loader"></span>';

  // Вставляємо лоадер перед галереєю
  gallery.insertAdjacentHTML('beforebegin', loaderHTML);
}

// Функція для видалення лоадера
function removeLoader() {
  const loader = document.querySelector('.loader'); // Знаходимо лоадер
  if (loader) {
    loader.remove(); // Видаляємо лоадер з DOM
  }
}

// Функція для створення розмітки галереї на основі отриманих даних
function markup(data) {
  // Використовуємо map для створення HTML-розмітки для кожного зображення
  const markup = data.hits
    .map(
      ({
        webformatURL, // URL зображення для відображення в галереї
        largeImageURL, // Великий формат зображення для лайтбоксу
        tags, // Теги зображення
        likes, // Кількість лайків
        views, // Кількість переглядів
        comments, // Кількість коментарів
        downloads, // Кількість завантажень
      }) => `
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
    .join(''); // Перетворюємо масив у рядок HTML

  return markup; // Повертаємо створену розмітку
}
