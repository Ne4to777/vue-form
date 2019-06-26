export default {
  props: {
    disabled: { type: Boolean, default: false },
    required: { Boolean, default: true },
    title: String,
    value: null,
    placeholder: { type: [String, Boolean], default: 'Заполняется свободно...' },
    placeholderDisabled: { type: [String, Boolean], default: 'Ввод недоступен' },
    isValidateOnChange: { type: Boolean, default: true },
    emptyErrorMessage: String,
    minErrorMessage: String,
    max: Number,
    min: Number
  },
  data() {
    return {
      init: {
        value: this.value,
        disabled: this.disabled,
        required: this.required,
        title: this.title
      },
      empty: {
        disabled: false,
        required: false,
        title: this.title
      },
      current: {
        value: this.value,
        disabled: this.disabled,
        required: this.required,
        title: this.title
      },
      errors: {
        isEmptyMessage: this.emptyErrorMessage || 'Заполните поле',
        minMessage: this.minErrorMessage || (this.min ? `Минимальное число символов: ${this.min}` : ''),
        validatorMessage: ''
      },
      errorMessage: '',
      valid: void 0,
      lastValidateTimeStamp: 0,
      timeoutLabel: void 0,
      throttleTimeMS: 200,
      validating: false
    }
  },
  computed: {
    errorsIsEmptyValue() {
      return this.required ? !this.current.value : false
    },
    errorsMinValue() {
      return this.min === void 0 ? false : this.getLength() < this.min
    },
    errorsValidatorValue() {
      return !!this.errors.validatorMessage
    },
    hasStandartErrors() {
      return this.errorsIsEmptyValue || this.errorsMinValue
    },
    defaultErrorMessage() {
      return this.errorsIsEmptyValue && this.timeoutLabel
        ? this.errors.isEmptyMessage
        : this.errorsMinValue
          ? this.errors.minMessage
          : this.errors.validatorMessage
    }
  },
  watch: {
    value(value) {
      this.setValue(value)
    },
    'current.value'(value) {
      this.valid = void 0
      if (this.max && this.getLength() > this.max) {
        this.setLength(this.max)
      } else {
        if (this.isValidateOnChange) {
          if (this.timeoutLabel) clearTimeout(this.timeoutLabel);
          this.timeoutLabel = setTimeout(async _ => {
            this.validate(value).then(validatedValue => {
              if (validatedValue !== value) this.$emit('input', validatedValue)
            }).catch(_ => _)
          }, this.throttleTimeMS)
        }
      }
    }
  },
  methods: {
    getValue() {
      return this.current.value
    },
    setValue(x) {
      this.current.value = x
    },
    clearValue() {
      this.setValue(this.empty.value)
    },
    resetValue() {
      this.setValue(this.init.value)
    },
    clearProperties() {
      this.current.disabled = this.empty.disabled
      this.current.required = this.empty.required
    },
    resetProperties() {
      this.current.disabled = this.init.disabled
      this.current.required = this.init.required
    },
    clear() {
      this.clearProperties()
      this.clearValue()
    },
    reset() {
      this.resetProperties()
      this.resetValue()
    },
    getLength() {
      return this.getValue().length
    },
    setLength(x) {
      this.setValue(this.getValue().substring(0, x))
    },
    validate(value) {
      this.validating = true
      return new Promise((resolve, reject) => {
        if (this.hasStandartErrors) {
          this.validating = false
          this.valid = false
          reject()
        } else {
          if (this.customValidator) {
            this.errors.validatorMessage = ''
            return this.customValidator(value)
              .then(validatedValue => {
                this.errors.validatorMessage = ''
                this.valid = true
                this.validating = false
                resolve(validatedValue === void 0 ? value : validatedValue)
              })
              .catch(msg => {
                this.validating = false
                this.errors.validatorMessage = msg
                this.valid = false
                reject()
              })
          } else {
            this.validating = false
            this.valid = true
            resolve(value)
          }
        }
      })
    },
    confirm() {
      this.timeoutLabel = 1
      return new Promise((resolve, reject) => {
        const value = this.getValue()
        if (!this.validating) {
          if (this.valid === void 0) {
            const disabled = this.current.disabled
            this.current.disabled = true
            this.validate(value).then(validatedValue => {
              this.current.disabled = disabled
              resolve(validatedValue)
            }).catch(_ => {
              this.current.disabled = disabled
              reject()
            })
          } else {
            this.valid ? resolve(value) : reject()
          }
        }
      })
    }
  }
}