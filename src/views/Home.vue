<template>
  <div class="bg-white shadow-lg xl:rounded-lg lg:rounded-lg md:rounded-lg sm:rounded-none p-6 m-6">
    <h1>Json to Dart</h1>
    <p class="mb-2 text-gray-400">Created by Meruya Open Source Community</p>
    <div class="flex flex-row ">
      <div class="min-w-45">
        <div>
          <textarea v-model="jsonInput" id="jsonText" rows="10" class="border border-gray min-w-full h-96 rounded-lg bg-gray-100 p-2 overflow-y-scroll" style="white-space: pre" placeholder="paste or type JSON here..."></textarea>
          <input type="text" class="border border-gray min-w-full rounded-lg bg-gray-100 p-2" placeholder="First classes name" v-model="firstClassName">
          <div class="text-red-500 mt-2" v-if="jsonInput==null">Json input cannot empty</div>
          <div class="text-red-500 mt-2" v-if="jsonError!=null">{{ jsonError }}</div>
          <div class="text-green-500 mt-2" v-if="jsonError==null">Valid JSON ✔</div>
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
                <!-- <input type="checkbox" value="false" class="mr-3"> -->
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
import JsonUtil from '@/utils/json/JsonUtil.js'
import ClassUtil from '@/utils/class/ClassUtil.js'
export default {
  name: 'MainComponent',
  data(){
    return {
      jsonInput:"",
      jsonError: "",
      firstClassName:null,
      classes:[],
    }
  },
  methods:{
    executeConvertion(){
      if(this.jsonInput!=null){
        this.classes = []
        this.jsonError = null
        let className = (this.firstClassName!==null && this.firstClassName !== "" && this.firstClassName !=="null" ) ? this.firstClassName : 'ExampleClass'
        JsonUtil.initClass(this.jsonInput, className)
        this.classes = JsonUtil.retrieveClass()
        let formatedJson = this.prettyFormat()
        if(formatedJson!=null)this.jsonInput =formatedJson
      }
    },
    showAsModel(item){
      return ClassUtil.showAsModel(item)
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
    },
    prettyFormat() {
        this.jsonError = null;
        let jsonValue = "";
        try {
            jsonValue = JSON.parse(this.jsonInput);
        }
        catch(e) {
            this.jsonError = JSON.stringify(e.message)
            var textarea = document.getElementById("jsonText");
            if (this.jsonError.indexOf('position')>-1) {
                var positionStr = this.jsonError.lastIndexOf('position') + 8;
                var posi = parseInt(this.jsonError.substr(positionStr,this.jsonError.lastIndexOf('"')))
                if (posi >= 0) {
                    textarea.setSelectionRange(posi,posi+1);
                }
            }
            return null;
        }
        return JSON.stringify(jsonValue, null, "\t");
    },
  },
}
</script>
