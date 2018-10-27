const wxqqmap = require('../libs/qqmap-wx-jssdk.min.js');
var config = require('../libs/config.js');
var key = config.tencentConfig.key;
var qqwxmap;
qqwxmap = new wxqqmap({
  key: key // 必填，这里最好填自己申请的的
});
import util from './util.js';
const qq = 'sdfsdf';
export default class qqmap {//获取定位信息
  getLocateInfo() {
    let that = this;
    return new Promise(function (resolve, reject) {
      that.location().then(function (val) {
        //如果通过授权，那么直接使用腾讯的微信小程序sdk获取当前定位城市
        qqwxmap.reverseGeocoder({
          location: {
            latitude: val.latitude,
            longitude: val.longitude
          },
          success: function (res) {
            console.log(res.result.address_component.city);
            resolve(res.result.address_component.city);//返回城市
          },
          fail: function (res) {
            reject(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }, function (error) {
        //如果用户拒绝了授权，那么这里会提醒他，去授权后再定位
        wx.showModal({
          title: '提示',
          content: '自动定位需要授权地理定位选项',
          confirmText: '去授权',
          success(res) {
            console.log(res);
            if (res.confirm) {
              // wx.openSetting({
              //   success: (res2) => {
              //     console.log(res2);
              //     that.getLocateInfo();
              //   }, fail: (res2) => {
              //     console.log(res2);
              //   }
              // })
            }
          },fail(res){
            console.log('fail');
          }
        })
      })
    })
  }

  //定位，获取当前经纬度
  location() {
    return new Promise(function (resolve, reject) {
      wx.getLocation({
        altitude: true,
        success: function (res) {
          resolve(res);
        }, fail(res) {
          reject(res);
        }
      })
    });
  }

  getCityList() {
    return new Promise(function (resolve, reject) {
      qqwxmap.getCityList({
        success: function(res) {
          resolve(res);
        },
        fail: function(res) {
          reject(res);
        }
      })
    });
  }
}