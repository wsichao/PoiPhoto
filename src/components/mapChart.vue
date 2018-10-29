<template>
    <div id="china-map" style="width:100%;height:100%"></div>
</template>

<script>
import echarts from 'echarts'
import chinaMap from 'echarts/map/js/china'
let chartObj, vueObj = {};
export default {
    data() {
        return {}
    },
    props: [],
    mounted: function () {
        vueObj[this.$options._parentVnode.data.ref] = this;
    },
    methods: {
        init:init,
        setData: setData,
        mapClick:function(){}
    }
}


function init(param){
    initContent(param.content);
    var option = JSON.parse(JSON.stringify(param.option));
    option.ref = param.content.ref;
    initMap(option);
}
function initMap(option){
    var mapOption = {
	title : {
		subtextStyle: {color: '#000000'},
        text: '',
        textStyle: {
            color: '#feb477',
            fontWeight: 'normal',
            fontSize: 20
        },
        x: 'center',
        y: '30px'
	},
    // legend: {//图例
    //     show: true,
    //     data: ["总数", "已解决", "未解决"],
    //     icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
    //     itemWidth: 10,  // 设置宽度
    //     itemHeight: 10, // 设置高度
    //     itemGap: 40 // 设置间距
    // },
    tooltip: {//悬浮信息框
            borderRadius:5,//边框圆角
            backgroundColor:'rgba(30,144,255,0.3)',//背景颜色
            // formatter: function (params) {//信息框内容
            //     var res='<p>地点  :'+params.name+'</p>' 
            //     // var res1='<p>人数：'+[]+'</p>' 
            //     return res
            //     },
	            },
    legend: {
        // show: true,
        top: '90%',
        itemWidth: 30,
        itemHeight: 30,
        borderColor:'#df3434', 
        selectedMode:"false",
        data: [
            {
            name:'报错人数',
            color: '#fff',
            icon:'image://./static/legend.png'
            },
            
        ],
        textStyle:{
            color: ' rgba(10, 175, 230)',
            fontSize: 18
        }, 
    },
	series : [
	   {
            name: '报错人数',
            type: 'map',
            mapType: 'china',
            hoverable: false,
            roam:true,
		    data: [],
		    label: {
			   normal: {
				   formatter: '{b}',
				   position: 'right',
                   show: true,
                   color: '#ccc',//地图城市文字颜色
			   }
           },
		   itemStyle: {
			   normal: {
                    // color: #,//黄色
                    areaColor:'rgba(0, 0, 0, 0.3)',//中国地图色调or透明度
                    borderColor: '#0eb3cf',//中国地图边框线
                    borderWidth:1,//地图边框
			   },
			   emphasis:{
                    position : 'right',
                    show : true,
                    areaColor: '#0eb3cf',//地图城市点击之后颜色
                    shadowOffsetX: 0,//点击发光色位置
                    shadowOffsetY: 0,
                    shadowBlur: 10,//发光边框大小
                    borderWidth: 0,//发光边框
                    shadowColor: '#fed7b7'
			    }
           }, 
           markPoint : {
                type:'effectScatter',
                coordinateSystem:'geo',
                symbol: 'circle',//地图点的样式
                symbolSize : function (v){
                    if(v<=2){
                    return v=5
                    }else if(v<=5){
                        return v=8
                    }else if(v<=10){
                        return v=11
                    }else if(v<=30){
                        return v=14
                    }else if(v<=50){
                        return v=17
                    }else if(v<=100){
                        return v=20
                    }else if(v<=500){
                        return v=22
                    }
                },// 根据交易量值 来控制气泡半径 
                // effectType:"ripple",        //特效类型，目前只支持涟漪特效'ripple'。
                // showEffectOn: 'render',
                // rippleEffect:{              //涟漪特效相关配置。
                //     period:4,               //动画的时间。
                //     scale:2.5,              //动画中波纹的最大缩放比例。
                //     brushType:'fill',      //波纹的绘制方式，可选 'stroke' 和 'fill'。
                // },
                // showEffectOn:"render",
                effect : {
                    show: true,
                    shadowBlur : 0
                },
                itemStyle: {
                    normal: {
                        color:'#03f8f6',
                        borderColor: '#a3f10b',
                        borderWidth:  0.4,
                        shadowColor: 'rgba(0, 0, 0, 0.8)',
                        label: {
                            show: false,//poi原型文字不显示
                        },
                    },
                    emphasis: {
                        show:true,//是否在高亮状态下显示标签。
                    },
                },
                data : []
            },
        },
    ],
};
//然后就是将option添加到地图展示:
chartObj = echarts.init(document.getElementById(vueObj[option.ref].$el.id));
chartObj.setOption(mapOption);
chartObj.on('click', function(param){
    for(var o in vueObj){
        if(vueObj[o].mapClick){
            vueObj[o].mapClick(param);
        }
    }
 });
}
/**
 * 初始化表格框样式
 */
function initContent(content){
    content = content || {};
    vueObj[content.ref].$el.id = content.id || createUUID();

    var style = {
        height: '100%',
        width: '100%'
    }
    for(var o in style){
        vueObj[content.ref].$el.style[o] = style[o];
    }
}

/**
 * 设置图表数据
 * @param {Array} data 图表数据
 */
function setData(data){
    var option = chartObj.getOption();
    option.series[0].markPoint.data = data;
    chartObj.setOption(option);
}

/**
 * 随机生成ID
 * @return {String} ID值
 */
function createUUID(){
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return ('uuid_' + S4() + S4() + '_' + S4() + '_' + S4());
}

</script>
<style scoped lang="less">
</style>
