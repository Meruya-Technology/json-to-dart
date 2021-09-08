import TextUtil from '../text/TextUtil.js'
let classes = []
var JsonUtil = {
    retrieveClass(){return classes},
    initClass(rawJson, className){
        classes = []
        let parsedJson = this.checkAndParse(rawJson)
        if(parsedJson!=null){
            // let modifiedClassName = TextUtil.capital(className);
            let modifiedClassName = TextUtil.capital(className)
            classes.push({
                className:TextUtil.capital(modifiedClassName),
                properties:this.createClassObject(parsedJson),
                child:parsedJson,
            });
        }
    },
    getKeys(json){
        let keys = Object.keys(json);
        return keys;
    },
    jsonToClass(json){
        let keys = this.getKeys(json)
        keys.forEach(key => {
            if(typeof json[key] == 'object' && !Array.isArray(json[key]) && json[key]!= null){
                classes.push({
                    className:TextUtil.capital(key),
                    properties:this.createClassObject(json[key]),
                    child:json[key],
                });
            }
        });
    },
    arrayToClass(parentKey, array){
        let parsedJson = array[0];
        classes.push({
            className:TextUtil.capital(parentKey),
            properties:this.createClassObject(parsedJson),
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
                    let collectionType = (value.length > 0) ? this.collectionTypeMapper(key, value): 'Null'
                    return collectionType
                }else if(value == null){
                    return 'Null'
                }else{
                    return TextUtil.capital(key);
                }
            default:
                return 'Null';
        }
    },
    collectionTypeMapper(key, value){
        let firstArray = value[0];
        let childType = (value.length > 0) ? this.objectTypeMapper(key, firstArray): 'Null'
        return `List<${childType}>`;
    },
    checkAndParse(rawJson){
        try {
            return JSON.parse(rawJson);
        } catch (e) {
            console.error(e.toString());
            return null;
        }
    },
    createClassObject(json){
        let properties = [];
        if(json!=null){
            let property = {};
            let keys = this.getKeys(json)
            keys.forEach(key=>{
                let propertyKey = TextUtil.propercase(key.toString());
                let propertyValue = this.objectTypeMapper(key, json[key]);
                let isList = typeof json[key] == 'object' && Array.isArray(json[key])
                let isPrimitive = isList ? !(typeof json[key][0] == 'object') : true
                let childType = this.collectionTypeMapper(key, json[key])
                property = {
                    name:propertyKey,
                    type:propertyValue,
                    originalKey:key,
                    isList:isList,
                    isPrimitive:isPrimitive,
                    childType:childType
                };
                properties.push(property);
                this.repeat(json, key)
            });
        }
        return properties;
    },
    repeat(json, key){
        if(typeof json[key] == 'object'){
            if(Array.isArray(json[key]) && typeof json[key][0] == 'object'){
                this.arrayToClass(key, json[key]);
            }else{
                this.jsonToClass(json);
            }
        }
    },
    
}

export default JsonUtil