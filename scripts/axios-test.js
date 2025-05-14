const axios = require('axios');

axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=9b4f2ca2b2949a0758da04ae8ac39374&language=ru-RU')
  .then(response => {
    console.log("✅ Успешно получили данные:");
    console.log(response.data);
  })
  .catch(error => {
    console.error("❌ Ошибка при запросе:");
    console.error(error.message);
  });
