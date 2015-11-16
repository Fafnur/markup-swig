Markup with Swig
========================

Markup & Swig - сконфигурированный gulpfile.js с включенными модулями,
такиеми как gulp-swig. Данная конфигурация, направленна на упрощение
интеграции с шаблонизатором Twig, используемый по умолчанию в Symfony,
т.к. Swig максимально приближен к Twig.

Сборка была создана под влиянием проекта  https://github.com/tars/tars
из которого был оставлен минимальный, но достаточный  для верстки функционал,
для создания полномасштабных приложений.

Что включено?
--------------

В данной конфигации включены следующие пакеты:
  * gulp;
  * browser-sync;
  * gulp-swig;
  * chokidar;
  * gulp-less;
  * gulp-sass;
  * gulp-rename;
  * gulp-minify-css;
  * gulp-autoprefixer;
  * path;
  * gulp-notify;

По умолчанию включены и подключены Twitter Bootstrap с jQuery v2.1.4 с помощью Bower
Можно использовать LESS или SASS, где LESS включен по умолчанию

Как установить и запустить?
--------------
Установка:

```shell
npm install
```

Для запуска используется команда:

```shell
gulp 
```

т.е. запускается задача по умолчанию (gulp default).

Как работает?
--------------

В папке markup хранятся все шаблоны и данные (markup/data.js) для них.
В папка web, хранятся все статичные файлы.