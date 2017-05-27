---

### Model

```js
class Counter {
    count: number = 0
}
```

- State + selector + interface <!-- .element: class="fragment" -->
- Нет undefinded багов <!-- .element: class="fragment" -->
- Нет декораторов <!-- .element: class="fragment" -->

Note: Вот, например, как выглядит модель. Начальное состояние, селектор к нему и контракт в одном флаконе. При таком подходе не может быть undefined-багов, не нужно дополнительных сериализаторов/десереализаторов. На основе моделей также делаются локализации, реактивные стили через jss. Не содержит декораторов или любых других зависимостей от фреймворка.

---

### Lifecycle

```js
@hooks(Counter)
class CounterHooks {
  pull(counter: Counter): Observable<Counter> {

    let count = counter.count

    return new Observable((observer: Observer<Count>) => {
      setTimeout(() => observer.next(++count), 1000)
    })
  }
}
```

- Отражение lifecycle в моделях <!-- .element: class="fragment" -->
- Спец. сервисы в hooks <!-- .element: class="fragment" -->

Note: Кроме традиционных способов менять состояние через экшены-сервисы, часто бывает нужно так, компонент отрендерился и вам нужно актуализировать его состояние. Тут помогают механизмы, которые есть в некоторых ORM на других языках (Doctrine, Hibernate). Логика актуализации состояния Counter задается в таком сервисе. Когда первый раз отрендерится хотя бы один компонент, использующий Counter, выполнится метод pull и Observable c этого момента будет управлять Counter ом. В mobx аналогично сделан хелпер where.

---

- Идеального инструмента нет <!-- .element: class="fragment" -->
- Но будет в ближайшие годы <!-- .element: class="fragment" -->
- Angular2 - шаг вперед <!-- .element: class="fragment" -->
- Однако, не KISS <!-- .element: class="fragment" -->
- Не сбалансировали сложность и качество <!-- .element: class="fragment" -->
- Избегайте хайпа <!-- .element: class="fragment" -->

---

<img src="i/mvc-rdi.svg" height="300" class="plain" />

Note: В начале я упоминал reactive-di. Просто несколько штрихов наброшу

---

- DI для связей: data - ui - business logic
- Ненавязчивые потоки (mobx, reactive-di)<!-- .element: class="fragment" -->
- Экосистема: типы, поддержка в ide: JSX<!-- .element: class="fragment" -->
- Высокоуровневые интерфейсы: ng-modules <!-- .element: class="fragment" -->
- Оставаться KISS<!-- .element: class="fragment" -->

Note: Я попытался выделить 1. DI - это ключ. Фреймворк должен быть изолированным набором библиотек, связанных через инверсию зависимостей, каждая библиотека со своей маленькой ответственностью (никаких state и context в ui). 2. Проектируя фреймворк, думать в первую очередь о типах и безопасности на всех уровнях MVC. 3. Должна быть настоящая модульность, центральное состояние, как в redux, не годится. 4. Фреймворк должен помогать строить приложение из иерархически выстроеных мини-приложений, которые интегрируются в общую шину, ng-modules хороший пример, аналогов которому я не нашел в мире react. 5. Оптимизация в слое фреймворка, а не приложения. Стремиться делать фреймворк таким, что бы упрощался рефакторинг. Оставаться простым и искать компромис между хилыми возможностями js/babel/flow/typescript платформ и быть дружественным к DI.

---

### redux

- Шаблонный код <!-- .element: class="fragment" -->
- Сложнее менять состояние <!-- .element: class="fragment" -->
- Центральное состояние <!-- .element: class="fragment" -->
- Типизация требует еще больше шаблонов <!-- .element: class="fragment" -->
- Простая база, но бесполезная без сложного окружения <!-- .element: class="fragment" -->

Note: Вот так плавно мы перешли к библиотекам управления состоянием. Например, redux это не про то, как уменьшить кол-во шаблонного кода, не про то, как проще поменять состояние, не про то, как разделить состояние на много кусочков т.к. основная идея - это центральный стейт. Не про то, как писать с опорой на типизацию. Это все можно конечно сделать, но путем дополнительных усилий, в виде redux-thunk, action-creator-ов, saga т.п. решений.

---

```js
export type Action =
    { type: 'LOADED_ABOUT', list: Array<ParseObject> }
  | { type: 'LOADED_NOTIFICATIONS', list: Array<ParseObject> }
  | { type: 'LOADED_MAPS', list: Array<ParseObject> }
  | { type: 'LOADED_FRIENDS_SCHEDULES', list: Array<{ id: string; name: string; schedule: {[key: string]: boolean}; }> }
  | { type: 'LOADED_CONFIG', config: ParseObject }
  | { type: 'LOADED_SESSIONS', list: Array<ParseObject> }
  | { type: 'LOADED_SURVEYS', list: Array<Object> }
  | { type: 'SUBMITTED_SURVEY_ANSWERS', id: string; }
  | { type: 'LOGGED_IN', source: ?string; data: { id: string; name: string; sharedSchedule: ?boolean; } }
  | { type: 'RESTORED_SCHEDULE', list: Array<ParseObject> }
  | { type: 'SKIPPED_LOGIN' }
  | { type: 'LOGGED_OUT' }
  | { type: 'SET_SHARING', enabled: boolean }
  // ...
  export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
  export type GetState = () => Object;
  export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
  export type PromiseAction = Promise<Action>;
```

Note: Типизацию в js не любят. Однако, если попробовать честно описать интерфейс диспетчера, то надо сперва описать общий экшен как union-тип, всех экшенов в приложении (если используется один экземпляр dispatch). Это несколько затрудняет разбиение на модули. Это из-за одного диспетчера и единого стейта.

---

```js
// ...
// single state - less modularity
function mapStateToProps(state: {user: UserState}) {
  return { name:  state.user.name } // state.user undefined
}
const AppContainer = connect(mapStateToProps)(CounterView)
```

- Single state <!-- .element: class="fragment" -->
- Типы состояния и редьюсеров <!-- .element: class="fragment" -->

Note: Рассмотрим react-redux (как и в mobx-react). Во первых, несмотря на интерфейс, state в mapStateToProps приходит от всего приложения, т.е. центральное состояние нарушает модульность приложения. Во вторых, нет сопоставления типов состояния и редьюсеров в combineReducers. state.user undefined, т.к.

---

```js
// reducer is not type checked
const reducer = combineReducers({ xyz: user })
const store = createStore(reducer)
```

- flowtype не отловит xyz вместо user

Note: В combineReducers я ошибся и написал xyz вместо user, а в mapStateToProps state.user будет undefined и flowtype не отловит это.

---

```js
// store in Provider is not type checked
// How to pass something else
// Not here
<Provider store={null /* store */}>
  <CounterContainer title="123" />
</Provider>
// flow check: Found 0 errors
```

- Provider store interface <!-- .element: class="fragment" -->
- Только store <!-- .element: class="fragment" -->
- Прибито к React вместо DI <!-- .element: class="fragment" -->

Note: В третьих, никак не проверяется интерфейс того, что мы подали в Provider. В четвертых, в контекст через провайдер нельзя передать сервис, только стор. В пятых, задача контекста, которую решает Provider, не имеет отношения ни к react, ни к ui, она относится к способу связывания слоев в приложении, к внедрению зависимостей.

---

```js
function CaseComponent({history}) {
  return <Router history={history}>
    <Route path="/" component={App}>
      <Route path="foo" component={Foo}/>
      <Route path="bar" component={Bar}/>
    </Route>
  </Router>
}
```
- ReactRouter, ReactSideEffect, ReactHelmet <!-- .element: class="fragment" -->
- Контроллеры в слое с шаблонами <!-- .element: class="fragment" -->

Note: Таких примеров много, ReactRouter, ReactSideEffect, ReactHelmet - это все реализация контроллеров в слое с шаблонами.

---

```js

class RouterState {
  path: string
}

function CaseComponent(
  {routerState}: {
    routerState: RouterState
  }
) {
  switch (routerState.path) {
    case '/': return App
    case 'foo': return Foo
    default: return App
  }
}
```

Note: А ведь достаточно просто развязать это все через состояние. Строка браузера влияет на состояние, например mobx, а дальше делается CaseComponent, который уже выбирает нужный. И не надо прибивать роутинг к реакту, а потом делать убыстренный клон реакта inferno, и копипастиь его туда, как с inferno-router.

---

- shouldComponentUpdate - костыль
- React не проектировали <!-- .element: class="fragment" -->
- Сперва mobx  <!-- .element: class="fragment" -->
- VDOM, setState, router не нужны <!-- .element: class="fragment" -->
- Redux - прослойка к mobx, а не к component <!-- .element: class="fragment" -->

Note: Костыль этот существует потому, что react начали проектировать с конца, с view слоя, а не со слоя данных. Если бы сперва слепили mobx, а на его основе сделали react, на большую часть фигни просто бы не тратили ресурсы: VDOM, setState, router, все бы упростилось до нельзя. А redux - стал бы прослойкой к mobx, что позволило бы изежать центрального стейта.

---

### Lifecycle

```js
@hooks(Counter)
class CounterHooks {
  pull(counter: Counter): Observable<Counter> {

    let count = counter.count

    return new Observable((observer: Observer<Count>) => {
      setTimeout(() => observer.next(++count), 1000)
    })
  }
}
```

Note: Часто бывает так, компонент отрендерился и вам нужно актуализировать его состояние. Тут помогают механизмы, которые есть в некоторых ORM на других языках (Doctrine, Hibernate). Логика актуализации состояния Counter задается в таком сервисе. Когда первый раз отрендерится хотя бы один компонент, использующий Counter, выполнится метод pull и Observable c этого момента будет управлять Counter ом. В mobx аналогично сделан хелпер where, в cellx и mol есть похожие механизмы.


---

### Action

```js
@actions class CounterActions {
  _counter: Counter

  constructor(counter: Counter) {
    this._counter = counter
  }

  add() {
    src(this._counter).set({
      count: this._counter.count++
    })
  }
}
```

Note: Класс, который предоставляют компоненту методы, по сути экшены, меняющие состояние: тут может быть валидация, запрос на сервер и т.д. В отличие от традиционного DI, зависимость может быть от данных (в ангуларе это называется ValueProvider), только здесь это value реактивно. состоянием CounterActions управляет reactive-di. При выполнении метода add, CounterActions переинициализируется с новым значением.
