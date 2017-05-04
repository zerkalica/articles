class: center, middle, inverse

# ReactiveDI

Чекаут и рассрочка.

---
# Smart и dumb

<img src="./i/couple.svg" alt="couple" width="730" height="270"/>

* Как сохранить связанность, уменьшая зацепление.
* Или как делать модули простыми, решающими одну небольшую задачу, но знающие минимум об остальных модулях.
* props - путь к сильному зацеплению.
* redux-connect, mobx-connect, redux-reselect - путь к непереиспользуемому коду

---

class: center, middle, inverse
# Компоненты

Верстка, хуки

---

## Компоненты. Чекаут

```js
// ... imports
@statefull({
    isLoading: ['fetcher', 'isLoading'],
    loginOtp: LoginOtp,
    serverError: ['login', 'serverError']
})

export default class LoginOtpPage extends React.Component {
    render() {
        const {isLoading, loginOtp, serverError} = this.props
        return (
            <StdLayout>
                ...
            </StdLayout>
        )
    }
}
```

Как в redux-connect, mobx-connect, baobab-react, etc.

---

## Компоненты. Рассрочка

```js
// imports ...
interface OtpLoginFormState {
    theme: OtpLoginFormTheme;
    service: OtpLoginFormService;
}



export default function OtpLoginFormView(
    props: {},
    {theme, service}: OtpLoginFormState
) {
    return <form className={theme.form}>
        <button onClick={service.submit}>Продолжить</button>
    </form>
}
```

На основе типов и генерации метаданных.

---

## Хуки. Чекаут

```js
// imports ...
// @statefull

export default class LoginOtpPage extends React.Component {


    componentDidMount() {
        const {query, sendSms} = this.props
        const {operationId} = query
        if (!operationId) {
            sendSms()
        }
    }


    render() {
        // ...
    }
}

```

---

## Хуки для компонент. Рассрочка

```js
// .. imports

@hooks(OtpLoginFormView)
class OtpLoginFormHooks {
    _options: OtpLoginFormOptions
    _service: OtpLoginFormService

    constructor(
        options: OtpLoginFormOptions,
        service: OtpLoginFormService
    ) {
        this._options = options
        this._service = service
    }

    onMount() {
        if (!this._options.canSend) {
            this._service.sendSms()
        }
    }
}
```

---

## Хуки для всего. Рассрочка

```js
// .. imports
@source({key: 'OrderInfo'})
export default class OrderInfoModel {
    amount: Currency
    description: string
    transactionId: string
    // ...
}

@hooks(OrderInfoModel)
class OrderInfoHooks {
    _updater: Updater
    _loader: Loader<OrderInfoModel>

    constructor(u: OrderInfoUpdater, l: OrderInfoLoader) {
        this._updater = u
        this._loader = l
    }

    onMount() {
        this._updater.setSingle(
            () => this._loader.fetch(), OrderInfoModel)
    }
}
```

---

## Стили. Чекаут

```js
/// imports ...
export default class CarrierShortInfo extends React.Component {
    render() {
        /// props
        return (
            <div className="checkout-carrier-info">
                <div className="checkout-carrier">
                    ...
                </div>
            </div>
        )
    }
}
```

Отдельно от компонент, в css/stylus.
---
class: center, middle, inverse

# CSS modules vs JSS

---

## Стили. Рассрочка

```js
import {theme} from 'reactive-di/annotations'
import {UIVars} from 'qiwi-ui-ng'

@theme
class ProviderInfoTheme {
    __css: mixed
    container: string
    wrapper: string

    constructor(ui: UIVars) {
        this.__css = {
            container: {
                position: 'relative',
                paddingRight: `${ui.padding}px`,
                marginBottom: '25px'
            },
            [ui.mobile]: {
                container: {
                    margin: '0 0 20px 0'
                }
            }
        }
    }
}
```

---

## Стили. Рассрочка

```js
// ... imports

interface ProviderInfoState {
    theme: ProviderInfoTheme;
}

export default function ProviderInfo(
    {carrierValues}: {carrierValues: Carrier},
    {theme}: ProviderInfoState
) {
    return <div className={theme.wrapper}>
        <div className={theme.container}>
            <h1 id="providerName" className={theme.title}>
                {carrierValues.providerName}
            </h1>
        </div>
    </div>
}
```

---
class: center, middle, inverse
# Данные

Модели

---

## Данные. Чекаут

По-умолчанию:

```yml
payment:
    entities:
        info:
            $isLoading: false
        orderIn: []
```

```js
@statefull({
    info: ['payment', 'entities', 'info'],
})
```

Сеттер:

```js
@statefull({
    info: Setter(['payment', 'entities', 'info']),
})
```

---

## Данные. Рассрочка

```js
// imports ...
@source({key: 'ProviderInfo'})
export default class ProviderInfo {

    description = ''
    providerId = ''

    copy(rec: $Shape<this>): this {
        return Object.assign(
            (Object.create(this.constructor.prototype): any),
            this,
            rec
        )
    }
}
```

Аналог case-классов из scala.

Локализация аналогично.

---

## Данные. Рассрочка. Использование

```js
// import ...

interface ProviderInfoState {
    providerInfo: ProviderInfo;
}

export default function ProviderInfo(
    props: {},
    {providerInfo}: ProviderInfoState
) {
    return <div className={theme.wrapper}>
        {providerInfo.providerId}
    </div>
}
```

---
class: center, middle, inverse
# Производные от данных

View model, facet

---

## Производные от данных. Чекаут

```js
// imports ...
@class(['query'])
export default class SomeParam {
    isFail: boolean

    constructor({query}: Route) {
        this.isFail = query.fail === '1'
        if (query.fail && typeof query.fail !== 'string') {
            throw new QueryError('fail')
        }
    }
}
```

Использование:

```js
// imports ..
@statefull({ successUrl: SuccessUrl })
export default class PaymentSuccessPage extends Component {
    render() {
        return <div>{this.props.SomeParam.isFail}</div>
    }
}
```

---

## Производные от данных. Рассрочка

```js
// imports ...
export default class MFOFailParam {
    isFail: boolean

    constructor({query}: Route) {
        this.isFail = query.fail === '1'

        if (query.fail && typeof query.fail !== 'string') {
            throw new QueryError('fail')
        }
    }
}
```

---

## Производные от данных. Рассрочка

### Использование

```js
// imports ...
export default function MFOLandingView(
    props: {},
    {params}: {
        order: Order,
        params: MFOFailParams
    }
) {
    if (params.isFail) {
        return <CreditDeclinedView/>
    }

    return <div/>
}

```

---
class: center, middle, inverse
# Сервисы

Валидация, запрос на сервер, модификация состояния

---

## Сервисы. Чекаут

```js
// imports ...
function LoginByOtp({setData, setError, setIsLoading}) {
    return function _loginByOtp({operationId, smsCode}) {
        // validate
        setIsLoading(true)
        fetch(...)
            .then((data) => {
                setData(data)
                setIsLoading(false)
            })
            .catch((e) => {
                setIsLoading(false)
                setError(e.message)
            })
    }
}

export default Factory({
    setData: Setter(['orderInfo'])
    setError: Setter(['login', 'serverError']),
    setIsLoading: Setter(['fetcher', 'isLoading'])
})(LoginByOtp)
```

---

## Сервисы. Рассрочка
```js
// imports ...
export default class OtpLoginFormService {
    // ... deps
    // ... constructor(updater: OtpLoginFormUpdater, ...

    send = (values: OtpLoginFormValues) => {
        const errors: OtpLoginFormErrors = validate(values)

        const transaction: MultiUpdate[] = [errors]

        if (!errors.isError) {

            const fetchThunk = () => this._fetcher.fetch({
                body: new LoginServerParams(values)
            })
            .then(() => {
                // set state, goto, etc
            })

            transaction.push(fetchThunk)
        }

        this._updater.set(transaction)
    }
}
```

---
## Сервисы. Рассрочка. Использование

```js
// imports ...
interface OtpLoginFormState {
    service: OtpLoginFormService;
    lang: OtpLoginFormLang;
}

export default function OtpLoginFormView(
    props: {},
    {lang, service}
        : OtpLoginFormState
) {
    return <form>
        <Section type="continue">

            <Button
                onClick={service.send}
            >{lang.continue}</Button>

        </Section>
    </form>
}
```

---
class: center, middle, inverse

# Статус загрузки и сохранения

### На примере рассрочки
---

## Статус. Модель

```js
export class UpdaterStatus {
    complete: boolean
    pending: boolean
    error: ?Error
    retry: ?(() => void)
}
```

---

## Статус. Сервис

```js
// imports ...
export class CreateOrderServiceUpdater extends Updater {}


export default class CreateOrderService {
    _updater: CreateOrderServiceUpdater

    static Updater = CreateOrderServiceUpdater

    constructor(updater: CreateOrderServiceUpdater) {
        this._updater = updater
    }

    load(): void {
        this._updater.set(() => fetch())
    }
}
```

---

## Статус. Компонент.

```js
// imports ...

@updaters(CreateOrderService.Updater)
class CreateOrderUpdaterStatus extends UpdaterStatus {}

interface CreateOrderViewState {
    status: CreateOrderUpdaterStatus;
}

export default function CreateOrderView(
    props: {},
    {status}: CreateOrderViewState
) {
    if (!status.complete) {
        return <ServerLoading status={status}/>
    }

    return ...
}
```

---

# Что дает ReactiveDI

* DI и SOLID на фронтенде
* Минимум декораторного мусора
* Нет зависимости от React, mobx, redux
* Зависимость от интерфейса jss-стиля, но не самого jss
* Поддержка flow и typescript для компонент и стилей, а не только классов и функций
* Абстракция от того как, получены данные - через конфиг, rest api или еще как-то
* Реактивность не фигурирует в коде, стейт обновляет специальный сервис

---
class: center, middle

# Конец

[https://github.qiwi.com/front-dev/qiwi-credit](https://github.qiwi.com/front-dev/qiwi-credit)
