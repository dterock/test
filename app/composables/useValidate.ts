import type { ShallowRef } from 'vue'

type Keys = keyof typeof validator
type Rules<K extends Keys> = [error: string, ...Params<(typeof validator)[K]>]
type Params<T extends (...p: any[]) => any> = Parameters<T> extends [unknown, ...infer R] ? R : []
type FormRef = Readonly<ShallowRef<HTMLFormElement | null, HTMLFormElement | null>>

export type ValidateRules = {
  [key: string]: Partial<{
    [K in Keys]: Rules<K>
  }>
}

export default function (form: FormRef, rules: ValidateRules) {
  const data = ref<Record<string, string>>({})
  const errors = ref<Record<string, string[]>>({})
  const isSuccess = ref(true)

  function validate() {
    clear()

    if (form.value) {
      for (const field of form.value) {
        const { name, value } = field as Element & { name: string; value: string }
        data.value[name] = value

        for (let [type, [error, ...params]] of Object.entries(rules[name] || {})) {
          const handler = validator[type as Keys] as (val: string, ...args: any[]) => boolean

          if (type in validator && !handler.call(validator, value, ...params)) {
            ;(errors.value[name] ||= []).push(error)
            isSuccess.value = false
          }
        }
      }
    }

    return {
      isSuccess,
      errors,
      data
    }
  }

  function clear() {
    data.value = {}
    errors.value = {}
    isSuccess.value = true
  }

  return {
    clear,
    validate,
    isSuccess,
    errors
  }
}

const validator = {
  required(val: string) {
    return !!val.length
  },

  rangeLength(val: string, min: number, max: number) {
    return this.minLength(val, min) && this.maxLength(val, max)
  },

  minLength(val: string, min: number) {
    return val.length >= min
  },

  maxLength(val: string, max: number) {
    return val.length <= max
  },

  enum(val: string, ...vals: (string | number)[]) {
    return vals.some((v) => val == v)
  },

  pattern(val: string, reg: RegExp) {
    return reg.test(val)
  },

  custom(val: string, cb: (v: string) => boolean) {
    return cb(val)
  }
}
