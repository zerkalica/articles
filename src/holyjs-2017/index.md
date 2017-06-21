## От фреймворков к сверхфреймворкам

Note: Меня зовут Сергей. Я работаю фронтенд-разработчиком в компании QIWI. Вообще фронтенд разработкой занимаюсь примерно 5 лет. До этого примерно столько же писал на php. Меня всегда интересовало как писать безопасный и переиспользуемый код. Я расскажу о проблеммах фреймворков, которые мешают нам это делать. Цель - развить идею сверхфреймворка, который слабо связан с кодом приложения и является посредником для различных сторонних библиотек.

---

- PHP - Symfony, silex <!-- .element: class="fragment" -->
- Легкий каркас, библиотека, интеграция <!-- .element: class="fragment" -->
- Типы, контракты <!-- .element: class="fragment" -->
- Микросервисы, микроядерность <!-- .element: class="fragment" -->

Note: Если посмотреть, как развивались другие языки, например, java, php, то видно, что от монолитности постепенно переходят к концепции, когда фремворк - это очень легкий каркас для связи множества мелких библиотек через интерфейсы. Есть сторонняя библиотека, к ней пишется слой интеграции в фреймворк и дальше она используется как его часть. Даже говорят мета-фреймворк. Например: В PHP есть symfony, а есть его облегченная версия - silex, на тех же библиотеках, в Java аналогично с Spring. У нас, на фронтенде, наиболее близок к этой концепции - angular2, за исключением того, что сторонние библиотеки переизобретены командой angular2.

---

<img src="./i/cannonball.png" height="300" class="plain" />

- Component = view + data + logic <!-- .element: class="fragment" -->
- React.setState, redux, rxjs, mobx? <!-- .element: class="fragment" -->
- ts, flow (Angular2 driven)<!-- .element: class="fragment" -->

Note: Сейчас большинство js-фреймворков - это обычно одно ядро, вокруг которого накручено много всего. Например, react занимается и подготовкой представления и состояние там есть, и логика вокруг него накручена.

---

<img src="./i/krasnyj.png" width="300" class="plain" />

- f(props) <!-- .element: class="fragment" -->
- f(context)(props) <!-- .element: class="fragment" -->
- new F(context).method(props) <!-- .element: class="fragment" -->

Note: Базовый кирпич - это функция. Не важно о чем речь, шаблон или код. Сами функции бывают как чистые, так и с некоторым контекстом. Классы - это набор функций с контекстом в виде this.

---

### Компоненты

<img src="./i/pure-impure.svg" width="500" alt="Pure and impure fns" class="plain" />

Note: Применительно к компонентам. Все, кто программировал на реакте, знают, что компоненты бывают pure и statefull. Поведение первых зависит только от свойств, вторые от свойств и еще от контекста, под контекстом подразумевается и состояние и React.context, разница между ними только в реактивности.

---

### Context

- Vue slot <!-- .element: class="fragment" -->
- Constructor, HDI в Angular2 <!-- .element: class="fragment" -->
- React.context / Provider <!-- .element: class="fragment" -->

---

### React

- Presentional (view) <!-- .element: class="fragment" -->
- No framework reuse <!-- .element: class="fragment" -->
- <!-- .element: class="fragment" --> Container (injector, view)
- No app reuse <!-- .element: class="fragment" -->

Note: Есть dumb-компоненты (больше view), казалось бы что проще, а есть smart (больше контроллер).

---

### Чистый компонент

```js
function CounterView(props: {count: number}) {
  return <div>  Count: {props.count} </div>
}
```

- JSX + flow = контракт к шаблонам <!-- .element: class="fragment" -->
- Кастомизируемость <!-- .element: class="fragment" -->
- Рефакторинг: O(depth * props) <!-- .element: class="fragment" -->

Note: Чистый компонент, он же dumb, presentational - функция от свойств (иными словами шаблон, template). Основное преимущество в том, что все  или большинство ручек управления публичны, мы можем менять его поведение как угодно через них - т.е. компонент легко переиспользовать. Есть обротная сторона - сложно рефакторить приложение, по-большей части состоящее из таких компонент.

---

<img src="i/refactoring-O10.svg" height="500" class="plain" />

Note: Представим, что состояние есть только в корневом компоненте страницы, а все остальное - из чистых компонент, вот свойство userId в TodoEditView стало не нужным, в результате нам надо удалить его из всей цепочки. т.к. оно просто транзитом прокидывается вниз от AppView. Из-за сложности рефакторинга O(depth * props), в реальном приложении не бывает только чистых компонент, это и отличает фронтенд от бэкенда, иначе это был бы просто шаблонизатор.

---

```js
function CounterView({count}) {
  return React.createElement('div', null, 'Count: ', count)
}
```

- чистый компонент != чистая функция <!-- .element: class="fragment" -->
- ослабить связь <!-- .element: class="fragment" -->

Note: Но если собрать с babel-preset-react то появится прямая зависимость от React. Нельзя переиспользовать чистый компонент в другом фреймворке, поддерживающим JSX. Однако, можно продолжить мысль и переиспользовать в рамках языка и среды, т.е. уменьшить долю каркаса, постоянной части до минимально возможной.

---

### vue-jsx

<pre class="fragment"><code class="javascript"
>Vue.component('jsx-example', {
  render (h) { // <-- h must be in scope
    return <div id="foo">bar</div>
  }
})
</code></pre>

h auto-injection <!-- .element: class="fragment" -->

<pre class="fragment"><code class="javascript"
>Vue.component('jsx-example', {
  render () {
    // const h = this.$createElement
    return <div id="foo">bar</div>
  }
})</code></pre>

- Зависимость от Vue.component <!-- .element: class="fragment" -->

---

### Нуль-компонент

<pre class="fragment"><code class="javascript"
>function CounterView({count}, h: CreateElement) {
  return h('div', null, 'Count: ', count)
}
</code></pre>

h auto-injection <!-- .element: class="fragment" -->

<pre class="fragment"><code class="javascript"
>
function CounterView({count} /* ,h */) {
  return <div>Count: count</div>
}
</code></pre>

Переиспользовать <!-- .element: class="fragment" -->

Note: Для этого надо ослабить связь с createElement, например, добавив в конец аргумент, реализующий интефейс createElement. Такой компонент можно где угодно переиспользовать, задав соотвествующий h. Конечно усложняется написание компонента, надо добавлять аргумент, но это легко автоматизируется через babel плагин.

---

### Компонент с состоянием

- view = component(state)(props) <!-- .element: class="fragment" -->
- state - труднее кастомизировать <!-- .element: class="fragment" -->
- O((depth * subProps) + state) <!-- .element: class="fragment" -->
- props = subProps + state <!-- .element: class="fragment" -->

Note: Компонент с состянием кастомизировать сложнее, т.к. вся логика вокруг state - это приватные детали его реализации и расширять их мы больше не можем. Заранее не всегда можно сказать, потребуется ли менять или расширять их. Но с этим мирятся, т.к. приложение, где много компонент с состоянием легче рефакторить, публичных свойств меньше - часть их перетекает в state.

---

```js
class CounterView
  extends React.Component<void, {name: string}, {count: number}> {

  state = {count: 1}

  constructor(props: Props) { super(props) }

  add() {
    this.setState({ count: this.count++ })
  }

  render() { /* ... */ }
```

- React.Component <!-- .element: class="fragment" -->
- Конструктор занят под props <!-- .element: class="fragment" -->
- setState <!-- .element: class="fragment" -->

Note: React.Component - прямая завязка на реакт. Конструктор подчиняется неким негласным соглашением, что первый аргумент только props. Компонент привязан к setState и всему что вокруг него. Как же пытаются отделять состояние?

---

<pre class="fragment"><code class="javascript"
>import Component from 'my-react-like'
</code></pre>
&nbsp;
<pre class="fragment"><code class="javascript"
>class CounterView
  extends Component<{name: string}, {count: number}> {

  some: Some

  constructor(some: Some) { super(); this.some = some }

  render() { /* ... */ }
}
// ...
</code></pre>
&nbsp;
<pre class="fragment"><code class="javascript"
>&lt;CounterView name={123} /&gt; // 0 errors
</code></pre>

Типы и JSX в Vue, Deku? <!-- .element: class="fragment" -->

---

<pre><code class="javascript"
>function CounterView(props: {count: number, add: () => void}) {
  return <div>
    {props.count}: <button onClick={add}>Add</button>
  </div>
}
</code></pre>
&nbsp;
<pre class="fragment"><code class="javascript"
>function mapStateToProps(store) {
  return { count: store.counter.count }
}
const CounterContainer = connect(mapStateToProps)(CounterView)
</code></pre>
&nbsp;

<pre class="fragment"><code class="javascript"
>&lt;Provider store={'XYZ'}&gt; // unsafe
  &lt;CounterContainer/&gt;
&lt;/Provider&gt;
</code></pre>

Note: Например, как в redux. Оборачивают чистый компонент в connect, а в точке входа провайдят store, через Provider. Почему в свойство стор = XYZ в последнем блоке? Потому что flow и ts не могут обнаружить несоотвествие типов с тем, что в mapStateToProps. Как работает Provider внутри?

---

<pre class="fragment"><code class="javascript"
>class App extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  }

  getChildContext() {
    return { store: this.props.store }
  }

  render = () => &lt;CounterContainer/&gt;
}
</code></pre>
&nbsp;
<pre class="fragment"><code class="javascript"
>class CounterContainer extends React.Component {
  static contextTypes = {
    store: PropTypes.object
  }

  render = () => CounterView({ count: this.context.store.count })
}
</code></pre>

Note: Есть механизм React.context. В App мы регистрируем зависимости через getChildContext и childContextTypes. В CounterContainer мы вытаскиваем данные из контекста. Механизм этот страшный, фейсбуковцы сами его стыдятся, поэтому не сильно документируют. PropTypes - это эмуляция типизации, лохматое легаси со времен отсутствия flow. Такое решение не может нормально интегрироваться в ts или flow.

---

<img src="./i/fat-cat.jpg" height="500" class="plain" />

Note: Вообще, ui-фреймворков очень много, я не буду всех их упоминать. Сказать стоит пожалуй только про angular2, т.к. несмотря на свои недостатки, он среди всего этого зоопарка чуть приподнялся на ступеньку.

---

```js
@Component({
  selector: 'my-counter',
  templateUrl: './counter.component.html'
})
class CounterView {
  counter: number = 0
  @Input name: string

  constructor(private counterService: CounterService) {}

  addCounter() {
    this.counter = this.counterService.add(this.counter)
  }
}
```

- Component = template + view model + logic <!-- .element: class="fragment" -->
- PropTypes на constructor <!-- .element: class="fragment" -->

Note: Angular2: Один к одному сцепили шаблон, описание контракта к этому шаблону, модель, и логику по работе с ней. На ней слишком много отвественности. Нельзя прикрутить mobx, вместо, а не поверх changeDetection. Нельзя заменить changeDetection на свой, что может потребоваться как ради экспериментов, так и ради оптимизаций. Ребята из команды angular2 идею контекста сделали центральной. В итоге это гораздо ближе к нативному синтаксису typescript.

---

<pre class="fragment"><code class="typescript"
>const Injectable = 0 as any

interface ITest {}
class CounterService {}

@Injectable()
class CounterView {
  constructor(private cs: CounterService, test: ITest) {}
}
</code></pre>

tsc --emitDecoratorMetadata test.ts <!-- .element: class="fragment" -->

<pre class="fragment"><code class="typescript"
>Reflect.metadata(CounterView, "design:paramtypes", [
  CounterService,
  Object
])
</code></pre>

ITest -> Object, WAT? <!-- .element: class="fragment" -->

<!-- .element: class="fragment" --> ``` map[ITest] = SomeClass ```

Note: Что бы магия заработала, ангуларовцы, слегка прогнув микрософт с их тайпскриптом, записывают сигнатуру конструктора в метаданные. Dependency injection ангулара, вместо CounterService подсовывает готовый объект. Это называется рефлексия, во многих языках она из коробки, в ts прибитая к декораторам и не работающая с интерфейсами. Например, итерфейсы просто заменяются на Object. map[ITest] = SomeClass можно делать в C# и Dart, однако в дартовом ангуларе не используется эта фича, в отличие от C# Ninject. Именно из-за слабого развития инструментов и типизации, позволяющих делать reflection, DI был так непопулярен у нас на фронтенде. Поэтому аналогично с типами в JSX-шаблонах у ангулар2 нет здесь конкурентов.

---

### Angular2 templates

```js
@Component({
  selector: 'app',
  template: `{{cnt}} <button (click)="addSome()">Add</button>`
})
export class CounterView {
  counter: number = 0
  add(){
    this.counter += 1
  }
}
```

- Типы в шаблонах <!-- .element: class="fragment" -->
- typescript проигнорирует addSome<!-- .element: class="fragment" -->

---

### Vue

<img src="./i/ej-gvozdi.jpg" class="plain" />

---

```js
var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  mixins: [myMixin],
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
})
```

- К React.createClass, опять? <!-- .element: class="fragment" -->
- fuck the flow <!-- .element: class="fragment" -->
- Быть всем <!-- .element: class="fragment" -->
- Быть всем в монолите <!-- .element: class="fragment" -->

---

### vue-property-decorator

```js
import { Component, Inject,
  Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component class MyComponent extends Vue {
  @Inject() foo: string

  @Model('change') checked: boolean

  @Prop({ default: 'default value' }) propB: string

  @Prop([String, Boolean]) propC: string | boolean

  @Provide() foo = 'foo'

  @Provide('bar') baz = 'bar'

  @Watch('child')
  onChildChanged(val: string, oldVal: string) { }
}
```

---

### vuex - vue only

<img src="./i/vuex-noreact.png" height="400" class="plain" />

Note: В продолжении темы монолитов следует сказать про копипаст. Я уже говорил про универсальный каркас, куда интегрируются сторонние либы. Так вот на фронтенде его нет, каждый переизобретает этот каркас в своем ядре. Причем мыслят старыми категориями безтипового js, без DI. Поэтому vuex работает только с vue.

---

<img src="./i/monolit.jpg" height="500" class="plain" />

---

- react-router
- react-router-redux <!-- .element: class="fragment" -->
- mobx-react-router <!-- .element: class="fragment" -->
- inferno-router <!-- .element: class="fragment" -->
- vue-router <!-- .element: class="fragment" -->
- vuex-router-sync <!-- .element: class="fragment" -->

Note: Роутеры переизобретаются в разных сочетаниях тоже по причине не продуманности базовых вещей. Они делают все одно и тоже, в зависимости от пути в строке бразурера отдают компонент. А копипастить код приходится из-за отсутствия универсальых интерфейсов интеграции этих библиотек c состоянием.

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
- Контроллер <!-- .element: class="fragment" -->
- Смешение слоев <!-- .element: class="fragment" -->

Note: Таких примеров много, ReactRouter, ReactSideEffect, ReactHelmet - это все реализация контроллеров в слое с шаблонами.

---

<pre class="fragment"><code class="javascript"
>function CaseComponent({ path }) {
  switch (path) {
    case '/': return App
    case 'foo': return Foo
    default: return App
  }
}
</code></pre>
&nbsp;

<pre class="fragment"><code class="javascript"
>class Router {
  @observable path = ''
}
const router = new Router()
location.onChange((path: string) => {
  router.path = path
})
</code></pre>

Note: А ведь достаточно просто развязать это все через состояние. Строка браузера влияет на состояние, например mobx, а дальше делается CaseComponent, который уже выбирает нужный. И не надо прибивать роутинг к реакту, а потом делать убыстренный клон реакта inferno, и копипастиь его туда, как с inferno-router.

---

<img src="i/everywhere.png" height="500" class="plain" />

Vendor lock-in everywhere

Note: Механизма обмена решениями между фреймворками нет. Выбрав один путь - придется и выбрать экосистему вокруг фреймворка. Конкрурировать в этой гонке могут только те, у кого больше ресурсов для хайпа.

---

### Конкуренция

- Типовой код (angular -  15K, inferno - 5K) <!-- .element: class="fragment" -->
- Монолитный код <!-- .element: class="fragment" -->
- Подсадить на фреймворк <!-- .element: class="fragment" -->
- Одиночки в худшем положении <!-- .element: class="fragment" -->

---

#### Оптимизация фреймворков = хайп

<img src="i/lineika.jpg" class="plain" />

- Хайп 5 > 3 <!-- .element: class="fragment" -->
- <!-- .element: class="fragment" --> ~~Связанность, сцепленность~~
- react fiber, vdom, prepack, inferno <!-- .element: class="fragment" -->
- Не имеет отношения к решению <!-- .element: class="fragment" -->


Note: Про оптимизацию слишком много хайпа, в основном, все современные тенденции во фронтенде это про то, кто больше попугаев покажет в ui-bench: fiber, vdom, prepack, inferno. Оптимизация нужна из-за отставания браузеров от бизнес задач и медленной скорости их развития из-за легаси из которого состоит web. Так проще конкурировать, цифрами убедить проще, т.к. меньше надо знать. React 3 попугая выдает, Inferno 5, значит Inferno лучше. Конкурировать, доказывая архитектурные преимущества, гораздо сложнее. Т.к. проявляются эти преимущества не сразу и на достаточно больших задачах, увидеть их можно только в сравнении, пройдя опыт и говнокодной разработки.

---

#### Оптимизации в приложении = костыли

```js
class CounterView extends React.Component {
  state = {count: 0}

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.count === this.state.count
  }

  _add = () => this.setState({ count: this.state.count++ })

  render() {
    return <div>{this.props.name}: {this.state.count}
      <button onClick={this._add}>Add</button>
    </div>
  }
}
```

Note: Оптимизация в приложении - это доп. код, который может содержать логические ошибки и анализаторы не помогут их отловить. А вы нашли тут багу, не? Вот flow не нашел.

---

### Angular

```js
@Component({
  selector: 'app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{counter}} <button (click)="add()">Add</button>`
})
export class CounterView {
  public counter : number = 0;
  constructor(private cd: ChangeDetectorRef) {}

  add() {
    this.counter += 1
    this.cd.markForCheck()
  }
}
```

- Event -> viewRef.detectChanges <!-- .element: class="fragment" -->
- Minesweeper <!-- .element: class="fragment" -->
- OnPush = shouldComponentUpdate <!-- .element: class="fragment" -->

Note: Думаете в angular2 лучше? Там на любое событие дерагется detectChanges. Это видимо тормозной на больших приложениях механизм, который правильнее было бы не делать в ангуларе вовсе, а вынести в стороннее решение. Тут changeDetection.OnPush такой же костыль как и shouldComponentUpdate.

---

<img src="i/divan_na_kolesa.jpg" height="500" class="plain" />

Note: Это я к тому, что оптимизация в коде приложения не нормальное явление, как нам пытаются преподнести из многочисленных маркетинговых докладов. Это признание несостоятельности идеи или реализации фреймворка касательно автоматической оптимизации. Кто-нибудь помнит, как нам несколько лет назад был хайп о том, что VDOM в реакте вообще позволит не парится об оптимизации, все сделает за вас.

---

### Mobx

- cellx, derivablejs, mol
- Обратился к свойству - подписался<!-- .element: class="fragment" -->
- Ранняя точная оптимизация без VDOM <!-- .element: class="fragment" -->

Note: В свете оптимизации стоит упомянуть mobx и идейно похожие решения - derivable, cellx, mol_atom. Это все реализации ненавязчивых стримов. Подписка компонента на изменения в данных происходит в момент обращения к свойствам. Оптимизация происходит раньше, в слое данных, а не в VDOM (react) или в компонентах (angular). В подобных решения VDOM не нужен.

---

```js
const CounterView = observer(store => <div>{store.count}</div>)

const AppView = observer(store => <div>
  <CounterView count={store}/>
</div>)

class Store {
  @observable count: number = 0
}

const store = new Store()
React.render(<AppView store={store} />, document.body)

store.count = 1 // rerender
```

Note: Компоненты подписываются непосредственно на те свойства, которые они используют в Store. Можно все компоненты сделать observer-ами, но только CounterView обращается к store.count, поэтому при изменении count, будет перерисован только он. Эта идея дает гораздо больше резервов оптимизации.

---

```js
const CounterView = /*observer*/(store => <div>{store.count}</div>)

const AppView = /*observer*/(store => <div>
  <CounterView count={store}/>
</div>)

class Store {
  /*@observable*/ count: number = 0
}

const store = new Store()
React.render(<AppView store={store} />, document.body)

store.count = 1 // rerender
```

Note: Фреймворк - это каркас, с точками расширения, куда мы ваставляем данные, логику и верстку, а что если уменьшить долю каркаса до 0? Зависимость от React и mobx перейдет в зависимость от спецификации и подхода к разработке. Это позволит быть менее зависимым от хайпа.

---

### Reactive-di

---

### View

```js
class Counter { count = 0 }

function Hello(
    // public
    {text}: { text: string; },

    // private
    {counter}: { counter: Counter; }
) {
    return <div>
        <h1>{text} {counter.count}</h1>
    </div>
}
```

Note: Чистая верстка, с контрактом и разделением на публичный интрефейс (props) и приватный (context). Также, никаких декораторов и зависимостей от фреймворков.

---

```js
function Counter() { this.count = 0 }

function Hello(_ref, _ref2, _t) {
    var text = _ref.text;
    var counter = _ref2.counter;

    return _t.h(2, 'div', null, [
      _t.h(2, 'h1', null, ['count ', counter.count])
    ]);
}

Hello._isComponent = true;
Hello._dependencies = [{ counter: Counter }];
```

context = DI + metadata

Note: С помощью babel-плагина к компоненту добавляются метаданные. По метаданным движок reactive-di отличает свои компоненты от реактовых, решается проблема легаси.

---

### Lifecycle

```js
class Counter { count = 0 }

@hooks(Counter)
class CounterHooks {

  constructor(private fetcher: Fetcher) {}

  pull(counter: Counter): Observable<Counter> {
    return this.fetcher.fetch('/api/some')
  }
}
```

- Mobx / where <!-- .element: class="fragment" -->
- Cellx / pull <!-- .element: class="fragment" -->

Note: Часто бывает так, компонент отрендерился и вам нужно актуализировать его состояние. Тут помогают механизмы, которые есть в некоторых ORM на других языках (Doctrine, Hibernate). Логика актуализации состояния Counter задается в таком сервисе. Когда первый раз отрендерится хотя бы один компонент, использующий Counter, выполнится метод pull и Observable c этого момента будет управлять Counter ом. В mobx аналогично сделан хелпер where, в cellx и mol есть похожие механизмы.

---

- 15й стандарт
- Совместим с 14м (React) <!-- .element: class="fragment" -->
- Поддерживается в flow <!-- .element: class="fragment" -->
- Работает legacy <!-- .element: class="fragment" -->
- Interoperability <!-- .element: class="fragment" -->
- Ъ-Чистые <!-- .element: class="fragment" -->
-  <!-- .element: class="fragment" --> ~~Smart, dumb~~

---

<img src="./i/mvc.svg" height="300" class="plain" />

- React - View <!-- .element: class="fragment" -->
- Mobx - Model <!-- .element: class="fragment" -->
- Reactive-di - Окружение, все внутри стримов <!-- .element: class="fragment" -->

Note: reactive-di: вместо зависимостей от библиотек мы получаем зависимости от спецификаций. Фреймворк переносится из кода приложения в среду исполнения.

---

### !!!

- Экосистема вокруг типов<!-- .element: class="fragment" -->
- Слои: data - ui - business logic <!-- .element: class="fragment" -->
- Ненавязчивость (mobx)<!-- .element: class="fragment" -->
- KISS<!-- .element: class="fragment" -->
- КПД: 3-4 (angular -  15K, inferno - 5K)<!-- .element: class="fragment" -->

---

<img src="./i/ternii.jpg" height="500" class="plain" />

Note: Через тернии к звездам. Идеального решения пока нет. Надеюсь я смог показать, что в нашей любимой фронденд архитектуре есть проблемы, которые не заметны с близкого расстояния, но видны на большом. Идеи ненавязчивых потоков и инверсии зависимостей заслуживают больше внимания. Хотелось бы больше альтернатив mobx и angular2. Я, вышеозвученные характеристики реализовываю в reactive-di. А всем желаю уделять больше внимания базовым, идейным вещам, а меньше маркетинговым - хайповым, тогда наша работа станет комфортнее.

---

- [github.com/zerkalica/reactive-di](https://github.com/zerkalica/reactive-di)
- [medium.com/@sergey_yuferev](https://medium.com/@sergey_yuferev)
- [nexor@ya.ru](mailto:nexor@ya.ru)

<div style="padding-top: 4em;text-align: left;font-size: 80%;">Юферев Сергей, qiwi.ru</div>
