// Імпорт бібліотеки axios для запитів на сервер
import axios from "axios";

// Базовий URL для запитів до API Pixabay
const API_URL = 'https://pixabay.com/api/';
// Ключ доступу до API Pixabay
const API_KEY = '45713433-433c1b648e48abad27090f3cc';

// Функція для отримання даних з API Pixabay з пагінацією
export async function getGalleryData(queryValue, page = 1, perPage = 15) {
  try {
    // Створюємо параметри запиту
    const searchParams = new URLSearchParams({
      key: API_KEY,              // API ключ
      q: queryValue,             // Пошуковий запит
      image_type: 'photo',       // Тип зображення (фото)
      orientation: 'horizontal', // Горизонтальна орієнтація зображення
      safesearch: true,          // Включений безпечний пошук
      page: page,                // Номер сторінки
      per_page: perPage          // Кількість об'єктів на сторінку (15)
    });

    // Виконуємо запит до API з Axios
    const response = await axios.get(`${API_URL}?${searchParams}`);

    // Повертаємо отримані дані
    return response.data;

  } catch (error) {
    // Обробляємо помилку та виводимо її у консоль
    console.error('Помилка під час отримання даних:', error);
    throw error; // Кидаємо помилку для обробки в інших місцях
  }
}
