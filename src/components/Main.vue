<template>
  <div class="container" style="z-index:1">
    <div style=" margin: 30px 0 0 30px">
      <span style="font-size: 28px; color: #fff;">POI照片展示</span>
    </div>
    <div class="img">
      <el-carousel style="border:1px solid #f2f3f3;" play="false" type="card" prev="color:red" height="650px">
        <el-carousel-item v-for="item in images" :key="item.src">
          <img :src="item.src" class="img-xys">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="input">
      <el-input style="width: 800px" placeholder="请输入PID" v-model="poiId">
        <el-button slot="append" style="color: #000;" @click="PoiPhotoFccpid" icon="el-icon-search"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
import { poiFccpid, poiPhoto } from '../dataService/api'
import { appUtil } from '../config'
import { Utils } from '../common/js/utils.js'
export default {
  name: 'Main',
  data() {
    return {
      poiId: '',
      poiPid: '',
      fccPid: '',
      fccPidList: [],
      images: []
    }
  },
  methods: {
    async PoiPhotoFccpid() {
      // 按钮触发函数
      if (this.poiId == '') {
        this.open();
        return
      }
      var poi_pid = {
        poi_pid: this.poiId
      }
      this.images = await poiFccpid({ poi_pid }).then(function(res) {
        const fccPidList = []
        const images = []
        for (let i = 0; i < res.data.length; i++) {
          fccPidList.push(res.data[i].fccPid)
        }
        fccPidList.forEach(element => {
          images.push({
            src:
              'http://192.168.4.130:9977/tracks/d/queryPhotoByRowkey?rowkey=' +
              element +
              '&type=origin'
          })
        })
        return images
      })
    },
    open() {
      // 弹窗
      this.$alert('请检查PID是否正确填写', '警告', {
        confirmButtonText: '确定',
        callback: action => {
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: column;
  .title {
    width: 100%;
    height: 70%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .input {
    width: 100%;
    height: 30%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .img {
    width: 80%;
    height: 70%;
    margin: 30px 0 0 200px;
    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
      background-color: #d3dce6;
    }
    .img-xys {
      display: inline-block;
      height: 100%;
      width: 100%;
      max-width: 100%;
      max-height: 100%;
    }
  }
}
</style>

