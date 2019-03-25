# silky-scroll流畅滚动，是时候放弃你的iScroll了

滚动在pc,android,ios表现不一致的问题想必让大家苦恼了很久，使用iscroll又被反复折磨，鉴于此种情景，基于iNobounce的思想，自己写了一个插件来处理这种情况。

可以使用npm安装，也可以使用cnpm

>####npm install --save silky-scroll

使用方法，直接导入页面即可

>####import "silky-scroll";

非es6使用方法，可以找到此文件，引入到自己的页面即可，放在body前。

此插件不需做任何处理，引入及自动生效。

插件抛出以下四种方法：

##window.ss__moving()

每秒执行60次的方法，此方法优先使用时钟（requestAnimationFrame），其次使用延时器（setTimeout）

##window.ss__clearMoving()

清除上面的方法

##window.ss__scrollTo(dom,pos)

滚动到容器的某个位置，dom参数是滚动容器，不填默认body,pos是Y轴位置，支持容器，字符，数字
```
pos为bottom时，滚动到底部
pos为top时，滚动到页面顶部
pos为容器时，滚动到容器
pos为数字时，滚动到对应位置
```

##window.ss__onscroll(dom,cb[res])

监听滚动事件，dom为滚动容器，cb为回调函数

cb回调函数,res为一个对象，共有四个键值

```
isTop:是否到顶部
isBottom:是否到底部
top:容器顶部距离
bottom:容器底部距离
```
github地址：[https://github.com/dsmelon/silky-scroll.git][1]

[1]: https://github.com/dsmelon/silky-scroll.git

