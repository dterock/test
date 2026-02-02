<script lang="ts" setup>
  const form = useTemplateRef('form')
  const { isFetch, send, error, data: serverData } = useLazyFetching('/api/form')
  const noticeShow = ref<number | null>(null)

  const { errors, validate } = useValidate(form, {
    inputName: {
      required: ['Поле обязательно'],
      rangeLength: ['Длина 2-5 символов', 2, 5]
    },
    selectName: {
      enum: ['Выбери "two" или "three"', 2, 3]
    }
  })

  async function onSubmit() {
    const { data, isSuccess } = validate()

    if (isSuccess.value) {
      await send({ method: 'POST', body: JSON.stringify(data.value) })

      if (!error.value) {
        noticeShow.value = setTimeout(() => (noticeShow.value = null), 3000)
      }
    }
  }
</script>

<template>
  <form @submit.prevent="onSubmit" class="form" ref="form">
    <div v-if="noticeShow">Получены поля: {{ serverData.data }}</div>
    <div v-if="error">{{ error }}</div>

    <div>
      <input class="form-field" name="inputName" />
      <div v-for="err in errors.inputName">{{ err }}</div>
    </div>

    <div>
      <select class="form-field" name="selectName">
        <option value="1">one</option>
        <option value="2">two</option>
        <option value="3">three</option>
      </select>
      <div v-for="err in errors.selectName">{{ err }}</div>
    </div>

    <div>
      <textarea class="form-field textarea" name="textName"></textarea>
    </div>

    <button class="form-field" :disabled="isFetch">
      {{ isFetch ? 'Ожидание сервера...' : 'Отправить' }}
    </button>
  </form>
</template>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  #__nuxt {
    display: grid;
    place-items: center;
    min-height: 100dvh;
  }

  .form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 16rem;
    width: 100%;
  }

  .form-field {
    display: block;
    width: 100%;
    min-height: 2rem;
  }

  .textarea {
    min-height: 4rem;
    max-height: 10rem;
    resize: vertical;
  }
</style>
