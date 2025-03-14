// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) =>
    this.#list.find((user) => user.id === id)

  static deletById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, password, data) => {
    const user = this.getById(id)

    if (user.verifyPassword(password)) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }

  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

// ======================================
// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/user-create', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('message', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'message',
    message: 'Користувача додано до списку',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.get('/user-delete', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id } = req.query

  User.deletById(Number(id))

  console.log(id)

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('message', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'message',
    message: 'Користувача видалено зі списку',
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================
router.post('/user-update', function (req, res) {
  // res.render генерує нам HTML сторінку
  const { id, email, password } = req.body

  const result = User.updateById(Number(id), password, {
    email,
  })

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('message', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'message',
    message: result
      ? 'Дані користувача змінено'
      : 'Сталася помилка',
  })
  // ↑↑ сюди вводимо JSON дані
})
// Підключаємо роутер до бек-енду
module.exports = router
