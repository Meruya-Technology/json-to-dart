<template>
  <div class="bg-white shadow-lg xl:rounded-lg lg:rounded-lg md:rounded-lg sm:rounded-none p-6 m-6">
    <h1>Json to Dart</h1>
    <p class="mb-2 text-gray-400">Created by Meruya Open Source Community</p>
    <div class="flex flex-row ">
      <div class="min-w-45">
        <div>
          <textarea placeholder="Input your json here" class="border border-gray min-w-full h-96 rounded-lg bg-gray-100 p-2" name="jsonInput" id="jsonInput" v-model="jsonInput"></textarea>
          <!-- <div contenteditable="true" v-bind:value="jsonInput" @input="jsonInput = $event" class="border border-gray min-w-full h-96 rounded-lg bg-gray-100 p-2">
            {{formatedJson}}
          </div> -->
        </div>
        <div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-3" type="button" id="convertBtn" name="convertBtn" @click="getKeys">Convert</button>
        </div>
      </div>
      <div class="ml-6 flex-grow ">
          <h3>Result : </h3>
          <div class="flex flex-row content-center items-center">
            <input type="checkbox" value="false" class="mr-3">
            <div class="flex-grow border border-gray bg-gray-100 rounded-lg p-2 ">
              <div v-html="generatedClass()"></div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainComponent',
  data(){
    return {
      jsonInput:"",
      formatedJson:{},
    }
  },
  methods:{
    formatJson(){
    },
    getKeys(){
      if(this.checkJson()){
        let parsed = JSON.parse(this.jsonInput);
        let keys = Object.keys(parsed);
        console.table(keys)
      }
    },
    checkJson(){
      var str = this.jsonInput;
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    generatedClass(){
      let template = `<pre>${this.showClass()}</pre>`
      return template;
    },
    showClass(){
      return `class ClassName {\n}`;
    }
  },
  computed:{
  }
}
</script>