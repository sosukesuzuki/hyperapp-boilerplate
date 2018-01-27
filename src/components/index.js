import { h } from 'hyperapp'
import s from './index.styl'

export default (state, actions) =>
  <div class={s.main}>
    <h1>hyperapp-boilerplate</h1>
    <p>hyperapp-boilerplate is a boilerplate for quickstarting a web application with Hyperapp, JSX, Stylus, Pug, Eslint.</p>
    <p><a href="https://github.com/sosukesuzuki/hyperapp-boilerplate">github repository</a></p>
    <p>{state.count}</p>
    <button onclick={actions.plus}>+</button>
    <button onclick={actions.minus}>-</button>
  </div>
