const cryptoSelect = document.querySelector('#crypto-select');
const fiatSelect = document.querySelector('#fiat-select');
const priceResult = document.querySelector('#price-result');

// Функция для загрузки списка криптовалют
async function populateCryptoList() {
  try {
    // Делаем первый запрос к API, чтобы получить список всех монет
    const response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    if (!response.ok) throw new Error('Error with loading token list');
    const coins = await response.json();

    // Очищаем select
    cryptoSelect.innerHTML = '';

    // Заполняем select монетами
    coins.forEach(coin => {
      const option = document.createElement('option');
      option.value = coin.id;
      option.textContent = coin.name;
      cryptoSelect.appendChild(option);
    });

    // Устанавливаем значения по умолчанию
    cryptoSelect.value = 'bitcoin'; // Bitcoin по умолчанию
    fiatSelect.value = 'usd';     // USD по умолчанию

    // После успешной загрузки списка сразу получаем цену для дефолтных значений
    fetchPrice();

  } catch (error) {
    console.error('Ошибка при загрузке списка монет:', error);
    priceResult.textContent = 'Ошибка загрузки монет.';
  }
}

// Функция для получения и отображения цены ---
async function fetchPrice() {
  const cryptoId = cryptoSelect.value;
  const fiatCurrency = fiatSelect.value;

  if (!cryptoId) return; // Если по какой-то причине монета не выбрана, ничего не делаем

  priceResult.textContent = 'waiting for api...'; // Показываем статус

  try {
    // Формируем URL для второго запроса (получение цены)
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=${fiatCurrency}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error with price');
    const data = await response.json();

    // Структура ответа: data = { "bitcoin": { "usd": 1 } }
    // Поэтому нам нужно получить доступ к вложенному значению
    const price = data[cryptoId][fiatCurrency];
    
    if (price === undefined) {
      priceResult.textContent = 'Price not found';
      return;
    }

    // Форматируем и выводим результат
    const cryptoName = cryptoSelect.options[cryptoSelect.selectedIndex].text;
    priceResult.textContent = `1 ${cryptoName} = ${price.toLocaleString('ru-RU')} ${fiatCurrency.toUpperCase()}`;
    
  } catch (error) {
    console.error('Error with price:', error);
    priceResult.textContent = 'Fail with getting price.';
  }
}

// Запускаем загрузку списка монет, когда страница полностью готова
document.addEventListener('DOMContentLoaded', populateCryptoList);

// Добавляем обработчики на оба select'а. При любом изменении будет вызываться fetchPrice
cryptoSelect.addEventListener('change', fetchPrice);
fiatSelect.addEventListener('change', fetchPrice);