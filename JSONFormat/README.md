### 一个简单的 json 格式化 chrome 插件

- 支持 json 格式化
- 下载 json 文件

#### json 格式化
 依赖于 manifest.json 中的 content_scripts 字段，在注入 main.js 中可以访问和处理 dom，所以在这里根据url中输入 json 后形成的页面中获取到 json 并进行格式化的处理
 ```js
 
  "content_scripts": [
      // 文档加载开始注入 json.css 进行 json 格式化的样式处理
     {
       "matches": ["http://*/*", "https://*/*"],
       "css": ["json.css"],
       "js": ["main.js"],
       "run_at" : "document_start"
     },
     {
       "matches": ["<all_urls>"],
       "js": ["main.js"],
       "run_at": "document_end"
     }, {
       "matches": ["*://*.iframe_src.com/*"],
       "js": ["main.js"],
       "run_at": "document_end",
       "all_frames":true
     }
   ],
   // 允许下载
    "permissions": [
       "downloads",
       "<all_urls>"
     ],
   
 ```
#### 下载 json 文件

注入的 js 文件和 background.js 进行通信使用 chrome.downloads.download 下载

```js
chrome.runtime.onConnect.addListener
port.postMessage
```

###### 参考自 json-view 插件
