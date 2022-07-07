
class Validator {
    rules
    errors = []
    _value
    _element
    messages

    constructor(form) {
        this.form = form
    }

    setMessages(messages) {
        this.messages = messages
    }

    check(rules, messages = {}) {
        this.rules = rules
        this.messages ||= messages

        Object.keys(this.rules).forEach(key => {
            const currentElement = this.form.querySelector(`[name="${key}"]`) || false
            const currentRules = this.rules[`${key}`].split('|')

            this._element = currentElement
            this._value = currentElement.value

            currentRules.forEach(rule => {
                const split = rule.split(':')

                if(currentElement && !this[`${split[0]}`](split[1]))
                    this.errors.push({[key]: {
                        name: key,
                        element: currentElement,
                        message: this.searchMessage(key, split[0]),
                        rule: rule
                    }})
            })
        })

        return this.errors
    }

    searchMessage(key, rule) {
        const variants = [this.messages[`${key}.${rule}`], this.messages[key], this.messages[rule]]
        return variants.filter(variant => Boolean(variant))[0] || ''
    }

    errorsOnly() {
        return this.errors.map(element => element[Object.keys(element)[0]].message)
            .filter(element => Boolean(element))
    }

    invalidElements() {
        return this.errors.map(element => {
            return [element[Object.keys(element)[0]].element, element[Object.keys(element)[0]].message]
        })
    }

    required() {
        return this._value.trim()
    }

    min(number) {
        return this._value.length > 0 ? String(this._value).length > number : true
    }

    max(number) {
        return this._value.length > 0 ? String(this._value).length < number : true
    }

    email() {
        return Boolean(this._value.match(/\S+@\S+\.\S+/))
    }

    confirmed() {
        const confirmation = this.form.querySelector(`[name="${this._element.name}_confirmation"]`)
        return this._value.trim() === confirmation.value.trim()
    }
}