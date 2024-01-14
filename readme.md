# koishi-plugin-cooke-tmd

[![npm](https://img.shields.io/npm/v/koishi-plugin-cooke-tmd?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-cooke-tmd)

当群u又想吃东西的时候，*做*出一份富有*爱*心的料理吧！（TheMealDB版）

## 简介
搜索食谱的一个👌插件嗷
<span style="font-size:smaller;">灵感来源：coke老师和tmd</span>

## 安装
1. 前往插件市场搜索`cooke-tmd`
2. 安装插件即可

## 使用说明
**指令 cooke-tmd**

用法：cooke-tmd <query> 或 菜谱 <query>


这个指令允许用户通过名称或原料搜索食谱。用户可以通过以下选项进行更具体的搜索：



-i [ingredients:string]：按原料搜索食谱。

-c [category:string]：按类别搜索食谱。

-a [area:string]：按地区搜索食谱。

-r：获取一个随机食谱。


当用户使用这个指令时，他们需要输入一个查询词 <query>，这个词可以是食谱的名称、原料、类别或地区。如果启用了翻译功能（由配置项enableTranslation决定），查询词将被翻译成英语后与TheMealDB API进行交互。


如果用户不输入查询词而直接使用该指令，将提示用户输入所需的搜索关键词。


**指令 list-categories**

用法：list-categories


这个指令允许用户列出所有可能的食谱类别。它不需要任何参数。当用户调用这个指令时，系统将从TheMealDB API获取所有食谱类别并将其列出返回给用户。


**示例：**


获取含有鸡肉的食谱：

```
cooke-tmd chicken -i chicken
```
这将搜索所有含有“chicken”（鸡肉）作为原料的食谱。



搜索意大利类别的食谱：

```
cooke-tmd -c Italian
```
这将列出所有“Italian”（意大利）类别下的食谱。



搜索墨西哥地区的食谱：

```
cooke-tmd -a Mexican
```
这将列出所有“Mexican”（墨西哥）地区的食谱。



获取一个随机食谱：

```
cooke-tmd -r
```
这将随机选取一个食谱并展示给用户。



列出所有类别：

```
list-categories
```
这将返回一个所有食谱类别的列表。


## 常见问题解决方案
1. 如果你遇到的问题是*配置项不满足约束，并且tmd APIKey已经填了1*
2. 将插件退回到最初的版本*v 0.0.13*重新填入配置项**1**
3. 重新升级插件到最新版本
-  如果不是步骤1的问题，请查看下述联系方式，联系插件作者解决问题


## 联系方式
<code>如果遇到任何问题的话，点击下面图片反馈吧</code>
<a href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=kW4Mvn1XZsfR_ghZfzdMK0-RlqvSlAFG&authKey=i%2ByfvnYw2qw9Y98RegxyacrannA8z9MEXQ9fICWZb%2FxCxN8atmjox399OWN%2BwR5%2F&noverify=0&group_code=778554862">
    <img src = "https://ts1.cn.mm.bing.net/th/id/R-C.270a9a085573e0969cada32727f32b2e?rik=TEUyuec7cBhg5A&riu=http%3a%2f%2fwww.guangyuanol.cn%2fuploads%2fallimg%2f221212%2f2121241109-20.gif&ehk=qDiCULkR%2f4whnJ5%2bzGrQoA7qZDpe12YPulqLLNU%2fEjs%3d&risl=&pid=ImgRaw&r=0" alt = "GROUP">
</a>