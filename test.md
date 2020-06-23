81d111a045b19f82f33ce508321a52cc

npm init -y
npm install weui-miniprogram

<!-- app.json  引入weui -->
 "usingComponents": {
    "mp-icon": "weui-miniprogram/icon/icon"
  }
wx0ba22ea9508ac4c3
M4TBZ-L32W6-DYSSP-MS2UE-M26AZ-ANB52
  <!-- 微信小程序引入外部组件 iView Weapp -->
  https://www.cnblogs.com/luwanying/p/10449763.html
<!-- 和风 -->
d9900c9db707486d9a5603ef6348db66
<!-- 解析定位 -->

<!-- 今天在做小程序页面的时候，发现直接把&nbsp;写在<text>组件里面无效 -->
要给<text>设置decode属性
<text decode="true">&nbsp;&nbsp;测试&nbsp;&nbsp; &nbsp;文本</text>

<!-- 绑定key -->
	<view class="vweather" wx:for="{{tempForecast}}" wx:key="date">

<!-- 最近因为业务需求，需要在小程序中引入图表，百度一波，发现echarts已经支持了小程序。然后便试了一下demo。但是发现怎么都无法显示。我明明是完全复制的官方的demo啊。。 -->
<!-- 然后又开始了百度Google。最后找到了问题。是css的问题。如果没有用css给定限制，就会无法显示。 -->
	<ec-canvas id="mychart-dom-bar" canvas-id="mychart-bar" ec="{{ ec }}" force-use-old-canvas="true"></ec-canvas>

import * as echarts from '../../assets/ec-canvas/echarts'; 

ec-canvas {
  width: 100%;
  height: 100%;
}
.container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
} 
.picker-pos{
  margin-top: -130rpx;
  margin-left: 150rpx;
  color: blueviolet
}

<!-- globalData 全局对象-->
https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/example.html#%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83

<!-- wxs 语法 -->
https://developers.weixin.qq.com/miniprogram/dev/reference/wxs/01wxs-module.html

在wxml页面引入写好的wxs文件
<wxs src="../../utils/tools.wxs" module="tools" />


<!--catchlongtap  -->

catchtouchend="touchend"  解决长按之后的点击事件触发(加一个条件限制)



touchend() {

​    if (this.data.lock) {

​      //开锁

​      setTimeout(() => {

​        this.setData({

​          lock: false

​        });

​      }, 100);

​    }

  },