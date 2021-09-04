<template>
  <div class="bg-white shadow-lg xl:rounded-lg lg:rounded-lg md:rounded-lg sm:rounded-none p-6 m-6">
    <h1>Json to Dart</h1>
    <p class="mb-2 text-gray-400">Created by Meruya Open Source Community</p>
    <div class="flex flex-row ">
      <div class="min-w-45">
        <div>
          <!-- <textarea placeholder="Input your json here" class="border border-gray min-w-full h-96 rounded-lg bg-gray-100 p-2" name="jsonInput" id="jsonInput" v-model="jsonInput"></textarea> -->
          <div class="text-danger" v-if="jsonInput && jsonerror">{{ jsonerror }}</div>
          <div class="text-success" v-if="!jsonerror">Valid JSON ✔</div>
          <textarea v-model="jsonInput" id="jsonText" rows="10" class="border border-gray min-w-full h-96 rounded-lg bg-gray-100 p-2 overflow-y-scroll" style="white-space: pre" placeholder="paste or type JSON here..."></textarea>
          <input type="text" class="border border-gray min-w-full rounded-lg bg-gray-100 p-2" placeholder="First classes name" v-model="firstClassName">
        </div>
        <div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-3" type="button" id="convertBtn" name="convertBtn" @click="executeConvertion">Convert</button>
        </div>
      </div>
      <div class="ml-6 flex-grow ">
          <h3>Result : </h3>
          <div class="flex flex-row content-center items-center mb-3" v-for="(item, index) in classes" v-bind:key="index">
            <input type="checkbox" value="false" class="mr-3">
            <div class="flex-grow border border-gray bg-gray-100 rounded-lg p-2 ">
              <pre>{{ showAsModel(item) }}</pre>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

import TextUtil from '../utils/text/TextUtil.js'
export default {
  name: 'MainComponent',
  data(){
    return {
      jsonInput:"",
      jsonerror: "",
      firstClassName:"",
      classes:[],
    }
  },
  methods:{
    checkJson(json){
      try {
        JSON.parse(json);
      } catch (e) {
        return false;
      }
      return true;
    },
    getKeys(parsedJson){
        let keys = Object.keys(parsedJson);
        return keys;
    },
    executeConvertion(){
      var str = JSON.stringify(this.jsonInput);
      let jsonStatus = this.checkJson(str)
      if(jsonStatus)this.createClass();
      console.log(this.classes);
    },
    createClass(){
        let parsedJson = JSON.parse(this.jsonInput)
        let className = TextUtil.capital(this.firstClassName);
        this.classes.push({
          className:TextUtil.capital(className),
          properties:this.createProperty(parsedJson),
          child:parsedJson,
        });
    },
    convertJsonToClass(parsedJson){
        let keys = this.getKeys(parsedJson)
        keys.forEach(key => {
          if(typeof parsedJson[key] == 'object' && !Array.isArray(parsedJson[key])){
            this.classes.push({
              className:TextUtil.capital(key),
              properties:this.createProperty(parsedJson[key]),
              child:parsedJson[key],
            });
          }
        });
    },
    convertArrayObjectToClass(parentKey, array){
      let parsedJson = array[0];
      this.classes.push({
        className:TextUtil.capital(parentKey),
        properties:this.createProperty(parsedJson),
        child:parsedJson,
      });
    },
    createProperty(json){
      let properties = [];
      let keys = this.getKeys(json)
      keys.forEach(key=>{
        let propertyKey = TextUtil.propercase(key.toString());
        let propertyValue = this.typeMapper(key, json[key]);
        let property = {
          name:propertyKey,
          type:propertyValue,
        };
        properties.push(property);
        if(typeof json[key] == 'object' && !Array.isArray(json[key])){
          this.convertJsonToClass(json);
        }else if(Array.isArray(json[key]) && json[key].length > 0){
          if(typeof json[key][0] == 'object'){
            this.convertArrayObjectToClass(key, json[key]);
          }
        }
      });
      return properties;
    },
    typeMapper(key, value){
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
          }
          return TextUtil.capital(key);
        default:
          return 'Null';
      }
    },
    showAsModel(item){
      let className = item.className
      let properties = ""
      let constructors = ""
      item.properties.forEach(function(property, index){
          properties += `\tfinal ${property.type} ${property.name};\n`
          constructors += `\t\trequired this.${property.name},`
          if(((index+1) != item.properties.length))constructors += `\n`;
      });
      return `class ${className} {\n${properties}\n\t${className}({\n${constructors}\n\t});\n}`;
    },
    // prettyFormat() {
    //     // reset error
    //     this.jsonerror = "";
    //     let jsonValue = "";
    //     try {
    //         // try to parse
    //         jsonValue = JSON.parse(this.jsonInput);
    //     }
    //     catch(e) {
    //         this.jsonerror = JSON.stringify(e.message)
    //         var textarea = document.getElementById("jsonText");
    //         if (this.jsonerror.indexOf('position')>-1) {
    //             // highlight error position
    //             var positionStr = this.jsonerror.lastIndexOf('position') + 8;
    //             var posi = parseInt(this.jsonerror.substr(positionStr,this.jsonerror.lastIndexOf('"')))
    //             if (posi >= 0) {
    //                 textarea.setSelectionRange(posi,posi+1);
    //             }
    //         }
    //         return "";
    //     }
    //     return JSON.stringify(jsonValue, null, 2);
    // }
  },
}
</script>

