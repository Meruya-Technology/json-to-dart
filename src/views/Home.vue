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
      <div class="ml-6 flex-grow overflow-y-scroll">
          <h3>Result : </h3>
          <div class="mb-3" v-for="(item, index) in classes" v-bind:key="index">
            <div class="flex flex-col border border-gray bg-gray-100 rounded-lg p-3 overflow-auto">
              <div class="flex flex-row content-center items-center">
                <input type="checkbox" value="false" class="mr-3">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full text-xs mr-2" type="button" @click="copyClass(item)"><i class="feather icon-copy text-xs"></i> copy</button>
                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded-full text-xs mr-2" type="button" @click="download(item)"><i class="feather icon-download text-xs"></i> Download</button>
                <p class="flex flex-grow">{{item.className}}.dart</p>
              </div>
              <div class="flex flex-grow">
                <hr class="my-2 min-w-full">
              </div>
              <pre>{{ showAsModel(item) }}</pre>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import TextUtil from '@/utils/text/TextUtil.js'
import JsonUtil from '@/utils/json/JsonUtil.js'
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
    executeConvertion(){
      this.classes = [];
      let className = TextUtil.capital(this.firstClassName);
      JsonUtil.initClass(this.jsonInput, className)
      this.classes = JsonUtil.retrieveClass()
    },
    showAsModel(item){
      let className = item.className
      let properties = ""
      let constructors = ""
      let fromJson = ""
      let toJson = ""
      item.properties.forEach(function(property, index){
          properties += `\tfinal ${property.type} ${property.name};\n`
          constructors += `\t\trequired this.${property.name},`
          
          /// TODO : add a logic to add list / non-primitive object adapter
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
    copyClass(item){
      let text = this.showAsModel(item)
      navigator.clipboard.writeText(text).then(function(){
        alert(`Class ${item.className} copied`);
      })
    },
    download(item) {
        let text = this.showAsModel(item)
        const file = new Blob([text], {type: 'text/plain'})
        let a = document.createElement('a'),url = URL.createObjectURL(file);
        a.href = url;
        a.download = `${item.className}.dart`;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
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
