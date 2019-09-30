# lower-component

面对越来越复杂的前端系统，往往一个路由页面需要集成非常多的功能，而屏幕的显示区域是有限的，这时将屏幕外的内容模块在首屏延迟渲染是一种非常高效的优化手段。    
`lower-component`通过给组件划分等级来确定组件的渲染时机

### 基本使用
#### 1，默认提供两个level策略   

* async——内部使用setTimeout做延迟渲染

```
<lower-component level="async">
  <your-component />
</lower-component>
```
* viewport——被降级的组件进入屏幕视窗渲染

```
<lower-component level="viewport">
  <your-component />
</lower-component>
```
#### 2，自定义策略
**level赋值为custom，custom指定具体的策略实现。**   

* 提供一个函数，并返回promise（promise状态改变时渲染）

```
// stage.vue
<template>
  <lower-component level="custom" custom="getList">
    <your-component />
  </lower-component>
</template>
<script>
  export default {
    methods: {
      getList () {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
      }
    }
  }	
</script>
```
* 提供一个Boolean值（Boolean为真时渲染） 

```
// stage.vue
<template>
  <lower-component level="custom" custom="isLoading">
    <your-component />
  </lower-component>
</template>
<script>
  export default {
    data () {
      return {
        isLoading: false
      }
    }
    created () {
      this.$http.get('/list').then(() => {
        this.isLoading = true
      })
    }
  }	
</script>
```
