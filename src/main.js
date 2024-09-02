// Імпорт функції для запиту до API
import { getGalleryData } from './js/pixabay-api';

// Імпорт функцій для роботи з інтерфейсом
import { addLoader, removeLoader, markup } from './js/render-functions';

// Імпорт бібліотеки iziToast
import iziToast from 'izitoast'; 
import 'izitoast/dist/css/iziToast.min.css';

// Імпорт бібліотеки SimpleLightbox для показу зображень
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Отримуємо елемент форми пошуку
const form = document.querySelector('.search-form');

// Отримуємо контейнер для галереї
const gallery = document.querySelector('.gallery');

// Отримуємо кнопку для завантаження додаткових зображень
const loadMoreBtn = document.querySelector('.load-more-button');

// Ініціалізуємо SimpleLightbox
let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt', // Використовуємо атрибут alt для підписів
  captionDelay: 250,   // Затримка перед показом підпису
});

let searchValue = '';  // Змінна для зберігання пошукового запиту
let page = 1;          // Поточна сторінка для пагінації
let totalHits = 0;     // Загальна кількість результатів з API
let shouldSmoothScroll = false; // Прапорець для контролю плавної прокрутки

// Спочатку ховаємо кнопку завантаження додаткових зображень
loadMoreBtn.style.display = 'none';  

// Додаємо обробник події submit до форми для обробки пошукового запиту
form.addEventListener('submit', onSubmitForm);

// Додаємо обробник події click до кнопки завантаження додаткових зображень
loadMoreBtn.addEventListener('click', onLoadMore);

// Функція обробки події submit на формі
function onSubmitForm(event) {
  event.preventDefault(); // Запобігаємо перезавантаженню сторінки
  
  // Отримуємо дані з форми
  const formData = new FormData(event.target);
  const { search } = Object.fromEntries(formData.entries());
  searchValue = search.trim(); // Отримуємо і очищуємо пошуковий запит

  // Якщо поле пошуку порожнє, показуємо помилку
  if (!searchValue) {
    iziToast.error({
      title: 'Error',
      message: 'The search query is empty.',
      position: 'topRight',
    });
    return;
  }

  // Скидаємо номер сторінки при новому запиті
  page = 1;
  gallery.innerHTML = ''; // Очищаємо галерею від попередніх результатів
  loadMoreBtn.style.display = 'none'; // Ховаємо кнопку

  // Додаємо лоадер під інпут форми
  addLoader(form);

  // Викликаємо функцію для запиту даних з API
  fetchGalleryData();
}

// Функція для запиту до API та відображення результатів
async function fetchGalleryData() {
  try {
    const data = await getGalleryData(searchValue, page); // Отримуємо дані з API
    totalHits = data.totalHits; // Отримуємо загальну кількість результатів

    // Якщо результатів немає, показуємо інформаційне повідомлення
    if (data.hits.length === 0) {
      iziToast.info({
        position: 'topRight',
        title: 'Info',
        message: 'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    // Генеруємо розмітку для галереї та додаємо її до контейнера
    const galleryMarkup = markup(data);
    gallery.insertAdjacentHTML('beforeend', galleryMarkup);

    // Оновлюємо лайтбокс для нових зображень
    lightbox.refresh();

    // Якщо користувач досяг кінця результатів
    if (page * 15 >= totalHits) {
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
      loadMoreBtn.style.display = 'none'; // Ховаємо кнопку
    } else {
      loadMoreBtn.style.display = 'block';  // Показуємо кнопку "Load more"
    }

  } catch (error) {
    console.error('Помилка:', error); // Виводимо помилку у консоль
    iziToast.error({
      title: 'Error',
      message: `Error: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    removeLoader(); // Видаляємо лоадер після завершення завантаження
    if (shouldSmoothScroll) {
      smoothScroll(); // Додаємо плавну прокрутку після завершення завантаження
      shouldSmoothScroll = false; // Скидаємо прапорець після прокрутки
    }
  }
}

// Функція для завантаження додаткових зображень при натисканні на кнопку "Load more"
function onLoadMore() {
  page += 1; // Збільшуємо номер сторінки для пагінації

  // Ховаємо кнопку і показуємо лоадер під кнопкою
  loadMoreBtn.style.display = 'none';
  addLoader(loadMoreBtn);

  // Встановлюємо прапорець для плавної прокрутки
  shouldSmoothScroll = true;

  // Викликаємо функцію для отримання наступної порції зображень
  fetchGalleryData();
}

// Функція для плавної прокрутки сторінки після завантаження зображень
function smoothScroll() {
  // Знаходимо перший елемент галереї
  const firstGalleryItem = document.querySelector('.gallery-item');

  // Якщо елемент знайдено
  if (firstGalleryItem) {
    // Отримуємо висоту однієї карточки галереї
    const cardHeight = firstGalleryItem.getBoundingClientRect().height;

    // Прокручуємо сторінку
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}
