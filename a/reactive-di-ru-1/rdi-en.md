# About

Yuferev Sergey, frontend-developer QIWI.

Activity: frontend application architecture, inversion of control (IoC) ideas enhancement respecting to reactive object oriented programming.

PHP-developer since 2005 to 2012. I have seen the evolution of php frameworks from singletone-based (code igniter, kohana, symfony1, zf1, yii) to SOLID and dependency injection-based (Symfony2, zf2, yii2, laravel).

And then i start to develop javascript frontend applications and found how much things is not enough for me. SOLID and DI in the frontend and reactivity are unsolved problems. Approximately 2 years i have developed the ideas of IoC and DI with respect to reactive programming, most of them are realized in my library: reactive-di.

# How to stop the frontend-frameworks war

The usage cost of any good practice depends on application size and quality level of programming language and development tools: syntactic sugar, typings, code assembly process, the ide support, etc..

I'll tell you about high-coupling application code with frontend frameworks. How popular libraries are force us to write non-reused code, unnecessary refactoring and copy-paste. Not exactly chosen strategy at the beginning of the path, affects the future of the front-end development.

I'll tell you about try to solve these problems in reactive-di, which based on dependencty injection and reactive programming ideas. This is a something like a docker for code, having control over the state of the application, which combines the ideas of mobx, mol, cellx, angular2 di.

# short

How popular libraries force us to write non-reusable code, unnecessary refactoring and copy-paste. And how to solve these problems by developing DI ideas on the front-end.

------------------

Reactive-di is a library for reactive object-oriented programming in SOLID-style. Some ideas ideologically close to mobx, cellx, $mol_atom. But it based on the evolution of IoC and DI ideas.

Reactive-di resolves next problems:

* High-coupling of business code with rendering libraries (JSX with createElement, css-in-js with jss-like) or state-management library (store, dispatcher, action in flux-like)
* Complex wrappers around application data (like rxjs) instead using of simple mobx-like abstractions (There reactive-di is close to mobx)
* Extension points problem: with DI we can replace any data model, service or component to another realization with same interface withot refactoring and code rebuilding.
* State management
* Scopes problem: with DI we can clone separate state for component subtree (providers in component decorator in angular2)

Following SOLID practices are still hard in javascript and flow/typescript development.

Reactive-di - complete solution in terms of model, service and component, that helps to write frontend applications without coupling with low-level library implementations (react, mobx, redux, jss). Unlike mobx, where the calulations are used to bind data sources, calculated values and components, reactive-di uses for this purpose dependency injection principle.

The report will cover the following topics:

* What for SOLID and DI in javascript and what they should be on the frontend
* Bind parts of an application based on metadata or what typescript can not
* How to use inversion of control (IoC) to control reactivity
* Pull or data-flow architecture, lenses (ideas of $mol_atom and cellx)
* Universal JSX-components without React dependencies and without separation into stafeull and stateless, dumb and smart
* JS-to-CSS: reactive css without direct dependencies on jss, typestype, aphrodite, etc.
