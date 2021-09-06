var JsonUtil = {
    jsonToClass(json){
        let keys = this.getKeys(json)
        keys.forEach(key => {
            if(typeof json[key] == 'object' && !Array.isArray(json[key]) && json[key]!= null){
                this.classes.push({
                    className:TextUtil.capital(key),
                    properties:this.createProperty(json[key]),
                    child:json[key],
                });
            }
        });
    },
    arrayToClass(parentKey, array){
        let parsedJson = array[0];
        this.classes.push({
            className:TextUtil.capital(parentKey),
            properties:this.createProperty(parsedJson),
            child:parsedJson,
        });
    },
    objectTypeMapper(key, value){
        switch (typeof value) {
            case 'string':
                return 'String';
            case 'number':
                return 'int';
            case 'boolean':
                return 'bool';
            case 'object':
            if(Array.isArray(value)){
                let firstArray = value[0];
                let childrenType = (value.length > 0) ? this.typeMapper(key, firstArray): 'Null'
                return `List<${childrenType}>`;
            }else if(value == null){
                return 'Null'
            }
                return TextUtil.capital(key);
            default:
                return 'Null';
        }
    },
    collectionTypeMapper(key, value){
        if(Array.isArray(value)){
            let firstArray = value[0];
            let childType = (value.length > 0) ? this.typeMapper(key, firstArray): 'Null'
            return childType;
        }else{
            return null
        }
    },
    checkAndParse(rawJson){
        try {
            return JSON.parse(rawJson);
        } catch (e) {
            console.error(e.toString());
        }
    }
}

export default JsonUtil