import { ReactiveEffect } from "./reactivity/effect"
import { reactive } from "./reactivity/reactive"

const user = reactive({
  name: "Shin"
})

const effect = new ReactiveEffect(null, () => {
  console.log("effect")
})

effect.record()
effect.record()

user.name

effect.end()


user.name += " Tachibana"
