var ClassUtil = {
    showAsModel(item){
        let className = item.className
        let properties = ""
        let constructors = ""
        let fromJson = ""
        let toJson = ""
        item.properties.forEach(function(property, index){
            properties += `\tfinal ${property.type} ${property.name};\n`
            constructors += `\t\trequired this.${property.name},`
            if(property.isList){
                if(!property.isPrimitive){
                    fromJson += `\t\t${property.name} : List<${property.childType}>.from(json['${property.originalKey}'].map((json)=>${property.childType}.fromJson(json))),\n`
                    toJson += `\t\tdata['${property.originalKey}'] = ${property.name}.map((model) => model.toJson()).toList();`
                }else{
                    fromJson += `\t\t${property.name} : json['${property.originalKey}'].cast<${property.childType}>(),\n`
                    toJson += `\t\tdata['${property.originalKey}'] = ${property.name};`
                }
            }else{
                fromJson += `\t\t${property.name} : json['${property.originalKey}'],\n`
                toJson += `\t\tdata['${property.originalKey}'] = ${property.name};`
            }
            if(((index+1) != item.properties.length)){
                constructors += `\n`
                toJson += `\n`
            }
        });
        let fromJsonTemplate = `\n\tfactory ${className}.fromJson(Map<String, dynamic> json) => ${className}(\n${fromJson}\t);\n`
        let toJsonTemplate = `\tMap<String, dynamic> toJson() {\n\t\tfinal Map<String, dynamic> data = <String, dynamic>{};\n${toJson}\n\t\treturn data;\n\t}`
        let constructorTemplate = `${properties}\n\t${className}({\n${constructors}\n\t});`
        let classTemplate = `class ${className} {\n${constructorTemplate}\n${fromJsonTemplate}\n${toJsonTemplate}\n}`
        return classTemplate;
    },
}

export default ClassUtil