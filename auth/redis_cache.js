// в конфиге к редису прописать expires для срока годности кеша.
// для кеширования создать отдельный модуль, который будет предоставлять простой
// api: 
//	 storeCache(key, value), где value = { articleData } (кешируем только статьи) при их первом запросе
//   при этом функция должна сама проверять, есть ли такие данные уже в кеше. Если есть - возвращаем, если
//   нет - кешируем. При этом стратегия инвалидации выполняется внешним модулем. В нашем случае при 
//   обновлении данных, хранимых в кеше, выполняем удаление старой версии. Новую версию не перезаписываем
//   deleteCache(key) - удаляет данные из кеша при их обновлении; если данные уже есть - удалить, если 
//   нет - то ничего не делать.
//   getValue(key)

const redis = require('redis'),
      config = require('../config');

const expiration = config.cache.expiration;

// как создать разные хранилища в редис - для кеша статей, кеша категорий (если будет) и сессий?
let cache = redis.createClient();

//Добавить логгирование
cache.on('error', (err) => console.log(err));

function storeValue(key, value) {
	return getValue((result) => {
		if (!result) {
			// разве не асинхронная?
			// setex(key, value);
			return setex(key, value);
		} else {
			// cache.del(key);
			// cache.setex(key, expiration, value)
			return del(key);
		}
		// если cache.setex все таки синхронная
		//return Promise.resolve();
	})
}

function getValue(key) {
	return new Promise((resolve, reject) => {
		cache.get(key, (err, result) => {
			if (err) {
				reject(err);
			}
			
			resolve(result);
		});
	});
}

function setex(key, val) {
	return new Promise((resolve, reject) => {
		cache.setex(key, expiration, val, (err, response) => {
			if (err) reject(err);
			resolve(response);
		})
	});
}

function del(key) {
	return new Promise((resolve, reject) => {
		cache.del(key, (err, response) => {
			if (err) reject(err);
			resolve(response);
		})
	});
}

module.exports = {
	storeCache: storeCache,
	getValue: getValue
};