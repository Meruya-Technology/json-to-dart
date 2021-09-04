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
          <textarea v-model="jsonInput" id="jsonText" rows="10" class="border border-gray min-w-full h-96 rounded-lg bg-gray-100 p-2" placeholder="paste or type JSON here..."></textarea>
          <pre>{{ prettyFormat }}</pre>
        </div>
        <div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-3" type="button" id="convertBtn" name="convertBtn" @click="executeConvertion">Convert</button>
        </div>
      </div>
      <div class="ml-6 flex-grow ">
          <h3>Result : </h3>
          <div class="flex flex-row content-center items-center">
            <input type="checkbox" value="false" class="mr-3">
            <div class="flex-grow border border-gray bg-gray-100 rounded-lg p-2 ">
              <!-- <div v-html="generatedClass()"></div> -->
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
      classes:[],
    }
  },
  methods:{
    checkJson(){
      var str = JSON.stringify(this.jsonInput);
      try {
        JSON.parse(str);
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
      let jsonStatus = this.checkJson()
      if(jsonStatus){
        let parsedJson = JSON.parse(this.jsonInput)
        this.convertJsonToClass(parsedJson);
      }
    },
    convertJsonToClass(parsedJson){
        let keys = this.getKeys(parsedJson)
        keys.forEach(key => {
          this.classes.push({
            className:TextUtil.capital(key),
            properties:this.createProperty(parsedJson[key]),
            child:parsedJson[key],
          });
        });
        console.log(this.classes);
    },
    createProperty(json){
      /// get keys of the json
      let properties = [];
      let keys = this.getKeys(json)
      keys.forEach(key=>{
        let property = {};
        let propertyKey = key.toString();
        let propertyValue = this.typeMapper(key, json[key]);
        property[propertyKey] = propertyValue;
        properties.push(property);
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
          return key;
        default:
          return 'Null';
      }
    },
    generatedClass(){
      let template = `<pre>${this.showClass()}</pre>`
      return template;
    },
    showClass(){
      return `class ClassName {\n}`;
    },
    prettyFormat() {
        // reset error
        this.jsonerror = "";
        let jsonValue = "";
        try {
            // try to parse
            jsonValue = JSON.parse(this.jsonInput);
        }
        catch(e) {
            this.jsonerror = JSON.stringify(e.message)
            var textarea = document.getElementById("jsonText");
            if (this.jsonerror.indexOf('position')>-1) {
                // highlight error position
                var positionStr = this.jsonerror.lastIndexOf('position') + 8;
                var posi = parseInt(this.jsonerror.substr(positionStr,this.jsonerror.lastIndexOf('"')))
                if (posi >= 0) {
                    textarea.setSelectionRange(posi,posi+1);
                }
            }
            return "";
        }
        return JSON.stringify(jsonValue, null, 2);
    }
  },
}
</script>

