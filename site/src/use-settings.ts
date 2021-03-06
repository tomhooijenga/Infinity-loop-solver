import { reactive } from 'vue'

const settings = reactive({
  delay: 200
})

export function useSettings () {
  return {
    settings
  }
}
