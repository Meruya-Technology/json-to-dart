
var TextUtil = {
    capital(value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    },
    propercase(value) {
        return this.replace(/\w\S*/g, value.charAt(0).toUpperCase() + value.substr(1).toLowerCase());
    },
}

export default TextUtil;