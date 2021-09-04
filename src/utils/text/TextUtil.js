
var TextUtil = {
    capital(value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    },
    propercase(value) {
        if(value.length > 2){
            return value.replace(/\w\S*/g, value.charAt(0).toLowerCase() + value.substr(1));
        }else{
            return value.toLowerCase();
        }
    },
}

export default TextUtil;