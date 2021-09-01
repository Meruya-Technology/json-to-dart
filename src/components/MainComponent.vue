<template>
  <div class="bg-white shadow-lg xl:rounded-lg lg:rounded-lg md:rounded-lg sm:rounded-none p-6 m-6">
    <h1>Json to Dart</h1>
    <p class="mb-2 text-gray-400">Created by Meruya Open Source Community</p>
    <div class="flex flex-row ">
      <div class="min-w-45">
        <div>
          <textarea placeholder="Input your json here" class="border border-gray min-w-full h-96 rounded-lg bg-gray-100 p-2" name="jsonInput" id="jsonInput" v-model="jsonInput" @change="formatJson"></textarea>
        </div>
        <div>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-3" type="button" id="convertBtn" name="convertBtn" @click="getKeys">Convert</button>
        </div>
      </div>
      <div class="ml-6 flex-grow">
        <div class="border border-gray bg-gray-100 rounded-lg p-2 min-w-full min-h-full">
          <h3>Result : </h3>
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
      var str = JSON.stringify(this.jsonInput);
      this.formatedJson = str;
    },
    getKeys(){
      let json = JSON.parse(this.formatedJson)
      console.log(json)
      console.log(Object.keys(json))
    }
  },
}
</script>