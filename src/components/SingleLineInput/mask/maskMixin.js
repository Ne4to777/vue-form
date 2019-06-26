import InputMask from 'inputmask-core'
import ffpoly from './ff-polyfill'
ffpoly();
export default {
  mounted() {
    this.mask && this.initMask()
  },
  watch: {
    mask(newValue, oldValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        this.initMask()
      }
    },
    'current.value'(newValue) {
      if (this.mask && this.maskCore) this.maskCore.setValue(newValue)
    }
  },
  data() {
    return {
      marginLeft: 0,
      maskCore: null,
      updateAfterAll: false
    }
  },
  props: {
    mask: {
      validator: value => !!((value && value.length >= 1) || value instanceof Object)
    },
    placeholderChar: {
      type: String,
      default: '_',
      validator: value => !!(value && value.length === 1)
    },
  },
  methods: {
    initMask() {
      try {
        if (this.mask instanceof Object) {
          this.maskCore = new InputMask(this.mask)
        } else {
          this.maskCore = new InputMask({
            pattern: this.mask,
            value: '',
            placeholderChar: this.placeholderChar,
            formatCharacters: {
              a: {
                validate: char => /^[A-Za-zА-Яа-яёЁ]$/.test(char)
              },
              A: {
                validate: char => /^[A-Za-zА-Яа-яёЁ]$/.test(char),
                transform: char => char.toUpperCase()
              },
              '*': {
                validate: char => /^[\dA-Za-zА-Яа-яёЁ]$/.test(char)
              },
              '#': {
                validate: char => /^[\dA-Za-zА-Яа-яёЁ]$/.test(char),
                transform: char => char.toUpperCase()
              },
              '+': {
                validate: () => true
              }
            }
          })
        }
        const value = this.getValue()
        if (value) {
          [...value].reduce((memo, item) => this.maskCore.input(item), null)
        } else {
          this.maskCore.input('')
        }
        this.maskCore.setSelection({
          start: 0,
          end: 0
        })
        if (value === '') {
          this.$emit('input', '', '')
        } else {
          this.updateToCoreState()
        }
      } catch (e) {
        console.log(e);
        this.maskCore = null
        this.setValue('Error')
        this.$emit('input', this.getValue(), '')
      }
    },
    keyDown(e) {
      if (this.mask) {
        this.setNativeSelection()
        switch (e.keyCode) {
          // backspace
          case 8:
            e.preventDefault()
            if (
              this.maskCore.selection.start > this.marginLeft ||
              this.maskCore.selection.start !== this.maskCore.selection.end
            ) {
              this.maskCore.backspace()
              this.updateToCoreState()
            }
            break

          // left arrow
          case 37:
            e.preventDefault()
            if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
              // this.$refs.input.selectionEnd = this.$refs.input.selectionStart - 1; @TODO
              this.$refs.input.selectionStart -= 1
            }
            this.maskCore.selection = {
              start: this.$refs.input.selectionStart,
              end: this.$refs.input.selectionStart
            }
            this.updateToCoreState()
            break

          // right arrow
          case 39:
            e.preventDefault()
            if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
              this.$refs.input.selectionEnd += 1
            }
            this.maskCore.selection = {
              start: this.$refs.input.selectionEnd,
              end: this.$refs.input.selectionEnd
            }
            this.updateToCoreState()
            break

          // end
          case 35:
            e.preventDefault()
            this.$refs.input.selectionStart = this.getLength()
            this.$refs.input.selectionEnd = this.getLength()
            this.maskCore.selection = {
              start: this.$refs.input.selectionEnd,
              end: this.$refs.input.selectionEnd
            }
            this.updateToCoreState()
            break

          // home
          case 36:
            e.preventDefault()
            this.$refs.input.selectionStart = 0
            this.$refs.input.selectionEnd = 0
            this.maskCore.selection = {
              start: this.$refs.input.selectionStart,
              end: this.$refs.input.selectionStart
            }
            this.updateToCoreState()
            break

          // delete
          case 46:
            e.preventDefault()
            if (this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
              this.maskCore.setValue('')
              this.maskCore.setSelection({
                start: 0,
                end: 0
              })
              this.$refs.input.selectionStart = this.maskCore.selection.start
              this.$refs.input.selectionEnd = this.maskCore.selection.start
            } else {
              this.maskCore.backspace()
            }
            this.updateToCoreState()
            break

          default:
            break
        }
      }
    },
    keyPress(e) {
      if (this.mask) {
        if (e.ctrlKey) return
        const isIE = false || !!document.documentMode
        const isFirefox = typeof InstallTrigger !== 'undefined'
        if (isIE || isFirefox) {
          e.preventDefault()
          e.data = e.key
          this.textInput(e)
        }
      }
    },
    textInput(e) {
      if (this.mask) {
        if (e.preventDefault) e.preventDefault()
        if (this.maskCore.input(e.data)) {
          this.updateAfterAll = true
        }
        this.updateToCoreState()
      }
    },
    keyUp(e) {
      if (this.mask) {
        if (e.keyCode === 9) return
        // this.updateToCoreState()
        // this.updateAfterAll = false
      }
    },
    cut(e) {
      if (this.mask) {
        e.preventDefault()
        if (this.$refs.input.selectionStart !== this.$refs.input.selectionEnd) {
          try {
            document.execCommand('copy')
          } catch (err) { }
          this.maskCore.backspace()
          this.updateToCoreState()
        }
      }
    },
    copy() { },
    paste(e) {
      if (this.mask) {
        e.preventDefault()
        const text = e.clipboardData.getData('text')
          ;[...text].reduce((memo, item) => this.maskCore.input(item), null)
        this.updateToCoreState()
      }
    },
    async updateToCoreState() {
      if (this.maskCore === null) {
        return
      }
      const maskValue = this.maskCore.getValue()
      if (this.getValue() !== maskValue) {
        await this.setValue(maskValue)
      }
      this.$refs.input.selectionStart = this.maskCore.selection.start
      this.$refs.input.selectionEnd = this.maskCore.selection.end
    },
    isEmpty() {
      if (this.maskCore === null) return true
      return this.maskCore.getValue() === this.maskCore.emptyValue
    },
    focusOut() {
      if (this.mask) {
        if (this.isEmpty()) {
          this.setValue('')
          this.maskCore.setSelection({
            start: 0,
            end: 0
          })
          this.$emit('input', '', '')
        }
      }
    },
    setNativeSelection() {
      this.maskCore.selection = {
        start: this.$refs.input.selectionStart,
        end: this.$refs.input.selectionEnd
      }
    },
    mouseUp() {
      if (this.mask) {
        if (this.isEmpty() && this.$refs.input.selectionStart === this.$refs.input.selectionEnd) {
          this.maskCore.setSelection({
            start: 0,
            end: 0
          })
          this.$refs.input.selectionStart = this.maskCore.selection.start
          this.$refs.input.selectionEnd = this.maskCore.selection.start
          this.marginLeft = this.maskCore.selection.start
          this.updateToCoreState()
        } else {
          this.setNativeSelection()
        }
      }
    }
  }
}