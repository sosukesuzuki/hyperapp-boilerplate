import { h } from 'hyperapp'
import s from './index.styl'

export default (state, actions) =>
  <div class={s.main}>
    <p>{state.count}</p>
    <button onclick={actions.plus}>+</button>
    <button onclick={actions.minus}>-</button>
  </div>
